class ResenaHandler {
    constructor() {
        this.usuario = null;
        this.juegoActual = null;
        this.init();
    }

    init() {
        // Cargar usuario actual si existe
        this.usuario = obtenerUsuarioActual();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Si no hay usuario, mostrar formulario de login/registro
        if (!this.usuario) {
            this.mostrarFormularioUsuario();
        }
    }

    setupEventListeners() {
        // Listener para formulario de reseña
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('resena-form')) {
                e.preventDefault();
                this.handleSubmitResena(e.target);
            }
        });

        // Listener para formulario de usuario
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('usuario-form')) {
                e.preventDefault();
                this.handleSubmitUsuario(e.target);
            }
        });

        // Listener para rating con estrellas
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                this.handleStarClick(e.target);
            }
        });
    }

    // Mostrar formulario de usuario si no está logueado
    mostrarFormularioUsuario() {
        const formularioHTML = `
            <div id="usuario-modal" class="modal">
                <div class="modal-content">
                    <h3>Ingresa tus datos para escribir una reseña</h3>
                    <form class="usuario-form">
                        <div class="form-group">
                            <label for="username">Nombre de usuario:</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Continuar</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formularioHTML);
    }

    // Manejar envío de datos de usuario
    async handleSubmitUsuario(form) {
        const formData = new FormData(form);
        const datos = {
            username: formData.get('username'),
            email: formData.get('email')
        };

        try {
            // Mostrar loading
            this.showLoading(form);
            
            const usuario = await crearUsuario(datos);
            
            // Guardar usuario actual
            this.usuario = usuario;
            guardarUsuarioActual(usuario);
            
            // Cerrar modal
            document.getElementById('usuario-modal').remove();
            
            // Mostrar mensaje de éxito
            this.showMessage('¡Usuario creado exitosamente! Ya puedes escribir reseñas.', 'success');
            
        } catch (error) {
            this.showMessage(error.message || 'Error al crear usuario', 'error');
        } finally {
            this.hideLoading(form);
        }
    }

    // Crear formulario de reseña
    crearFormularioResena(juegoId, juegoNombre) {
        this.juegoActual = { id: juegoId, nombre: juegoNombre };
        
        const formularioHTML = `
            <div class="resena-container">
                <h3>Escribe tu reseña para "${juegoNombre}"</h3>
                <form class="resena-form" data-juego-id="${juegoId}">
                    <div class="form-group">
                        <label>Calificación:</label>
                        <div class="star-rating">
                            <span class="star" data-rating="1">★</span>
                            <span class="star" data-rating="2">★</span>
                            <span class="star" data-rating="3">★</span>
                            <span class="star" data-rating="4">★</span>
                            <span class="star" data-rating="5">★</span>
                        </div>
                        <input type="hidden" name="rating" id="rating-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="comentario">Comentario (opcional):</label>
                        <textarea 
                            id="comentario" 
                            name="comentario" 
                            placeholder="Comparte tu experiencia con este juego..."
                            maxlength="1000"
                            rows="4"
                        ></textarea>
                        <small class="char-count">0/1000 caracteres</small>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Enviar Reseña</button>
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.resena-container').remove()">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
        
        return formularioHTML;
    }

    // Manejar click en estrellas
    handleStarClick(star) {
        const rating = parseInt(star.dataset.rating);
        const container = star.closest('.star-rating');
        const ratingInput = container.parentElement.querySelector('#rating-input');
        
        // Actualizar estrellas visuales
        const stars = container.querySelectorAll('.star');
        stars.forEach((s, index) => {
            if (index < rating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        
        // Actualizar valor del input
        ratingInput.value = rating;
    }

    // Manejar envío de reseña
    async handleSubmitResena(form) {
        if (!this.usuario) {
            this.showMessage('Debes estar logueado para escribir una reseña', 'error');
            return;
        }

        const formData = new FormData(form);
        const juegoId = parseInt(form.dataset.juegoId);
        
        const datos = {
            usuarioId: this.usuario.id,
            juegoId: juegoId,
            rating: parseInt(formData.get('rating')),
            comentario: formData.get('comentario') || null
        };

        // Validar datos
        const errores = validarDatosResena(datos);
        if (errores.length > 0) {
            this.showMessage(errores.join(', '), 'error');
            return;
        }

        try {
            // Mostrar loading
            this.showLoading(form);
            
            const resena = await crearResena(datos);
            
            // Mostrar mensaje de éxito
            this.showMessage('¡Reseña enviada exitosamente!', 'success');
            
            // Limpiar formulario
            form.reset();
            form.querySelector('#rating-input').value = '';
            form.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
            
            // Recargar reseñas si existe la función
            if (typeof cargarResenasJuego === 'function') {
                cargarResenasJuego(juegoId);
            }
            
            // Actualizar estadísticas del juego
            this.actualizarEstadisticasJuego(juegoId);
            
        } catch (error) {
            this.showMessage(error.message || 'Error al enviar la reseña', 'error');
        } finally {
            this.hideLoading(form);
        }
    }

    // Cargar reseñas de un juego
    async cargarResenasJuego(juegoId) {
        try {
            const resenas = await obtenerResenasPorJuego(juegoId);
            this.mostrarResenas(resenas);
            
            // Obtener y mostrar estadísticas
            const rating = await obtenerRatingPromedio(juegoId);
            const count = await contarResenasPorJuego(juegoId);
            
            this.mostrarEstadisticasJuego(rating, count);
            
        } catch (error) {
            console.error('Error al cargar reseñas:', error);
        }
    }

    // Mostrar reseñas en el DOM
    mostrarResenas(resenas) {
        const container = document.getElementById('resenas-container');
        if (!container) return;
        
        if (resenas.length === 0) {
            container.innerHTML = '<p class="no-resenas">No hay reseñas aún. ¡Sé el primero en escribir una!</p>';
            return;
        }
        
        const resenasHTML = resenas.map(resena => `
            <div class="resena-item">
                <div class="resena-header">
                    <span class="usuario">${resena.usuarioNombre}</span>
                    <div class="rating">
                        ${'★'.repeat(resena.rating)}${'☆'.repeat(5 - resena.rating)}
                    </div>
                    <span class="fecha">${new Date(resena.fechaCreacion).toLocaleDateString()}</span>
                </div>
                ${resena.comentario ? `<p class="comentario">${resena.comentario}</p>` : ''}
            </div>
        `).join('');
        
        container.innerHTML = resenasHTML;
    }

    // Mostrar estadísticas del juego
    mostrarEstadisticasJuego(rating, count) {
        const statsContainer = document.getElementById('juego-stats');
        if (!statsContainer) return;
        
        const statsHTML = `
            <div class="juego-estadisticas">
                <div class="stat">
                    <span class="stat-label">Rating promedio:</span>
                    <span class="stat-value">${rating ? rating.toFixed(1) : 'N/A'} ★</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Total reseñas:</span>
                    <span class="stat-value">${count || 0}</span>
                </div>
            </div>
        `;
        
        statsContainer.innerHTML = statsHTML;
    }

    // Actualizar estadísticas después de nueva reseña
    async actualizarEstadisticasJuego(juegoId) {
        try {
            const rating = await obtenerRatingPromedio(juegoId);
            const count = await contarResenasPorJuego(juegoId);
            this.mostrarEstadisticasJuego(rating, count);
        } catch (error) {
            console.error('Error al actualizar estadísticas:', error);
        }
    }

    // Funciones de utilidad
    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.classList.contains('usuario-form') ? 'Continuar' : 'Enviar Reseña';
    }

    showMessage(message, type = 'info') {
        // Remover mensaje anterior si existe
        const existingMessage = document.getElementById('message-alert');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageHTML = `
            <div id="message-alert" class="alert alert-${type}">
                ${message}
                <button type="button" class="close" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', messageHTML);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            const alert = document.getElementById('message-alert');
            if (alert) alert.remove();
        }, 5000);
    }

    // Contador de caracteres para textarea
    setupCharCounter() {
        document.addEventListener('input', (e) => {
            if (e.target.name === 'comentario') {
                const counter = e.target.parentElement.querySelector('.char-count');
                if (counter) {
                    counter.textContent = `${e.target.value.length}/1000 caracteres`;
                }
            }
        });
    }
}

// Inicializar el manejador de reseñas cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.resenaHandler = new ResenaHandler();
    
    // Configurar contador de caracteres
    window.resenaHandler.setupCharCounter();
});

// Funciones globales para usar en cualquier parte
window.mostrarFormularioResena = function(juegoId, juegoNombre) {
    const formulario = window.resenaHandler.crearFormularioResena(juegoId, juegoNombre);
    const container = document.getElementById('resena-form-container') || document.body;
    container.insertAdjacentHTML('beforeend', formulario);
};

window.cargarResenasJuego = function(juegoId) {
    window.resenaHandler.cargarResenasJuego(juegoId);
};