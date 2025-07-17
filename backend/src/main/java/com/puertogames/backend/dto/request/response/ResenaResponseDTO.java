package com.puertogames.backend.dto.request.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ResenaResponseDTO {
    private Long id;
    private String usuarioNombre;
    private String juegoNombre;
    private Integer rating;
    private String comentario;
    private LocalDateTime fechaCreacion;
}
