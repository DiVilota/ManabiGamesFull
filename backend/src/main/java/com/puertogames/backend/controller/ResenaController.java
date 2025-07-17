package com.puertogames.backend.controller;

import com.puertogames.backend.dto.request.ResenaRequestDTO;
import com.puertogames.backend.dto.request.response.ResenaResponseDTO;
import com.puertogames.backend.service.ResenaService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResenaController {
    
    private final ResenaService resenaService;
    
    @PostMapping("/resena")
    public ResponseEntity<ResenaResponseDTO> crearResena(@Valid @RequestBody ResenaRequestDTO request) {
        ResenaResponseDTO response = resenaService.crearResena(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/juego/{juegoId}")
    public ResponseEntity<List<ResenaResponseDTO>> obtenerResenasPorJuego(@PathVariable Long juegoId) {
        List<ResenaResponseDTO> response = resenaService.obtenerResenasPorJuego(juegoId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ResenaResponseDTO>> obtenerResenasPorUsuario(@PathVariable Long usuarioId) {
        List<ResenaResponseDTO> response = resenaService.obtenerResenasPorUsuario(usuarioId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/recientes")
    public ResponseEntity<List<ResenaResponseDTO>> obtenerResenasRecientes() {
        List<ResenaResponseDTO> response = resenaService.obtenerResenasRecientes();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/positivas")
    public ResponseEntity<List<ResenaResponseDTO>> obtenerResenasPositivas() {
        List<ResenaResponseDTO> response = resenaService.obtenerResenasPositivas();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/juego/{juegoId}/rating")
    public ResponseEntity<Double> obtenerRatingPromedio(@PathVariable Long juegoId) {
        Double rating = resenaService.obtenerRatingPromedio(juegoId);
        return ResponseEntity.ok(rating);
    }
    
    @GetMapping("/juego/{juegoId}/count")
    public ResponseEntity<Long> contarResenasPorJuego(@PathVariable Long juegoId) {
        Long count = resenaService.contarResenasPorJuego(juegoId);
        return ResponseEntity.ok(count);
    }
}
