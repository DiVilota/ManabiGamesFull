package com.puertogames.backend.dto.request.response;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class EstadisticasResponseDTO {
    private Long totalJuegos;
    private Long totalUsuarios;
    private Long totalResenas;
    private Long usuariosOnline;
    private Double ratingPromedio;
    private String juegoMasPopular;
    private String categoriaMasPopular;
}