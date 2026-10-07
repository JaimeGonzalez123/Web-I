// logica.js — Transformación de datos con funciones puras.
// Nada de fetch ni de DOM: entra JSON (o datos ya limpios) y sale otro valor nuevo.

export const LIMITE = 12;          // Pokémon que se muestran por tipo
const ULTIMO_ID_BASE = 1025;       // a partir de aquí son formas alternativas (megas, gigamax…)

const NOMBRES_TIPO = {
  normal: "Normal", fire: "Fuego", water: "Agua", grass: "Planta",
  electric: "Eléctrico", ice: "Hielo", fighting: "Lucha", poison: "Veneno",
  ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro",
  steel: "Acero", fairy: "Hada", stellar: "Astral", unknown: "Desconocido",
  shadow: "Oscuro",
};

const NOMBRES_STAT = {
  hp: "PS", attack: "Ataque", defense: "Defensa",
  "special-attack": "At. esp.", "special-defense": "Def. esp.", speed: "Velocidad",
};

export const nombreTipo = (tipo) => NOMBRES_TIPO[tipo] ?? tipo;

// Si la API devuelve algo que no es un array, trabajamos con uno vacío
const comoArray = (valor) => (Array.isArray(valor) ? valor : []);

// ".../pokemon/25/" → 25
const idDesdeUrl = (url) => Number(url.split("/").filter((trozo) => trozo !== "").at(-1));

// Respuesta de /type → [{ valor, texto }] ordenada por nombre en español
export function normalizarTipos(respuesta) {
  return comoArray(respuesta?.results)
    .filter((tipo) => typeof tipo?.name === "string")
    .map(({ name }) => ({ valor: name, texto: nombreTipo(name) }))
    .toSorted((a, b) => a.texto.localeCompare(b.texto, "es"));
}

// Respuesta de /type/{nombre} → [{ name, url }] de los primeros Pokémon "base"
export function pokemonDelTipo(respuesta) {
  return comoArray(respuesta?.pokemon)
    .map((entrada) => entrada?.pokemon)
    .filter((p) => typeof p?.name === "string" && typeof p?.url === "string")
    .filter((p) => idDesdeUrl(p.url) <= ULTIMO_ID_BASE)
    .filter((_, indice) => indice < LIMITE);
}

// Respuesta de /pokemon/{id} → objeto pequeño con solo lo que se pinta
export function normalizarPokemon(datos) {
  const stats = comoArray(datos?.stats).map((s) => ({
    nombre: NOMBRES_STAT[s?.stat?.name] ?? s?.stat?.name ?? "?",
    valor: Number(s?.base_stat) || 0,
  }));

  return {
    id: Number(datos?.id) || 0,
    nombre: datos?.name ?? "desconocido",
    imagen: datos?.sprites?.other?.["official-artwork"]?.front_default
      ?? datos?.sprites?.front_default
      ?? null,
    tipos: comoArray(datos?.types).map((t) => t?.type?.name).filter(Boolean),
    altura: (Number(datos?.height) || 0) / 10, // decímetros → metros
    peso: (Number(datos?.weight) || 0) / 10,   // hectogramos → kg
    stats,
    total: stats.reduce((suma, s) => suma + s.valor, 0),
  };
}
