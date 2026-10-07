// cache.js — BONUS: caché en localStorage para no repetir peticiones ya hechas.
// Se guardan los datos YA transformados (pocos bytes), no la respuesta cruda
// de la PokeAPI, que pesa cientos de KB por Pokémon y llenaría el almacenamiento.

const PREFIJO = "pokeodisea:";
const CADUCIDAD_MS = 24 * 60 * 60 * 1000; // 24 horas

function leer(clave) {
  try {
    // getItem devuelve null si no existe y JSON.parse(null) también da null
    const guardado = JSON.parse(localStorage.getItem(PREFIJO + clave));
    if (!guardado || Date.now() - guardado.fecha > CADUCIDAD_MS) return null;
    return guardado.datos ?? null;
  } catch (error) {
    // Texto corrupto o localStorage bloqueado: se trata como si no hubiera caché
    return null;
  }
}

function guardar(clave, datos) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify({ fecha: Date.now(), datos }));
  } catch (error) {
    // Cuota llena o modo privado: la app sigue funcionando sin caché
    console.warn("No se pudo guardar en caché:", error.message);
  }
}

// Devuelve lo cacheado si existe; si no, ejecuta cargar(), lo guarda y lo devuelve
export async function conCache(clave, cargar) {
  const enCache = leer(clave);
  if (enCache !== null) return { datos: enCache, desdeCache: true };

  const datos = await cargar();
  const vacio = Array.isArray(datos) && datos.length === 0;
  if (!vacio) guardar(clave, datos); // no se cachean respuestas vacías
  return { datos, desdeCache: false };
}

export function vaciarCache() {
  try {
    const claves = Object.keys(localStorage).filter((c) => c.startsWith(PREFIJO));
    claves.forEach((c) => localStorage.removeItem(c));
    return claves.length;
  } catch (error) {
    return 0;
  }
}
