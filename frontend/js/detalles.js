// Obtiene el parámetro "id" desde la URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// Datos estáticos de juegos disponibles clásicos
const juegos = [
  {
    id: 1,
    titulo: "The Legend of Zelda",
    consola: "NES",
    año: 1986,
    imagen: "assets/covers/zelda.png",
    descripcion: "Explora calabozos, resuelve acertijos y salva a Hyrule en esta joya clásica."
  },
  {
    id: 2,
    titulo: "Super Metroid",
    consola: "SNES",
    año: 1994,
    imagen: "assets/covers/supermetroid.png",
    descripcion: "Una aventura galáctica intensa con exploración y mejoras progresivas."
  },
  {
    id: 3,
    titulo: "Chrono Trigger",
    consola: "SNES",
    año: 1995,
    imagen: "assets/covers/chronotrigger.png",
    descripcion: "Viaja por el tiempo y salva el futuro en este legendario RPG."
  }
];

// Función para renderizar detalle
function renderDetalle(juego) {
  const detalleHTML = `
    <div class="bg-[#1a1a1a] rounded-2xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-center">
      <img src="${juego.imagen}" alt="${juego.titulo || juego.name}" class="w-64 rounded">
      <div>
        <h2 class="text-3xl neon mb-4">${juego.titulo || juego.name}</h2>
        <p class="text-[#6c63ff] mb-2"><strong>Consola:</strong> ${juego.consola || juego.consoles || 'No aplica'}</p>
        <p class="text-[#6c63ff] mb-2"><strong>Año:</strong> ${juego.año || juego.released || 'Desconocido'}</p>
        <p class="text-white mb-4">${juego.descripcion || (juego.description_raw || 'Sin descripción')}</p>
        <a href="index.html" class="cta-glow bg-[#00ffcc] text-black px-4 py-2 rounded font-semibold inline-block">← Volver al catálogo</a>
      </div>
    </div>
  `;
  document.getElementById("detalle-juego").innerHTML = detalleHTML;
}

// Busca el juego correspondiente al ID obtenido
let juego = juegos.find(j => j.id === id);

if (juego) {
  // Juego clásico encontrado localmente
  renderDetalle(juego);
} else {
  // Si no, intentar buscarlo en RAWG
  const API_KEY = "17a8c4f8d106455baf54eda6d323173e";

  fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
    .then(res => {
      if (!res.ok) throw new Error("Respuesta no OK");
      return res.json();
    })
    .then(data => {
      // Procesar consolas: unir nombres de plataformas si existen
      const consolasRAWG = data.platforms
        ? data.platforms.map(p => p.platform.name).join(', ')
        : 'No aplica';

      const juegoRAWG = {
        titulo: data.name,
        imagen: data.background_image,
        año: data.released,
        descripcion: data.description_raw,
        consola: consolasRAWG
      };
      renderDetalle(juegoRAWG);
    })
    .catch(err => {
      console.error("Error al buscar en RAWG:", err);
      document.getElementById("detalle-juego").innerHTML =
        "<p class='text-red-500 text-center'>No se encontró el juego seleccionado.</p>";
    });
}
