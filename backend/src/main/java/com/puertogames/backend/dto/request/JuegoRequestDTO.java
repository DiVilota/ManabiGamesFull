package com.puertogames.backend.dto.request;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class JuegoRequestDTO {
    @NotBlank(message = "El nombre del juego es requerido")
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    private String nombre;
    
    @Size(max = 2000, message = "La descripción no puede exceder 2000 caracteres")
    private String descripcion;
    
    @Size(max = 500, message = "La URL de imagen no puede exceder 500 caracteres")
    private String imagenUrl;
    
    @Size(max = 100, message = "La consola no puede exceder 100 caracteres")
    private String consola;
    
    @Min(value = 1970, message = "El año debe ser mayor a 1970")
    @Max(value = 2030, message = "El año no puede ser mayor a 2030")
    private Integer anoLanzamiento;
    
    @Size(max = 100, message = "La categoría no puede exceder 100 caracteres")
    private String categoria;
    
    private Long rawgId;
}