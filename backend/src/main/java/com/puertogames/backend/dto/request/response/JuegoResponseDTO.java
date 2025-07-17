package com.puertogames.backend.dto.request.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JuegoResponseDTO {
    private Long id;
    private Long rawgId;
    private String nombre;
    private String descripcion;
    private String imagenUrl;
    private String consola;
    private Integer anoLanzamiento;
    private String categoria;
    private Integer visualizaciones;
    private Double ratingPromedio;
    private Long totalResenas;
}