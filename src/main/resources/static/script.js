document.addEventListener('DOMContentLoaded', () => {
    cargarEnemigos();

    // Event listeners para los formularios
    document.getElementById('formInsertar').addEventListener('submit', insertarEnemigo);
    document.getElementById('formEditar').addEventListener('submit', editarEnemigo);
    document.getElementById('formEliminar').addEventListener('submit', eliminarEnemigo);
});

async function cargarEnemigos() {
    try {
        const response = await fetch('api/enemigo');
        const enemigos = await response.json();
        mostrarEnemigos(enemigos);

    } catch (error) {
        console.error("Error al cargar enemigos: " + error);
    }
}

function mostrarEnemigos(enemigos) {
    const tbody = document.getElementById('EnemigosBody');
    const table = document.getElementById('EnemigosTable');

    tbody.innerHTML = '';

    if (enemigos.length === 0) {
        console.log("No hay enemigos");
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

// INSERTAR
async function insertarEnemigo(e) {
    e.preventDefault();

    const nombre = document.getElementById('insertNombre').value;
    const pais = document.getElementById('insertPais').value;
    const afiliacion = document.getElementById('insertAfiliacion').value;

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
            cargarEnemigos(); // Recargar la tabla
        } else {
            mostrarMensaje('mensajeInsertar', 'Error al insertar enemigo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeInsertar', 'Error al insertar enemigo: ' + error, 'error');
    }
}

// EDITAR
async function editarEnemigo(e) {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const nombre = document.getElementById('editNombre').value;
    const pais = document.getElementById('editPais').value;
    const afiliacion = document.getElementById('editAfiliacion').value;

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
            cargarEnemigos(); // Recargar la tabla
        } else {
            mostrarMensaje('mensajeEditar', 'Error al actualizar enemigo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeEditar', 'Error al actualizar enemigo: ' + error, 'error');
    }
}

// ELIMINAR
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
            cargarEnemigos(); // Recargar la tabla
        } else {
            mostrarMensaje('mensajeEliminar', 'Error al eliminar enemigo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('mensajeEliminar', 'Error al eliminar enemigo: ' + error, 'error');
    }
}

// Función auxiliar para mostrar mensajes
function mostrarMensaje(elementoId, mensaje, tipo) {
    const elemento = document.getElementById(elementoId);
    elemento.textContent = mensaje;
    elemento.className = `mensaje ${tipo}`;
    elemento.style.display = 'block';

    setTimeout(() => {
        elemento.style.display = 'none';
    }, 3000);
}