package com.puertogames.backend.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.puertogames.backend.dto.JuegoPopularDTO;
import com.puertogames.backend.dto.ResenaRecienteDTO;
import com.puertogames.backend.dto.request.response.EstadisticasResponseDTO;
import com.puertogames.backend.entity.Juego;
import com.puertogames.backend.entity.Resena;
import com.puertogames.backend.repository.JuegoRepository;
import com.puertogames.backend.repository.ResenaRepository;
import com.puertogames.backend.repository.UsuarioRepository;

import java.util.List;
import java.util.stream.Collectors;

