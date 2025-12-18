let enemigosGlobales = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarEnemigos();

    document.getElementById('formInsertar').addEventListener('submit', insertarEnemigo);
    document.getElementById('formEditar').addEventListener('submit', editarEnemigo);
    document.getElementById('formEliminar').addEventListener('submit', eliminarEnemigo);
});

async function cargarEnemigos() {
    try {
        const response = await fetch('api/enemigo');
        const enemigos = await response.json();
        enemigosGlobales = enemigos;
        mostrarEnemigos(enemigos);
    } catch (error) {
        console.error("Error al cargar enemigos: " + error);
        mostrarMensajeGeneral("Error al cargar enemigos", "error");
    }
}

function mostrarEnemigos(enemigos) {
    const tbody = document.getElementById('EnemigosBody');
    const table = document.getElementById('EnemigosTable');

    tbody.innerHTML = '';

    if (enemigos.length === 0) {
        console.log("No hay enemigos");
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay enemigos registrados</td></tr>';
        return;
    }

    enemigos.forEach(enemigo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${enemigo.id}</td>
            <td>${enemigo.nombre}</td>
            <td>${enemigo.pais}</td>
            <td>${enemigo.afiliacion}</td>
        `;
        tbody.appendChild(tr);
    });

    table.style.display = 'table';
}

// NUEVO: Buscar
async function buscarEnemigo() {
    const nombre = document.getElementById('searchInput').value.trim();

    if(!nombre){
        mostrarMensajeGeneral("Por favor ingresa un nombre para buscar", "error");
        return;
    }

    try {
        const response = await fetch(`api/enemigo/buscar?nombre=${encodeURIComponent(nombre)}`);

        if (response.ok) {
            const enemigos = await response.json();
            enemigosGlobales = enemigos;
            mostrarEnemigos(enemigos);
            mostrarMensajeGeneral(`Se encontraron ${enemigos.length} enemigo(s)`, "exito");
        } else {
            const error = await response.json();
            mostrarMensajeGeneral(error.error || "No se encontraron resultados", "error");
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensajeGeneral('Error al buscar: ' + error, 'error');
    }
}

// NUEVO: Limpiar búsqueda
function limpiarBusqueda() {
    document.getElementById('searchInput').value = '';
    cargarEnemigos();
}

// NUEVO: Ordenar
function ordenarAlfabeticamente() {
    const enemigosOrdenados = [...enemigosGlobales].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
    );
    mostrarEnemigos(enemigosOrdenados);
    mostrarMensajeGeneral("Tabla ordenada alfabéticamente", "exito");
}

// NUEVO: Descargar CSV
function descargarCSV() {
    if(enemigosGlobales.length === 0){
        mostrarMensajeGeneral("No hay datos para descargar", "error");
        return;
    }

    let csv = 'ID,Nombre,País,Afiliación\n';
    enemigosGlobales.forEach(enemigo => {
        csv += `"${enemigo.id}","${enemigo.nombre}","${enemigo.pais}","${enemigo.afiliacion}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'enemigos.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarMensajeGeneral("Archivo CSV descargado correctamente", "exito");
}

async function insertarEnemigo(e) {
    e.preventDefault();

    const nombre = document.getElementById('insertNombre').value;
    const pais = document.getElementById('insertPais').value;
    const afiliacion = document.getElementById('insertAfiliacion').value;

    if(nombre.length < 3){
        mostrarMensaje('mensajeInsertar', 'El nombre debe tener al menos 3 caracteres', 'error');
        return;
    }

    const nuevoEnemigo = {
        nombre: nombre,
        pais: pais,
        afiliacion: afiliacion
    };

    try {
        const response = await fetch('api/enemigo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoEnemigo)
        });

        if (response.ok) {
            mostrarMensaje('mensajeInsertar', 'Enemigo insertado correctamente', 'exito');
            document.getElementById('formInsertar').reset();
            cargarEnemigos();
        } else {
            const error = await response.json();
            mostrarMensaje('mensajeInsertar', error.error || 'Error al insertar enemigo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeInsertar', 'Error al insertar enemigo: ' + error, 'error');
    }
}

async function editarEnemigo(e) {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const nombre = document.getElementById('editNombre').value;
    const pais = document.getElementById('editPais').value;
    const afiliacion = document.getElementById('editAfiliacion').value;

    if(nombre.length < 3){
        mostrarMensaje('mensajeEditar', 'El nombre debe tener al menos 3 caracteres', 'error');
        return;
    }

    const enemigoActualizado = {
        nombre: nombre,
        pais: pais,
        afiliacion: afiliacion
    };

    try {
        const response = await fetch(`api/enemigo/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enemigoActualizado)
        });

        if (response.ok) {
            mostrarMensaje('mensajeEditar', 'Enemigo actualizado correctamente', 'exito');
            document.getElementById('formEditar').reset();
            cargarEnemigos();
        } else {
            const error = await response.json();
            mostrarMensaje('mensajeEditar', error.error || 'Error al actualizar enemigo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeEditar', 'Error al actualizar enemigo: ' + error, 'error');
    }
}

async function eliminarEnemigo(e) {
    e.preventDefault();

    const id = document.getElementById('deleteId').value;

    if (!confirm('¿Estás seguro de que quieres eliminar este enemigo?')) {
        return;
    }

    try {
        const response = await fetch(`api/enemigo/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarMensaje('mensajeEliminar', 'Enemigo eliminado correctamente', 'exito');
            document.getElementById('formEliminar').reset();
            cargarEnemigos();
        } else {
            const error = await response.json();
            mostrarMensaje('mensajeEliminar', error.error || 'Error al eliminar enemigo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeEliminar', 'Error al eliminar enemigo: ' + error, 'error');
    }
}

function mostrarMensaje(elementoId, mensaje, tipo) {
    const elemento = document.getElementById(elementoId);
    elemento.textContent = mensaje;
    elemento.className = `mensaje ${tipo}`;
    elemento.style.display = 'block';

    setTimeout(() => {
        elemento.style.display = 'none';
    }, 3000);
}

function mostrarMensajeGeneral(mensaje, tipo) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje ${tipo} mensaje-flotante`;
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);

    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}