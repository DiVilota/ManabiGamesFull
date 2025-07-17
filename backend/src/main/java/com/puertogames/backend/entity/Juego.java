package com.puertogames.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "juegos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Juego {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "rawg_id")
    private Long rawgId;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "imagen_url")
    private String imagenUrl;
    
    private String consola;
    
    @Column(name = "año_lanzamiento")
    private Integer anoLanzamiento;
    
    private String categoria;
    
    @Column(name = "visualizaciones")
    private Integer visualizaciones;
    
    @Column(name = "rating_promedio")
    private Double ratingPromedio;
    
    @OneToMany(mappedBy = "juego", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resena> resenas;
    
    @PrePersist
    protected void onCreate() {
        if (visualizaciones == null) {
            visualizaciones = 0;
        }
        if (ratingPromedio == null) {
            ratingPromedio = 0.0;
        }
    }
}
