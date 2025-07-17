package com.puertogames.backend.dto.request.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UsuarioResponseDTO {
    private Long id;
    private String username;
    private String email;
    private LocalDateTime fechaRegistro;
    private Boolean estaOnline;
    private Long totalResenas;
}