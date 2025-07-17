// main.js - Versión con conexión al backend

// Datos estáticos como fallback
// main.js - Versión con conexión al backend y sistema de reseñas

// Datos estáticos como fallback
// main.js - Versión con conexión al backend y sistema de reseñas con opiniones

// Datos estáticos como fallback
const juegosEstaticos = [

 {

  id: 1,

  titulo: "The Legend of Zelda",

  consola: "NES",

  año: 1986,

  imagen: "covers/zelda.png",

  descripcion: "Explora calabozos, resuelve acertijos y salva a Hyrule en esta joya clásica."

 },

 {

  id: 2,

  titulo: "Super Metroid",

  consola: "SNES",

  año: 1994,

  imagen: "covers/supermetroid.png",

  descripcion: "Una aventura galáctica intensa con exploración y mejoras progresivas."

 },

 {

  id: 3,

  titulo: "Chrono Trigger",

  consola: "SNES",

  año: 1995,

  imagen: "covers/chronotrigger.png",

  descripcion: "Viaja por el tiempo y salva el futuro en este legendario RPG."

 }

];
// Sistema de reseñas mejorado con opiniones
function obtenerReseñasLocal() {
  try {
    const reseñas = localStorage.getItem('manabiGamesReseñas');
    return reseñas ? JSON.parse(reseñas) : {};
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return {};
  }
}

function guardarReseñaLocal(juegoId, calificacion, opinion = '') {
  try {
    const reseñas = obtenerReseñasLocal();
    reseñas[juegoId] = {
      calificacion: calificacion,
      opinion: opinion.trim(),
      fecha: new Date().toISOString()
    };
    localStorage.setItem('manabiGamesReseñas', JSON.stringify(reseñas));
    return true;
  } catch (error) {
    console.error('Error al guardar reseña:', error);
    return false;
  }
}

// Función para generar estrellas interactivas
function generarEstrellas(juegoId, calificacionActual = 0) {
  let estrellasHTML = '<div class="estrellas-rating flex justify-center gap-1 mt-2" data-juego-id="' + juegoId + '">';
  
  for (let i = 1; i <= 5; i++) {
    const activa = i <= calificacionActual ? 'text-yellow-400' : 'text-gray-500';
    estrellasHTML += `
      <button class="estrella hover:text-yellow-400 transition-colors text-2xl ${activa}" 
              data-valor="${i}" 
              data-juego-id="${juegoId}">
        ★
      </button>
    `;
  }
  
  estrellasHTML += '</div>';
  return estrellasHTML;
}

