package com.puertogames.backend.dto.request;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ResenaRequestDTO {
    @NotNull(message = "El ID del usuario es requerido")
    private Long usuarioId;
    
    @NotNull(message = "El ID del juego es requerido")
    private Long juegoId;
    
    @NotNull(message = "El rating es requerido")
    @Min(value = 1, message = "El rating mínimo es 1")
    @Max(value = 5, message = "El rating máximo es 5")
    private Integer rating;
    
    @Size(max = 1000, message = "El comentario no puede exceder 1000 caracteres")
    private String comentario;
}
