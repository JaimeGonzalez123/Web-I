// api.js — Única capa que habla con la red (PokeAPI).
// Solo pide datos y lanza errores claros; no transforma ni pinta nada.

const BASE = "https://pokeapi.co/api/v2";

// Error de dominio: así el resto de la app distingue fallos de la API
export class ErrorApi extends Error {
  constructor(mensaje, status = 0) {
    super(mensaje);
    this.name = "ErrorApi";
    this.status = status;
  }
}

async function pedirJSON(url) {
  let respuesta;
  try {
    respuesta = await fetch(url);
  } catch (error) {
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
    throw new ErrorApi("La PokeAPI ha devuelto algo que no es JSON válido.");
  }
}

export const obtenerTipos = () => pedirJSON(`${BASE}/type`);

export const obtenerTipo = (nombre) => pedirJSON(`${BASE}/type/${nombre}`);

export const obtenerPokemon = (url) => pedirJSON(url);
