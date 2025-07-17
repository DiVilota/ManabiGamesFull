package com.puertogames.backend.controller;

import com.puertogames.backend.dto.request.JuegoRequestDTO;
import com.puertogames.backend.dto.request.response.JuegoResponseDTO;
import com.puertogames.backend.service.JuegoService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/juegos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JuegoController {
    
    private final JuegoService juegoService;
    
    @PostMapping
    public ResponseEntity<JuegoResponseDTO> crearJuego(@Valid @RequestBody JuegoRequestDTO request) {
        JuegoResponseDTO response = juegoService.crearJuego(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<JuegoResponseDTO> obtenerJuego(@PathVariable Long id) {
        JuegoResponseDTO response = juegoService.obtenerJuego(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<JuegoResponseDTO>> obtenerTodosJuegos() {
        List<JuegoResponseDTO> response = juegoService.obtenerTodosJuegos();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<JuegoResponseDTO>> obtenerJuegosPorCategoria(@PathVariable String categoria) {
        List<JuegoResponseDTO> response = juegoService.obtenerJuegosPorCategoria(categoria);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/mas-vistos")
    public ResponseEntity<List<JuegoResponseDTO>> obtenerJuegosMasVistos() {
        List<JuegoResponseDTO> response = juegoService.obtenerJuegosMasVistos();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/mejor-rankeados")
    public ResponseEntity<List<JuegoResponseDTO>> obtenerJuegosMejorRankeados() {
        List<JuegoResponseDTO> response = juegoService.obtenerJuegosMejorRankeados();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<JuegoResponseDTO>> buscarJuegos(@RequestParam String nombre) {
        List<JuegoResponseDTO> response = juegoService.buscarJuegos(nombre);
        return ResponseEntity.ok(response);
    }
}
