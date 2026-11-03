// api.js — Única capa que habla con la red (PokeAPI).
// Igual que en la M2, pero ahora cada petición acepta un AbortSignal:
// así un efecto de React puede cancelar la petición en su limpieza.

const BASE = "https://pokeapi.co/api/v2";

// Error de dominio: así el resto de la app distingue fallos de la API
export class ErrorApi extends Error {
  constructor(mensaje, status = 0) {
    super(mensaje);
    this.name = "ErrorApi";
    this.status = status;
  }
}

async function pedirJSON(url, signal) {
  let respuesta;
  try {
    respuesta = await fetch(url, { signal });
  } catch (error) {
    // Si la cancelamos nosotros, se relanza tal cual: no es un fallo que mostrar
    if (error.name === "AbortError") throw error;
    // fetch solo rechaza ante fallos de red (sin conexión, DNS, CORS…)
    throw new ErrorApi(`No hay conexión con la PokeAPI (${error.message}).`);
  }

  // Un 404 o un 500 NO hacen rechazar a fetch: hay que comprobar ok
  if (!respuesta.ok) {
    const mensaje = respuesta.status === 404
      ? "La PokeAPI no encuentra ese recurso (HTTP 404)."
      : `La PokeAPI ha respondido con un error (HTTP ${respuesta.status}).`;
    throw new ErrorApi(mensaje, respuesta.status);
  }

  try {
    return await respuesta.json();
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ErrorApi("La PokeAPI ha devuelto algo que no es JSON válido.");
  }
}

export const obtenerTipos = (signal) => pedirJSON(`${BASE}/type`, signal);

export const obtenerTipo = (nombre, signal) => pedirJSON(`${BASE}/type/${nombre}`, signal);

export const obtenerPokemon = (url, signal) => pedirJSON(url, signal);
