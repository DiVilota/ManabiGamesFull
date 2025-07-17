package com.puertogames.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ResenaRecienteDTO {
    private Long id;
    private String usuarioNombre;
    private String juegoNombre;
    private Integer rating;
    private String comentario;
    private LocalDateTime fechaCreacion;
}
