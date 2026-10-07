// main.js — Punto de entrada: coordina API, caché, lógica y render.

import "./style.css";
import { obtenerTipos, obtenerTipo, obtenerPokemon } from "./api.js";
import { conCache, vaciarCache } from "./cache.js";
import {
  normalizarTipos, pokemonDelTipo, normalizarPokemon,
  filtrarPorNombre, ordenar, resumir, nombreTipo,
} from "./logica.js";
import * as vista from "./render.js";

const estado = { tipo: "", pokemon: [], fallidos: 0, desdeCache: 0 };

// Si el usuario cambia de tipo antes de que acabe una carga, la respuesta
// antigua llega tarde y no debe pisar a la nueva: cada carga lleva su número.
let cargaActual = 0;

async function iniciar() {
  vista.mostrarCargando("Encendiendo la Pokédex…");
  try {
    const { datos: tipos } = await conCache("tipos", async () => normalizarTipos(await obtenerTipos()));
    if (tipos.length === 0) {
      vista.mostrarVacio("La PokeAPI no ha devuelto ningún tipo. Prueba más tarde.", "🫙");
      return;
    }
    vista.pintarOpcionesTipo(tipos);
    vista.mostrarVacio("Elige un tipo para empezar la odisea.", "🧭");
  } catch (error) {
    vista.mostrarError(error.message, iniciar);
  }
}

async function cargarTipo(tipo) {
  const numero = ++cargaActual;
  estado.tipo = tipo;
  estado.pokemon = [];

  if (!tipo) {
    vista.pintarResumen(null, {});
    vista.pintarPokemon([]);
    vista.mostrarVacio("Elige un tipo para empezar la odisea.", "🧭");
    return;
  }

  vista.mostrarCargando(`Rastreando Pokémon de tipo ${nombreTipo(tipo)}…`);
  try {
    const { datos: lista } = await conCache(`tipo:${tipo}`, async () => pokemonDelTipo(await obtenerTipo(tipo)));
    if (numero !== cargaActual) return;

    if (lista.length === 0) {
      vista.mostrarVacio(`No hay ningún Pokémon de tipo ${nombreTipo(tipo)}. ¡Tipo fantasma (literalmente)!`, "🫙");
      return;
    }

    vista.mostrarCargando(`Capturando ${lista.length} Pokémon en paralelo…`);

    // Las peticiones son independientes → en paralelo. allSettled para que
    // un Pokémon que falle no tire abajo a los demás.
    const resultados = await Promise.allSettled(
      lista.map(({ name, url }) =>
        conCache(`pokemon:${name}`, async () => normalizarPokemon(await obtenerPokemon(url)))),
    );
    if (numero !== cargaActual) return;

    const correctos = resultados.filter((r) => r.status === "fulfilled").map((r) => r.value);
    estado.pokemon = correctos.map((r) => r.datos);
    estado.fallidos = resultados.length - correctos.length;
    estado.desdeCache = correctos.filter((r) => r.desdeCache).length;

    if (estado.pokemon.length === 0) {
      throw new Error("No se ha podido cargar ningún Pokémon de este tipo.");
    }
    actualizarVista();
  } catch (error) {
    if (numero !== cargaActual) return;
    vista.mostrarError(error.message, () => cargarTipo(tipo));
  }
}

// Filtra y ordena lo que ya está en memoria: no hace ninguna petición
function actualizarVista() {
  if (estado.pokemon.length === 0) return;

  const { busqueda, orden } = vista.leerFiltros();
  const visibles = ordenar(filtrarPorNombre(estado.pokemon, busqueda), orden);

  vista.pintarResumen(resumir(estado.pokemon, estado.tipo), {
    tipo: estado.tipo,
    cargados: estado.pokemon.length,
    fallidos: estado.fallidos,
    desdeCache: estado.desdeCache,
  });
  vista.pintarPokemon(visibles);

  if (visibles.length === 0) {
    vista.mostrarVacio(`Ningún Pokémon coincide con «${busqueda.trim()}».`);
  } else {
    vista.limpiarEstado();
  }
}

vista.escucharControles({
  alCambiarTipo: cargarTipo,
  alFiltrar: actualizarVista,
  alVaciarCache: () => {
    const borradas = vaciarCache();
    vista.mostrarAvisoCache(`Caché vaciada (${borradas} entradas). Las próximas cargas irán a la red.`);
  },
});

iniciar();
