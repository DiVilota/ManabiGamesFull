package com.puertogames.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.puertogames.backend.entity.Resena;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    
    List<Resena> findByJuegoId(Long juegoId);
    
    List<Resena> findByUsuarioId(Long usuarioId);
    
    List<Resena> findByJuegoIdAndUsuarioId(Long juegoId, Long usuarioId);
    
    @Query("SELECT r FROM Resena r WHERE r.fechaCreacion >= :fecha ORDER BY r.fechaCreacion DESC")
    List<Resena> findResenasRecientes(@Param("fecha") LocalDateTime fecha);
    
    @Query("SELECT r FROM Resena r WHERE r.rating >= :rating ORDER BY r.fechaCreacion DESC")
    List<Resena> findResenasPositivas(@Param("rating") Integer rating);
    
    @Query("SELECT AVG(r.rating) FROM Resena r WHERE r.juego.id = :juegoId")
    Double findAverageRatingByJuegoId(@Param("juegoId") Long juegoId);
    
    Long countByJuegoId(Long juegoId);
}
