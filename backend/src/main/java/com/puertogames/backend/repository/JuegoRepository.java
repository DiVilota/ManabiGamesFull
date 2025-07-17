package com.puertogames.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.puertogames.backend.entity.Juego;

import java.util.List;

@Repository
public interface JuegoRepository extends JpaRepository<Juego, Long> {
    
    List<Juego> findByCategoria(String categoria);
    
    List<Juego> findByNombreContainingIgnoreCase(String nombre);
    
    @Query("SELECT j FROM Juego j ORDER BY j.visualizaciones DESC")
    List<Juego> findJuegosMasVistos();
    
    @Query("SELECT j FROM Juego j WHERE j.ratingPromedio > 0 ORDER BY j.ratingPromedio DESC")
    List<Juego> findJuegosMejorRankeados();
    
    @Query("SELECT DISTINCT j.categoria FROM Juego j WHERE j.categoria IS NOT NULL")
    List<String> findAllCategorias();
}