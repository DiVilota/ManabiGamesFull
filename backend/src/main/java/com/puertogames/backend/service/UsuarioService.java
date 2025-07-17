package com.puertogames.backend.service;

import com.puertogames.backend.dto.request.UsuarioRequestDTO;
import com.puertogames.backend.dto.request.response.UsuarioResponseDTO;
import com.puertogames.backend.entity.Usuario;

import com.puertogames.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO request) {
        log.info("Creando usuario: {}", request.getUsername());
        
        Usuario usuario = Usuario.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .build();
        
        Usuario savedUsuario = usuarioRepository.save(usuario);
        
        return convertirADTO(savedUsuario);
    }
    
    public UsuarioResponseDTO obtenerUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return convertirADTO(usuario);
    }
    
    public List<UsuarioResponseDTO> obtenerTodosUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    

    public UsuarioResponseDTO actualizarEstadoOnline(Long id, Boolean online) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setEstaOnline(online);
        Usuario savedUsuario = usuarioRepository.save(usuario);
        
        return convertirADTO(savedUsuario);
    }
    
    private UsuarioResponseDTO convertirADTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .fechaRegistro(usuario.getFechaRegistro())
                .estaOnline(usuario.getEstaOnline())
                .build();
    }
}