// Función para mostrar modal de reseña mejorado
function mostrarModalReseña(juegoId, tituloJuego) {
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
  actualizarContador(); // Inicializar contador
  
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
  
  // Botón guardar
  btnGuardar.addEventListener('click', () => {
    if (calificacionSeleccionada === 0) {
      mostrarNotificacion('Por favor selecciona una calificación con estrellas', 'error');
      return;
    }
    
    const opinion = textarea.value.trim();
    
    if (guardarReseñaLocal(juegoId, calificacionSeleccionada, opinion)) {
      // Actualizar la visualización en la tarjeta
      actualizarVisualizacionReseña(juegoId);
      
      // Mostrar mensaje de éxito
      mostrarNotificacion('¡Reseña guardada exitosamente! 🎉', 'success');
      
      document.body.removeChild(modal);
    } else {
      mostrarNotificacion('Error al guardar la reseña. Inténtalo de nuevo', 'error');
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

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
  const notificacion = document.createElement('div');
  const esError = tipo === 'error';
  
  notificacion.className = `fixed top-4 right-4 px-6 py-3 rounded-lg font-semibold z-50 transform transition-all duration-300 ${
    esError ? 'bg-red-500 text-white' : 'bg-[#00ffcc] text-black'
  }`;
  
  notificacion.textContent = mensaje;
  notificacion.style.transform = 'translateX(100%)';
  
  document.body.appendChild(notificacion);
  
  // Animación de entrada
  setTimeout(() => {
    notificacion.style.transform = 'translateX(0)';
  }, 10);
  
  // Animación de salida y eliminación
  setTimeout(() => {
    notificacion.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notificacion)) {
        document.body.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// Función para actualizar las estrellas visualmente
function actualizarEstrellas(contenedor, calificacion) {
  const estrellas = contenedor.querySelectorAll('.estrella');
  estrellas.forEach((estrella, index) => {
    if (index < calificacion) {
      estrella.classList.remove('text-gray-500');
      estrella.classList.add('text-yellow-400');
    } else {
      estrella.classList.remove('text-yellow-400');
      estrella.classList.add('text-gray-500');
    }
  });
}

// Función para actualizar la visualización de reseña en la tarjeta
function actualizarVisualizacionReseña(juegoId) {
  const reseñas = obtenerReseñasLocal();
  const reseña = reseñas[juegoId];
  
  const tarjeta = document.querySelector(`[data-juego-id="${juegoId}"]`);
  if (tarjeta && reseña) {
    const contenedorReseña = tarjeta.closest('.card').querySelector('.reseña-display');
    if (contenedorReseña) {
      contenedorReseña.innerHTML = generarVisualizacionCompleta(reseña);
    }
  }
}

// Función para generar visualización completa de la reseña
function generarVisualizacionCompleta(reseña) {
  const tienOpinion = reseña.opinion && reseña.opinion.trim().length > 0;
  
  return `
    <div class="bg-[#2a2a2a] rounded-lg p-3 mt-2 border border-[#6c63ff]">
      ${generarVisualizacionEstrellas(reseña.calificacion)}
      ${tienOpinion ? `
        <div class="mt-2">
          <p class="text-xs text-[#6c63ff] mb-1">Tu opinión:</p>
          <p class="text-sm text-white italic">"${reseña.opinion.length > 80 ? reseña.opinion.substring(0, 80) + '...' : reseña.opinion}"</p>
        </div>
      ` : ''}
      <p class="text-xs text-gray-400 mt-1">Reseñado el ${new Date(reseña.fecha).toLocaleDateString()}</p>
    </div>
  `;
}

// Función para generar visualización de estrellas (solo lectura)
function generarVisualizacionEstrellas(calificacion, mostrarTexto = true) {
  let estrellasHTML = '<div class="flex justify-center gap-1 text-sm items-center">';
  
  for (let i = 1; i <= 5; i++) {
    const activa = i <= calificacion ? 'text-yellow-400' : 'text-gray-500';
    estrellasHTML += `<span class="${activa}">★</span>`;
  }
  
  if (mostrarTexto) {
    estrellasHTML += ` <span class="text-[#6c63ff] ml-2">(${calificacion}/5)</span>`;
  }
  
  estrellasHTML += '</div>';
  return estrellasHTML;
}

// Función para manejar errores de carga de imágenes
function manejarErrorImagen(imgElement, tituloJuego) {
  imgElement.onerror = function() {
    console.warn(`No se pudo cargar la imagen para: ${tituloJuego}`);
    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
  };
}

// Función para renderizar juegos
function renderizarJuegos(juegos, esBackend = false) {
  const catalogo = document.getElementById("catalogo");
  if (!catalogo) {
    console.error("No se encontró el elemento #catalogo");
    return;
  }

  const reseñas = obtenerReseñasLocal();

  juegos.forEach(juego => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "card bg-[#1a1a1a] rounded-2xl p-4 shadow-md hover:shadow-[#ff2e9d] transition duration-300 flex flex-col";

    const uniqueId = esBackend ? `backend-${juego.id}` : `local-${juego.id}`;
    const reseñaExistente = reseñas[juego.id];
    
    tarjeta.innerHTML = `
      <img src="${juego.imagen}" alt="${juego.titulo}" class="card-img" id="${uniqueId}">
      <h3 class="text-xl font-bold neon mb-2">${juego.titulo}</h3>
      <p class="text-sm text-[#6c63ff] mb-1">Consola: ${juego.consola}</p>
      <p class="text-sm text-[#6c63ff] mb-1">Año: ${juego.año}</p>
      <p class="text-sm text-white mb-4">${juego.descripcion}</p>
      
      <!-- Botones de acción -->
      <div class="mt-auto space-y-2">
        <a href="detalles.html?id=${juego.id}" class="block bg-[#00ffcc] text-black text-center px-4 py-2 rounded font-semibold hover:scale-105 transition">Ver detalles</a>
        
        <button class="btn-reseña w-full bg-[#ff2e9d] text-white text-center px-4 py-2 rounded font-semibold hover:bg-[#e0268a] transition" 
                data-juego-id="${juego.id}" 
                data-titulo="${juego.titulo}">
          📝 ${reseñaExistente ? 'Editar reseña' : 'Escribir reseña'}
        </button>
        
        <!-- Mostrar reseña existente -->
        <div class="reseña-display text-center">
          ${reseñaExistente ? generarVisualizacionCompleta(reseñaExistente) : '<span class="text-gray-500 text-sm">Sin reseña</span>'}
        </div>
      </div>
    `;

    catalogo.appendChild(tarjeta);
    
    // Manejar error de imagen después de agregar al DOM
    const imgElement = document.getElementById(uniqueId);
    if (imgElement) {
      manejarErrorImagen(imgElement, juego.titulo);
    }
  });

  // Agregar event listeners para los botones de reseña
  document.querySelectorAll('.btn-reseña').forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.preventDefault();
      const juegoId = boton.dataset.juegoId;
      const titulo = boton.dataset.titulo;
      mostrarModalReseña(juegoId, titulo);
    });
  });
}

// Función para mostrar juegos desde el backend
async function mostrarJuegosBackend() {
  try {
    console.log("Intentando obtener juegos desde el backend...");
    const juegosBackend = await obtenerJuegos();
    
    if (juegosBackend && juegosBackend.length > 0) {
      console.log("Juegos obtenidos desde el backend:", juegosBackend);
      renderizarJuegos(juegosBackend, true);
      return true;
    } else {
      console.log("No se obtuvieron juegos del backend");
      return false;
    }
  } catch (error) {
    console.error("Error al obtener juegos desde el backend:", error);
    return false;
  }
}

