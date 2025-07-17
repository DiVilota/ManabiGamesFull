// formulario.js - Versión con conexión al backend

// Obtener elementos del formulario y mensajes
const form = document.getElementById('contactForm');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');

// Función para validar email con regex simple
function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Función para mostrar mensaje de error
function mostrarError(mensaje) {
  errorMsg.textContent = mensaje;
  errorMsg.classList.remove('hidden');
  successMsg.classList.add('hidden');
}

// Función para mostrar mensaje de éxito
function mostrarExito(mensaje) {
  successMsg.textContent = mensaje;
  successMsg.classList.remove('hidden');
  errorMsg.classList.add('hidden');
}

// Función para limpiar mensajes
function limpiarMensajes() {
  errorMsg.classList.add('hidden');
  successMsg.classList.add('hidden');
}

// Función para enviar al backend
async function enviarFormularioBackend(datos) {
  try {
    const respuesta = await enviarContacto(datos);
    console.log('Mensaje enviado exitosamente:', respuesta);
    mostrarExito('¡Mensaje enviado exitosamente! Te responderemos pronto.');
    return true;
  } catch (error) {
    console.error('Error al enviar al backend:', error);
    return false;
  }
}

// Función para simular envío local (fallback)
function enviarFormularioLocal(datos) {
  // Simular envío con un pequeño delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Formulario enviado localmente (simulado):', datos);
      mostrarExito('¡Mensaje procesado localmente! (El backend no está disponible)');
      resolve(true);
    }, 1000);
  });
}

// Evento submit con validación y envío
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Limpiar mensajes previos
  limpiarMensajes();

  const nombre = form.nombre.value.trim();
  const email = form.email.value.trim();
  const mensaje = form.mensaje.value.trim();

  // Validaciones básicas
  if (nombre === '' || email === '' || mensaje === '') {
    mostrarError('Por favor, completa todos los campos.');
    return;
  }

  if (!validarEmail(email)) {
    mostrarError('Por favor, ingresa un correo electrónico válido.');
    return;
  }

  // Validaciones adicionales
  if (nombre.length < 2) {
    mostrarError('El nombre debe tener al menos 2 caracteres.');
    return;
  }

  if (mensaje.length < 10) {
    mostrarError('El mensaje debe tener al menos 10 caracteres.');
    return;
  }

  // Deshabilitar el botón de envío mientras se procesa
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
  }

  try {
    const datos = {
      nombre: nombre,
      email: email,
      mensaje: mensaje,
      fecha: new Date().toISOString()
    };

    let exitoso = false;

    // Verificar si las funciones del backend están disponibles
    if (typeof enviarContacto !== 'undefined') {
      console.log('Intentando enviar al backend...');
      exitoso = await enviarFormularioBackend(datos);
    }

    // Si el backend no está disponible o falló, usar envío local
    if (!exitoso) {
      console.log('Enviando localmente como fallback...');
      await enviarFormularioLocal(datos);
    }

    // Resetear el formulario
    form.reset();

  } catch (error) {
    console.error('Error inesperado:', error);
    mostrarError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
  } finally {
    // Rehabilitar el botón de envío
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar Mensaje';
    }
  }
});

// Validación en tiempo real para mejorar UX
form.nombre.addEventListener('input', function() {
  if (this.value.length >= 2) {
    this.classList.remove('border-red-500');
    this.classList.add('border-green-500');
  } else {
    this.classList.remove('border-green-500');
    this.classList.add('border-red-500');
  }
});

form.email.addEventListener('input', function() {
  if (validarEmail(this.value)) {
    this.classList.remove('border-red-500');
    this.classList.add('border-green-500');
  } else {
    this.classList.remove('border-green-500');
    this.classList.add('border-red-500');
  }
});

form.mensaje.addEventListener('input', function() {
  if (this.value.length >= 10) {
    this.classList.remove('border-red-500');
    this.classList.add('border-green-500');
  } else {
    this.classList.remove('border-green-500');
    this.classList.add('border-red-500');
  }
});