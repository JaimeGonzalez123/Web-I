// pokedex.js — Cargas completas que usa la app: une API, caché y lógica.
// No sabe nada de React: son funciones async normales que reciben un AbortSignal.

import { obtenerTipos, obtenerTipo, obtenerPokemon } from "./api.js";
import { conCache } from "./cache.js";
import { normalizarTipos, pokemonDelTipo, normalizarPokemon } from "./logica.js";

// Lista de tipos para el selector
export async function cargarTipos(signal) {
  const { datos } = await conCache("tipos", async () => normalizarTipos(await obtenerTipos(signal)));
  return datos;
}

// Los primeros Pokémon de un tipo, ya normalizados
export async function cargarPokemonDeTipo(tipo, signal) {
  const { datos: lista } = await conCache(`tipo:${tipo}`, async () => pokemonDelTipo(await obtenerTipo(tipo, signal)));
  if (lista.length === 0) return { pokemon: [], fallidos: 0, desdeCache: 0 };

  // Las peticiones son independientes → en paralelo. allSettled para que
  // un Pokémon que falle no tire abajo a los demás.
  const resultados = await Promise.allSettled(
    lista.map(({ name, url }) =>
      conCache(`pokemon:${name}`, async () => normalizarPokemon(await obtenerPokemon(url, signal)))),
  );
  signal?.throwIfAborted();

  const correctos = resultados.filter((r) => r.status === "fulfilled").map((r) => r.value);
  if (correctos.length === 0) {
    throw new Error("No se ha podido cargar ningún Pokémon de este tipo.");
  }
  return {
    pokemon: correctos.map((r) => r.datos),
    fallidos: resultados.length - correctos.length,
    desdeCache: correctos.filter((r) => r.desdeCache).length,
  };
}