// Función para mostrar juegos estáticos (fallback)
function mostrarJuegosEstaticos() {
  console.log("Mostrando juegos estáticos como fallback");
  renderizarJuegos(juegosEstaticos, false);
}

// Render juegos desde API RAWG
async function mostrarDesdeRAWG() {
  const API_KEY = "17a8c4f8d106455baf54eda6d323173e";
  
  try {
    const respuesta = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&dates=1980-01-01,1999-12-31&ordering=-rating&page_size=12`);
    
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    
    const data = await respuesta.json();
    
    const catalogo = document.getElementById("catalogo");
    if (!catalogo) {
      console.error("No se encontró el elemento #catalogo");
      return;
    }

    const consolasValidas = [
      "NES", "SNES", "PlayStation", "PlayStation 2", "Sega Genesis",
      "Nintendo 64", "Game Boy", "Game Boy Advance", "Sega Saturn",
      "Dreamcast", "GameCube"
    ];

    const reseñas = obtenerReseñasLocal();

    data.results.forEach((juego, index) => {
      const plataformas = juego.platforms?.map(p => p.platform.name) || [];
      const consola = plataformas.find(p => consolasValidas.includes(p));

      if (!consola) return;

      const fechaLanzamiento = juego.released || "";
      const año = fechaLanzamiento ? new Date(fechaLanzamiento).getFullYear() : "Año desconocido";

      const tarjeta = document.createElement("div");
      tarjeta.className = "card bg-[#1a1a1a] rounded-2xl p-4 shadow-md hover:shadow-[#ff2e9d] transition duration-300 flex flex-col";

      const uniqueId = `rawg-${juego.id}`;
      const reseñaExistente = reseñas[juego.id];
      
      tarjeta.innerHTML = `
        <img src="${juego.background_image || ''}" alt="${juego.name}" class="card-img" id="${uniqueId}">
        <h3 class="text-xl font-bold neon mb-2">${juego.name}</h3>
        <p class="text-sm text-[#6c63ff] mb-1">Consola: ${consola}</p>
        <p class="text-sm text-[#6c63ff] mb-1">Año: ${año}</p>
        <p class="text-sm text-white mb-4">${juego.slug.replaceAll("-", " ")}</p>
        
        <!-- Botones de acción -->
        <div class="mt-auto space-y-2">
          <a href="detalles.html?id=${juego.id}" class="block bg-[#00ffcc] text-black text-center px-4 py-2 rounded font-semibold hover:scale-105 transition">Ver más</a>
          
          <button class="btn-reseña w-full bg-[#ff2e9d] text-white text-center px-4 py-2 rounded font-semibold hover:bg-[#e0268a] transition" 
                  data-juego-id="${juego.id}" 
                  data-titulo="${juego.name}">
            📝 ${reseñaExistente ? 'Editar reseña' : 'Escribir reseña'}
          </button>
          
          <!-- Mostrar reseña existente -->
          <div class="reseña-display text-center">
            ${reseñaExistente ? generarVisualizacionCompleta(reseñaExistente) : '<span class="text-gray-500 text-sm">Sin reseña</span>'}
          </div>
        </div>
      `;

      catalogo.appendChild(tarjeta);
      
      const imgElement = document.getElementById(uniqueId);
      if (imgElement) {
        manejarErrorImagen(imgElement, juego.name);
      }
    });

    // Agregar event listeners para los botones de reseña de RAWG
    document.querySelectorAll('.btn-reseña').forEach(boton => {
      boton.addEventListener('click', (e) => {
        e.preventDefault();
        const juegoId = boton.dataset.juegoId;
        const titulo = boton.dataset.titulo;
        mostrarModalReseña(juegoId, titulo);
      });
    });

  } catch (error) {
    console.error("Error al obtener juegos desde RAWG:", error);
    
    const catalogo = document.getElementById("catalogo");
    if (catalogo) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "col-span-full text-center text-red-500 p-4";
      errorDiv.innerHTML = `
        <p>Error al cargar juegos adicionales desde RAWG</p>
        <p class="text-sm">Verifica tu conexión a internet</p>
      `;
      catalogo.appendChild(errorDiv);
    }
  }
}

// Inicialización principal
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Inicializando ManabiGames...");
  
  // Verificar que config.js esté disponible
  if (typeof obtenerJuegos === 'undefined') {
    console.error("config.js no está cargado. Asegúrate de incluirlo en tu HTML.");
    mostrarJuegosEstaticos();
    return;
  }

  // Limpiar el catalogo antes de cargar
  const catalogo = document.getElementById("catalogo");
  if (catalogo) {
    catalogo.innerHTML = '<div class="col-span-full text-center text-[#6c63ff] p-4"><p>Cargando juegos...</p></div>';
  }

  // Intentar obtener juegos del backend primero
  const backendExitoso = await mostrarJuegosBackend();
  
  // Si el backend no está disponible, usar juegos estáticos
  if (!backendExitoso) {
    mostrarJuegosEstaticos();
  }
  
  // Cargar juegos adicionales desde RAWG
  await mostrarDesdeRAWG();
  
  console.log("Inicialización completada");
});