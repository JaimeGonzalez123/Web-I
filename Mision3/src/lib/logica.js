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

export function filtrarPorNombre(lista, texto) {
  const busqueda = texto.trim().toLowerCase();
  return lista.filter((p) => p.nombre.includes(busqueda));
}

const CRITERIOS = {
  numero: (a, b) => a.id - b.id,
  total: (a, b) => b.total - a.total,
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
  peso: (a, b) => b.peso - a.peso,
};

// Opciones del selector de orden (antes estaban escritas a mano en index.html)
export const CRITERIOS_ORDEN = [
  { valor: "numero", texto: "Nº de Pokédex" },
  { valor: "total", texto: "Más fuertes (Σ stats)" },
  { valor: "nombre", texto: "Nombre (A-Z)" },
  { valor: "peso", texto: "Más pesados" },
];

// toSorted: devuelve un array nuevo, el original queda intacto
export const ordenar = (lista, criterio) => lista.toSorted(CRITERIOS[criterio] ?? CRITERIOS.numero);

// Estadísticas del equipo cargado (se calculan sobre la lista completa)
export function resumir(lista, tipoActual) {
  if (lista.length === 0) return null;

  const campeon = lista.reduce((mejor, p) => (p.total > mejor.total ? p : mejor));
  const masPesado = lista.reduce((max, p) => (p.peso > max.peso ? p : max));
  const media = Math.round(lista.reduce((suma, p) => suma + p.total, 0) / lista.length);

  // ¿Con qué otro tipo se combina cada Pokémon? ("puro" si solo tiene uno)
  const porCompanero = Object.groupBy(
    lista,
    (p) => p.tipos.find((t) => t !== tipoActual) ?? "puro",
  );
  const combinaciones = Object.entries(porCompanero)
    .map(([tipo, miembros]) => ({
      texto: tipo === "puro" ? "Puro" : nombreTipo(tipo),
      cantidad: miembros.length,
    }))
    .toSorted((a, b) => b.cantidad - a.cantidad);

  return { campeon, masPesado, media, combinaciones };
}

// ---------- Mi equipo (M3) ----------

export const TAM_EQUIPO = 6;

// Los 18 tipos de combate (sin Astral, Desconocido ni Oscuro, que no tienen Pokémon normales)
const TIPOS_COMBATE = [
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

// Añade el Pokémon si no está (y cabe) o lo quita si ya está. Devuelve un array nuevo.
export function alternarMiembro(equipo, pokemon) {
  if (equipo.some((p) => p.id === pokemon.id)) return equipo.filter((p) => p.id !== pokemon.id);
  if (equipo.length >= TAM_EQUIPO) return equipo;
  return [...equipo, pokemon];
}

// Datos derivados del equipo: se calculan en cada render, no se guardan en el estado
export function resumirEquipo(equipo) {
  const cubiertos = new Set(equipo.flatMap((p) => p.tipos));
  return {
    total: equipo.reduce((suma, p) => suma + p.total, 0),
    media: equipo.length === 0 ? 0 : Math.round(equipo.reduce((suma, p) => suma + p.total, 0) / equipo.length),
    cobertura: TIPOS_COMBATE.map((tipo) => ({ tipo, cubierto: cubiertos.has(tipo) })),
    tiposCubiertos: TIPOS_COMBATE.filter((tipo) => cubiertos.has(tipo)).length,
    totalTipos: TIPOS_COMBATE.length,
  };
}
