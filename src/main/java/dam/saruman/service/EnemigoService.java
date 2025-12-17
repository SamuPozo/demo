package dam.saruman.service;

import dam.saruman.entity.Enemigo;
import dam.saruman.repository.EnemigoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnemigoService {
    @Autowired
    private EnemigoRepository enemigoRepository;

    public List<Enemigo> obtenerTodos(){
        List<Enemigo> enemigos = enemigoRepository.findAll();
        if(enemigos.isEmpty()){
            System.out.println("Achio ");
        }else {
            System.out.println("Jefe esto va como una máquina");
            enemigos.forEach(enemigo -> {
                System.out.println("ID: " + enemigo.getId());
            });
        }
        return enemigos;
    }

    public Enemigo insertar(Enemigo enemigo){
        System.out.println("Insertando enemigo: " + enemigo.getNombre());
        return enemigoRepository.save(enemigo);
    }

    public Enemigo actualizar(String id, Enemigo enemigoActualizado){
        Optional<Enemigo> enemigoExistente = enemigoRepository.findById(id);
        if(enemigoExistente.isPresent()){
            Enemigo enemigo = enemigoExistente.get();
            enemigo.setNombre(enemigoActualizado.getNombre());
            enemigo.setPais(enemigoActualizado.getPais());
            enemigo.setAfiliacion(enemigoActualizado.getAfiliacion());
            System.out.println("Actualizando enemigo ID: " + id);
            return enemigoRepository.save(enemigo);
        } else {
            System.out.println("Enemigo no encontrado con ID: " + id);
            return null;
        }
    }

    public boolean eliminar(String id){
        Optional<Enemigo> enemigo = enemigoRepository.findById(id);
        if(enemigo.isPresent()){
            enemigoRepository.deleteById(id);
            System.out.println("Enemigo eliminado con ID: " + id);
            return true;
        } else {
            System.out.println("Enemigo no encontrado con ID: " + id);
            return false;
        }
    }
}