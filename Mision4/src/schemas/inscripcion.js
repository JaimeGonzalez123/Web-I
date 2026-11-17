// Esquema del formulario de inscripción: ÚNICA fuente de verdad de la validación.
// El formulario no tiene ninguna regla propia (nada de `required` ni `pattern` en los inputs):
// todo lo que se valida está aquí y llega a React Hook Form a través de zodResolver.
import { z } from "zod";

export const REGIONES = [
  "Kanto", "Johto", "Hoenn", "Sinnoh", "Teselia", "Kalos", "Alola", "Galar", "Paldea",
];

export const CATEGORIAS = ["junior", "abierta"];

// Reglas del torneo (constantes con nombre para no tener "números mágicos")
export const MAX_EQUIPO = 6;
export const EDAD_MINIMA = 10;
export const EDAD_MAXIMA_JUNIOR = 15;
export const NIVEL_MAXIMO_JUNIOR = 50;
export const FECHA_TORNEO = "2026-12-12";

// Años cumplidos en una fecha dada (las dos en formato AAAA-MM-DD)
export function edadEn(fechaNacimiento, fechaReferencia = FECHA_TORNEO) {
  const [an, mn, dn] = fechaNacimiento.split("-").map(Number);
  const [ar, mr, dr] = fechaReferencia.split("-").map(Number);
  const yaCumplio = mr > mn || (mr === mn && dr >= dn);
  return ar - an - (yaCumplio ? 0 : 1);
}

const hoyISO = () => new Date().toISOString().slice(0, 10);

// Un miembro del equipo. `pokedex` es un Set con los nombres válidos (o null si aún no ha cargado:
// en ese caso no se comprueba que la especie exista, para no bloquear el formulario).
function crearEsquemaMiembro(pokedex) {
  return z.object({
    especie: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, { error: "Escribe la especie del Pokémon" })
      .refine((especie) => !pokedex || pokedex.has(especie), {
        error: "Esa especie no está en la Pokédex",
      }),
    mote: z
      .string()
      .trim()
      .max(12, { error: "El mote admite como mucho 12 caracteres" }),
    nivel: z
      .number({ error: "El nivel tiene que ser un número" })
      .int({ error: "El nivel tiene que ser un número entero" })
      .min(1, { error: "El nivel mínimo es 1" })
      .max(100, { error: "El nivel máximo es 100" }),
  });
}

// Reglas que cruzan varios campos. Con `when` se ejecutan aunque otros campos aún tengan errores,
// así el usuario las ve a la vez que el resto (por defecto Zod se las saltaría).
// Como pueden llegar datos a medio validar, se comprueba cada tipo antes de usarlo.
function reglasDelTorneo(datos, ctx) {
  const { fechaNacimiento, categoria, equipo } = datos;
  const fechaValida = typeof fechaNacimiento === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento);
  const miembros = Array.isArray(equipo) ? equipo : [];

  // Categoría junior: menores de 16 el día del torneo
  if (categoria === "junior" && fechaValida && edadEn(fechaNacimiento) > EDAD_MAXIMA_JUNIOR) {
    ctx.addIssue({
      code: "custom",
      path: ["categoria"],
      message: `La categoría junior es hasta ${EDAD_MAXIMA_JUNIOR} años el día del torneo (${FECHA_TORNEO})`,
    });
  }

  // Categoría junior: nivel máximo 50 en cada Pokémon
  if (categoria === "junior") {
    miembros.forEach((miembro, i) => {
      if (typeof miembro?.nivel === "number" && miembro.nivel > NIVEL_MAXIMO_JUNIOR) {
        ctx.addIssue({
          code: "custom",
          path: ["equipo", i, "nivel"],
          message: `En junior el nivel máximo es ${NIVEL_MAXIMO_JUNIOR}`,
        });
      }
    });
  }

  // Cláusula de especies: no se puede repetir especie (se marca la segunda aparición)
  const vistas = new Set();
  miembros.forEach((miembro, i) => {
    const especie = typeof miembro?.especie === "string" ? miembro.especie.trim().toLowerCase() : "";
    if (!especie) return;
    if (vistas.has(especie)) {
      ctx.addIssue({
        code: "custom",
        path: ["equipo", i, "especie"],
        message: "Especie repetida: la cláusula de especies lo prohíbe",
      });
    }
    vistas.add(especie);
  });
}

export function crearEsquemaInscripcion(pokedex = null) {
  return z
    .object({
      alias: z
        .string()
        .trim()
        .min(3, { error: "El alias necesita al menos 3 caracteres" })
        .max(16, { error: "El alias admite como mucho 16 caracteres" })
        .regex(/^[A-Za-z0-9_]+$/, { error: "Solo letras sin tildes, números y _" }),
      nombre: z
        .string()
        .trim()
        .min(2, { error: "Escribe tu nombre" })
        .max(50, { error: "El nombre admite como mucho 50 caracteres" }),
      email: z.email({ error: "Ese correo no parece válido" }),
      fechaNacimiento: z
        .iso.date({ error: "Indica tu fecha de nacimiento" })
        .refine((fecha) => fecha <= hoyISO(), { error: "La fecha no puede estar en el futuro" })
        .refine((fecha) => edadEn(fecha) >= EDAD_MINIMA, {
          error: `Hay que tener al menos ${EDAD_MINIMA} años el día del torneo`,
        }),
      region: z.enum(REGIONES, { error: "Elige tu región de origen" }),
      categoria: z.enum(CATEGORIAS, { error: "Elige una categoría" }),
      equipo: z
        .array(crearEsquemaMiembro(pokedex))
        .min(1, { error: "El equipo necesita al menos un Pokémon" })
        .max(MAX_EQUIPO, { error: `El equipo admite como mucho ${MAX_EQUIPO} Pokémon` }),
      lema: z.string().trim().max(80, { error: "El lema admite como mucho 80 caracteres" }),
      aceptaNormas: z.literal(true, { error: "Tienes que aceptar las normas del torneo" }),
    })
    .superRefine(reglasDelTorneo, { when: () => true });
}

// Valores iniciales del formulario (también se usan al vaciarlo tras una inscripción correcta)
export const VALORES_INICIALES = {
  alias: "",
  nombre: "",
  email: "",
  fechaNacimiento: "",
  region: "",
  categoria: "",
  equipo: [{ especie: "", mote: "", nivel: 5 }],
  lema: "",
  aceptaNormas: false,
};
