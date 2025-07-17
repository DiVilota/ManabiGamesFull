package com.puertogames.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JuegoPopularDTO {
    private Long id;
    private String nombre;
    private String imagenUrl;
    private Integer visualizaciones;
    private Double ratingPromedio;
}

