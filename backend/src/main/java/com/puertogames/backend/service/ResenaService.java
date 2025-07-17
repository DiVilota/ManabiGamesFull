package com.puertogames.backend.service;

import com.puertogames.backend.dto.request.ResenaRequestDTO;
import com.puertogames.backend.dto.request.response.ResenaResponseDTO;
import com.puertogames.backend.entity.Juego;
import com.puertogames.backend.entity.Resena;
import com.puertogames.backend.entity.Usuario;
import com.puertogames.backend.repository.JuegoRepository;
import com.puertogames.backend.repository.ResenaRepository;
import com.puertogames.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResenaService {
    
    private final ResenaRepository resenaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JuegoRepository juegoRepository;
    private final JuegoService juegoService;
    
    public ResenaResponseDTO crearResena(ResenaRequestDTO request) {
        log.info("Creando reseña para juego: {}", request.getJuegoId());
        
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Juego juego = juegoRepository.findById(request.getJuegoId())
                .orElseThrow(() -> new RuntimeException("Juego no encontrado"));
        
        // Verificar si el usuario ya tiene reseña para este juego
        List<Resena> resenasExistentes = resenaRepository.findByJuegoIdAndUsuarioId(
                request.getJuegoId(), request.getUsuarioId());
        
        if (!resenasExistentes.isEmpty()) {
            throw new RuntimeException("El usuario ya tiene una reseña para este juego");
        }
        
        Resena resena = Resena.builder()
                .usuario(usuario)
                .juego(juego)
                .rating(request.getRating())
                .comentario(request.getComentario())
                .build();
        
        Resena savedResena = resenaRepository.save(resena);
        
        // Actualizar rating promedio del juego
        juegoService.actualizarRatingPromedio(request.getJuegoId());
        
        return convertirADTO(savedResena);
    }
    
    public List<ResenaResponseDTO> obtenerResenasPorJuego(Long juegoId) {
        return resenaRepository.findByJuegoId(juegoId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public List<ResenaResponseDTO> obtenerResenasPorUsuario(Long usuarioId) {
        return resenaRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public List<ResenaResponseDTO> obtenerResenasRecientes() {
        LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);
        return resenaRepository.findResenasRecientes(hace30Dias)
                .stream()
                .limit(10)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public List<ResenaResponseDTO> obtenerResenasPositivas() {
        return resenaRepository.findResenasPositivas(4) // 4 o 5 estrellas
                .stream()
                .limit(10)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    public Double obtenerRatingPromedio(Long juegoId) {
        return resenaRepository.findAverageRatingByJuegoId(juegoId);
    }
    
    public Long contarResenasPorJuego(Long juegoId) {
        return resenaRepository.countByJuegoId(juegoId);
    }
    
    private ResenaResponseDTO convertirADTO(Resena resena) {
        return ResenaResponseDTO.builder()
                .id(resena.getId())
                .usuarioNombre(resena.getUsuario().getUsername())
                .juegoNombre(resena.getJuego().getNombre())
                .rating(resena.getRating())
                .comentario(resena.getComentario())
                .fechaCreacion(resena.getFechaCreacion())
                .build();
    }
}
