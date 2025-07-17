// reviews.js - Sistema de reseñas mejorado con backend

// Función mejorada para guardar reseña tanto localmente como en el backend
async function guardarResenaCompleta(juegoId, calificacion, opinion = '') {
  try {
    // 1. Primero intentar guardar en el backend
    const datosResena = {
      juegoId: parseInt(juegoId),
      usuarioId: 1, // Por ahora usamos un usuario fijo, puedes cambiarlo por el usuario actual
      calificacion: calificacion,
      comentario: opinion.trim(),
      fechaCreacion: new Date().toISOString()
    };

    console.log('Enviando reseña al backend:', datosResena);
    
    // Llamar a la función del config.js para enviar al backend
    const respuestaBackend = await crearResena(datosResena);
    console.log('Reseña guardada en backend:', respuestaBackend);
    
    // 2. Si el backend fue exitoso, guardar también localmente
    const exitoLocal = guardarReseñaLocal(juegoId, calificacion, opinion);
    
    if (exitoLocal) {
      return { 
        exito: true, 
        backend: true, 
        local: true,
        mensaje: 'Reseña guardada exitosamente en la base de datos y localmente' 
      };
    } else {
      return { 
        exito: true, 
        backend: true, 
        local: false,
        mensaje: 'Reseña guardada en la base de datos (error al guardar localmente)' 
      };
    }
    
  } catch (error) {
    console.error('Error al guardar en backend:', error);
    
    // 3. Si falla el backend, intentar guardar solo localmente
    const exitoLocal = guardarReseñaLocal(juegoId, calificacion, opinion);
    
    if (exitoLocal) {
      return { 
        exito: true, 
        backend: false, 
        local: true,
        mensaje: 'Reseña guardada localmente (sin conexión al servidor)' 
      };
    } else {
      return { 
        exito: false, 
        backend: false, 
        local: false,
        mensaje: 'Error al guardar la reseña' 
      };
    }
  }
}

// Función para obtener reseñas desde el backend
async function obtenerResenasBackend(juegoId) {
  try {
    const resenasBackend = await obtenerResenasPorJuego(juegoId);
    console.log('Reseñas obtenidas del backend:', resenasBackend);
    return resenasBackend;
  } catch (error) {
    console.error('Error al obtener reseñas del backend:', error);
    return [];
  }
}

