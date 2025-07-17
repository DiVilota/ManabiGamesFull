
// config.js - Configuración completa para conexión al backend
const API_CONFIG = {
    baseURL: 'http://localhost:8080/api',
    endpoints: {
        juegos: '/juegos',
        resenas: '/resenas',
        usuarios: '/usuarios',
        contacto: '/contacto',
        estadisticas: '/estadisticas'
    }
};

// Función helper mejorada para hacer peticiones
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en petición API:', error);
        throw error;
    }
}

// =================== FUNCIONES DE JUEGOS ===================
async function obtenerJuegos() {
    try {
        return await apiRequest(API_CONFIG.endpoints.juegos);
    } catch (error) {
        console.error('Error al obtener juegos:', error);
        return [];
    }
}

async function obtenerJuego(id) {
    try {
        return await apiRequest(`${API_CONFIG.endpoints.juegos}/${id}`);
    } catch (error) {
        console.error('Error al obtener juego:', error);
        throw error;
    }
}

async function buscarJuegos(nombre) {
    try {
        return await apiRequest(`${API_CONFIG.endpoints.juegos}/buscar?nombre=${encodeURIComponent(nombre)}`);
    } catch (error) {
        console.error('Error al buscar juegos:', error);
        return [];
    }
}

// =================== FUNCIONES DE RESEÑAS ===================
async function crearResena(datosResena) {
    try {
        return await apiRequest(API_CONFIG.endpoints.resenas, {
            method: 'POST',
            body: JSON.stringify(datosResena)
        });
    } catch (error) {
        console.error('Error al crear reseña:', error);
        throw error;
    }
}

async function obtenerResenasPorJuego(juegoId) {
    try {
        return await apiRequest(`${API_CONFIG.endpoints.resenas}/juego/${juegoId}`);
    } catch (error) {
        console.error('Error al obtener reseñas del juego:', error);
        return [];
    }
}

async function obtenerResenasRecientes() {
    try {
        return await apiRequest(`${API_CONFIG.endpoints.resenas}/recientes`);
    } catch (error) {
        console.error('Error al obtener reseñas recientes:', error);
        return [];
    }
}

async function obtenerRatingPromedio(juegoId) {
    try {
        return await apiRequest(`${API_CONFIG.endpoints.resenas}/juego/${juegoId}/rating`);
    } catch (error) {
        console.error('Error al obtener rating promedio:', error);
        return 0;
    }
}

// =================== FUNCIONES DE USUARIOS ===================
async function crearUsuario(datosUsuario) {
    try {
        return await apiRequest(API_CONFIG.endpoints.usuarios, {
            method: 'POST',
            body: JSON.stringify(datosUsuario)
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}

async function obtenerUsuarios() {
    try {
        return await apiRequest(API_CONFIG.endpoints.usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
}

// =================== FUNCIONES DE CONTACTO ===================
async function enviarContacto(datos) {
    try {
        return await apiRequest(API_CONFIG.endpoints.contacto, {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error al enviar contacto:', error);
        throw error;
    }
}

// =================== FUNCIONES DE ESTADÍSTICAS ===================
async function obtenerEstadisticas() {
    try {
        return await apiRequest(API_CONFIG.endpoints.estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return null;
    }
}

// =================== FUNCIONES DE GESTIÓN DE ESTADO ===================
// Sistema simple de gestión de usuario actual
let usuarioActual = null;

function setUsuarioActual(usuario) {
    usuarioActual = usuario;
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
}

function getUsuarioActual() {
    if (!usuarioActual) {
        const stored = localStorage.getItem('usuarioActual');
        if (stored) {
            usuarioActual = JSON.parse(stored);
        }
    }
    return usuarioActual;
}

function clearUsuarioActual() {
    usuarioActual = null;
    localStorage.removeItem('usuarioActual');
}

// =================== FUNCIONES DE UTILIDAD ===================
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.textContent = mensaje;
    
    // Estilos básicos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderizarEstrellas(rating) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            estrellas += '★';
        } else {
            estrellas += '☆';
        }
    }
    return estrellas;
}

// =================== HACER FUNCIONES DISPONIBLES GLOBALMENTE ===================
window.API_CONFIG = API_CONFIG;
window.apiRequest = apiRequest;

// Funciones de juegos
window.obtenerJuegos = obtenerJuegos;
window.obtenerJuego = obtenerJuego;
window.buscarJuegos = buscarJuegos;

// Funciones de reseñas
window.crearResena = crearResena;
window.obtenerResenasPorJuego = obtenerResenasPorJuego;
window.obtenerResenasRecientes = obtenerResenasRecientes;
window.obtenerRatingPromedio = obtenerRatingPromedio;

// Funciones de usuarios
window.crearUsuario = crearUsuario;
window.obtenerUsuarios = obtenerUsuarios;
window.setUsuarioActual = setUsuarioActual;
window.getUsuarioActual = getUsuarioActual;
window.clearUsuarioActual = clearUsuarioActual;

// Funciones de contacto y estadísticas
window.enviarContacto = enviarContacto;
window.obtenerEstadisticas = obtenerEstadisticas;

// Funciones de utilidad
window.mostrarNotificacion = mostrarNotificacion;
window.formatearFecha = formatearFecha;
window.renderizarEstrellas = renderizarEstrellas;

// Agregar estilos CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);