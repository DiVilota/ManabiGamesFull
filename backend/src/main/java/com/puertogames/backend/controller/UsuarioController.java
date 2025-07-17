package com.puertogames.backend.controller;

import com.puertogames.backend.dto.request.UsuarioRequestDTO;
import com.puertogames.backend.dto.request.response.UsuarioResponseDTO;
import com.puertogames.backend.service.UsuarioService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    private final UsuarioService usuarioService;
    
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(@Valid @RequestBody UsuarioRequestDTO request) {
        UsuarioResponseDTO response = usuarioService.crearUsuario(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuario(@PathVariable Long id) {
        UsuarioResponseDTO response = usuarioService.obtenerUsuario(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodosUsuarios() {
        List<UsuarioResponseDTO> response = usuarioService.obtenerTodosUsuarios();
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<UsuarioResponseDTO> actualizarEstadoOnline(
            @PathVariable Long id, 
            @RequestParam Boolean online) {
        UsuarioResponseDTO response = usuarioService.actualizarEstadoOnline(id, online);
        return ResponseEntity.ok(response);
    }
}