package dam.saruman.controller;

import dam.saruman.entity.Enemigo;
import dam.saruman.service.EnemigoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EnemigoController {
    @Autowired
    private EnemigoService enemigoService;

    @GetMapping("/enemigo")
    public List<Enemigo> obtenerEnemigos(){
        return enemigoService.obtenerTodos();
    }

    // NUEVO: Buscar por nombre
    @GetMapping("/enemigo/buscar")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre){
        try {
            List<Enemigo> enemigos = enemigoService.buscarPorNombre(nombre);
            if(enemigos.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(crearRespuestaError("No se encontraron enemigos con el nombre: " + nombre));
            }
            return ResponseEntity.ok(enemigos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al buscar: " + e.getMessage()));
        }
    }

    @PostMapping("/enemigo")
    public ResponseEntity<?> insertarEnemigo(@Valid @RequestBody Enemigo enemigo, BindingResult result){
        // NUEVO: Validar errores
        if(result.hasErrors()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(crearRespuestaError(result.getAllErrors().get(0).getDefaultMessage()));
        }

        try {
            Enemigo nuevoEnemigo = enemigoService.insertar(enemigo);
            return new ResponseEntity<>(nuevoEnemigo, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(crearRespuestaError(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al insertar enemigo: " + e.getMessage()));
        }
    }

    @PutMapping("/enemigo/{id}")
    public ResponseEntity<?> editarEnemigo(@PathVariable String id, @Valid @RequestBody Enemigo enemigo, BindingResult result){
        // NUEVO: Validar errores
        if(result.hasErrors()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(crearRespuestaError(result.getAllErrors().get(0).getDefaultMessage()));
        }

        try {
            Enemigo enemigoActualizado = enemigoService.actualizar(id, enemigo);
            return new ResponseEntity<>(enemigoActualizado, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(crearRespuestaError(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al actualizar enemigo: " + e.getMessage()));
        }
    }

    @DeleteMapping("/enemigo/{id}")
    public ResponseEntity<?> eliminarEnemigo(@PathVariable String id){
        try {
            enemigoService.eliminar(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(crearRespuestaError(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(crearRespuestaError("Error al eliminar enemigo: " + e.getMessage()));
        }
    }

    // NUEVO: Método auxiliar para errores
    private Map<String, String> crearRespuestaError(String mensaje){
        Map<String, String> error = new HashMap<>();
        error.put("error", mensaje);
        return error;
    }
}