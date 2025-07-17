package com.puertogames.backend.dto.request;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class UsuarioRequestDTO {
    @NotBlank(message = "El nombre de usuario es requerido")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;
    
    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe tener un formato válido")
    private String email;
}