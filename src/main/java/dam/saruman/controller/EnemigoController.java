package dam.saruman.controller;

import dam.saruman.entity.Enemigo;
import dam.saruman.service.EnemigoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EnemigoController {
    @Autowired
    private EnemigoService enemigoService;

    @GetMapping("/enemigo")
    public List<Enemigo> obtenerEnemigos(){
        return enemigoService.obtenerTodos();
    }

    @PostMapping("/enemigo")
    public ResponseEntity<Enemigo> insertarEnemigo(@RequestBody Enemigo enemigo){
        Enemigo nuevoEnemigo = enemigoService.insertar(enemigo);
        return new ResponseEntity<>(nuevoEnemigo, HttpStatus.CREATED);
    }

    @PutMapping("/enemigo/{id}")
    public ResponseEntity<Enemigo> editarEnemigo(@PathVariable Long id, @RequestBody Enemigo enemigo){
        Enemigo enemigoActualizado = enemigoService.actualizar(id, enemigo);
        if(enemigoActualizado != null){
            return new ResponseEntity<>(enemigoActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/enemigo/{id}")
    public ResponseEntity<Void> eliminarEnemigo(@PathVariable Long id){
        boolean eliminado = enemigoService.eliminar(id);
        if(eliminado){
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