// Función actualizada para manejar el modal de reseña
function mostrarModalReseñaActualizada(juegoId, tituloJuego) {
  const reseñas = obtenerReseñasLocal();
  const reseñaExistente = reseñas[juegoId];
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-[#1a1a1a] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#6c63ff]">
      <h3 class="text-2xl font-bold neon mb-4 text-center">📝 Reseña de Juego</h3>
      <h4 class="text-lg text-[#00ffcc] mb-4 text-center">${tituloJuego}</h4>
      
      <!-- Sección de calificación -->
      <div class="text-center mb-6">
        <p class="text-sm text-[#6c63ff] mb-3">⭐ Calificación:</p>
        ${generarEstrellas(juegoId, reseñaExistente ? reseñaExistente.calificacion : 0)}
        <p class="text-xs text-gray-400 mt-2">Haz clic en las estrellas para calificar</p>
      </div>
      
      <!-- Sección de opinión -->
      <div class="mb-6">
        <label class="block text-sm text-[#6c63ff] mb-2">✏️ Tu opinión:</label>
        <textarea 
          id="opinion-textarea" 
          placeholder="Cuéntanos qué te pareció este juego... ¿Qué te gustó más? ¿Qué mejorarías? ¿Lo recomendarías?"
          class="w-full h-32 p-3 bg-[#2a2a2a] border border-[#6c63ff] rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#00ffcc] focus:border-transparent"
          maxlength="500"
        >${reseñaExistente ? reseñaExistente.opinion || '' : ''}</textarea>
        <div class="flex justify-between items-center mt-1">
          <span class="text-xs text-gray-400">Máximo 500 caracteres</span>
          <span class="text-xs text-[#6c63ff]" id="contador-caracteres">0/500</span>
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="flex gap-3">
        <button id="cancelar-reseña" class="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition font-semibold">
          ❌ Cancelar
        </button>
        <button id="guardar-reseña" class="flex-1 bg-[#00ffcc] text-black px-4 py-3 rounded-lg hover:bg-[#00e6b3] transition font-semibold">
          💾 ${reseñaExistente ? 'Actualizar' : 'Guardar'} Reseña
        </button>
      </div>
      
      <!-- Indicador de carga -->
      <div id="loading-indicator" class="hidden mt-4 text-center">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#00ffcc]"></div>
        <span class="ml-2 text-[#6c63ff]">Guardando reseña...</span>
      </div>
      
      ${reseñaExistente ? `
        <div class="mt-4 p-3 bg-[#2a2a2a] rounded-lg border border-[#6c63ff]">
          <p class="text-xs text-gray-400 mb-1">Reseña actual:</p>
          <div class="flex items-center gap-2 mb-2">
            ${generarVisualizacionEstrellas(reseñaExistente.calificacion, false)}
          </div>
          ${reseñaExistente.opinion ? `
            <p class="text-sm text-white">"${reseñaExistente.opinion}"</p>
          ` : '<p class="text-sm text-gray-400 italic">Sin opinión escrita</p>'}
        </div>
      ` : ''}
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Referencias a elementos del modal
  const textarea = modal.querySelector('#opinion-textarea');
  const contadorCaracteres = modal.querySelector('#contador-caracteres');
  const estrellas = modal.querySelectorAll('.estrella');
  const btnGuardar = modal.querySelector('#guardar-reseña');
  const btnCancelar = modal.querySelector('#cancelar-reseña');
  const loadingIndicator = modal.querySelector('#loading-indicator');
  
  // Variables de estado
  let calificacionSeleccionada = reseñaExistente ? reseñaExistente.calificacion : 0;
  
  // Contador de caracteres
  function actualizarContador() {
    const longitud = textarea.value.length;
    contadorCaracteres.textContent = `${longitud}/500`;
    contadorCaracteres.style.color = longitud > 450 ? '#ff2e9d' : '#6c63ff';
  }
  
  // Event listeners
  textarea.addEventListener('input', actualizarContador);
  actualizarContador();
  
  // Event listeners para las estrellas
  estrellas.forEach(estrella => {
    estrella.addEventListener('click', () => {
      calificacionSeleccionada = parseInt(estrella.dataset.valor);
      actualizarEstrellas(modal, calificacionSeleccionada);
    });
    
    estrella.addEventListener('mouseenter', () => {
      const valor = parseInt(estrella.dataset.valor);
      actualizarEstrellas(modal, valor);
    });
  });
  
  // Restaurar estrellas al salir del hover
  modal.querySelector('.estrellas-rating').addEventListener('mouseleave', () => {
    actualizarEstrellas(modal, calificacionSeleccionada);
  });
  
  // Botón cancelar
  btnCancelar.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Botón guardar - AQUÍ ESTÁ LA MEJORA PRINCIPAL
  btnGuardar.addEventListener('click', async () => {
    if (calificacionSeleccionada === 0) {
      mostrarNotificacion('Por favor selecciona una calificación con estrellas', 'error');
      return;
    }
    
    // Mostrar indicador de carga
    loadingIndicator.classList.remove('hidden');
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';
    
    const opinion = textarea.value.trim();
    
    try {
      // Guardar usando la función mejorada
      const resultado = await guardarResenaCompleta(juegoId, calificacionSeleccionada, opinion);
      
      if (resultado.exito) {
        // Actualizar la visualización en la tarjeta
        actualizarVisualizacionReseña(juegoId);
        
        // Mostrar mensaje de éxito apropiado
        mostrarNotificacion(resultado.mensaje, 'success');
        
        // Cerrar modal
        document.body.removeChild(modal);
      } else {
        mostrarNotificacion(resultado.mensaje, 'error');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      mostrarNotificacion('Error inesperado al guardar la reseña', 'error');
    } finally {
      // Ocultar indicador de carga
      loadingIndicator.classList.add('hidden');
      btnGuardar.disabled = false;
      btnGuardar.textContent = reseñaExistente ? 'Actualizar Reseña' : 'Guardar Reseña';
    }
  });
  
  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Enfocar el textarea
  setTimeout(() => {
    textarea.focus();
  }, 100);
}