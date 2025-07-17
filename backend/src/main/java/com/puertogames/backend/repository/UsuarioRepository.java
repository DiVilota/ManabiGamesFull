package com.puertogames.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.puertogames.backend.entity.Usuario;

import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByUsername(String username);
    
    Optional<Usuario> findByEmail(String email);
    
    List<Usuario> findByEstaOnline(Boolean estaOnline);
    
    Long countByEstaOnline(Boolean estaOnline);
    
    @Query("SELECT u FROM Usuario u WHERE u.estaOnline = true ORDER BY u.fechaRegistro DESC")
    List<Usuario> findUsuariosOnline();
}