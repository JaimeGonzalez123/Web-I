// Lista de especies de la PokeAPI: alimenta el <datalist> y la regla "esa especie existe" del esquema
import { pedirJSON } from "./cliente.js";

const URL_POKEDEX = "https://pokeapi.co/api/v2/pokemon-species?limit=2000";

export async function obtenerPokedex(signal) {
  const datos = await pedirJSON(URL_POKEDEX, { signal });
  if (!Array.isArray(datos?.results)) {
    throw new Error("La PokeAPI ha devuelto un formato inesperado");
  }
  return datos.results.map((especie) => especie.name);
}
