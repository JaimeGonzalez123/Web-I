// Esquema de lo que DEVUELVE el API (reto bonus): no nos fiamos del servidor.
// Cada entrenador se valida con safeParse; los que no cumplen se apartan en vez de romper la app.
import { z } from "zod";
import { CATEGORIAS, MAX_EQUIPO, REGIONES } from "./inscripcion.js";

export const esquemaEntrenador = z.object({
  id: z.union([z.number(), z.string()]),
  alias: z.string().min(3).max(16),
  nombre: z.string().min(2),
  email: z.email(),
  fechaNacimiento: z.iso.date(),
  region: z.enum(REGIONES),
  categoria: z.enum(CATEGORIAS),
  equipo: z
    .array(
      z.object({
        especie: z.string().min(1),
        mote: z.string().max(12),
        nivel: z.number().int().min(1).max(100),
      }),
    )
    .min(1)
    .max(MAX_EQUIPO),
  lema: z.string().max(80),
  inscritoEl: z.iso.datetime(),
});

// Convierte los problemas de Zod en frases cortas para enseñarlas en la interfaz
function describirProblemas(error) {
  return error.issues.map((issue) => `${issue.path.join(".") || "(raíz)"}: ${issue.message}`);
}

// Separa una lista recibida del API en válidos y descartados
export function validarListaEntrenadores(datos) {
  if (!Array.isArray(datos)) {
    throw new Error("El servidor no ha devuelto una lista de entrenadores");
  }
  const validos = [];
  const descartados = [];
  for (const dato of datos) {
    const resultado = esquemaEntrenador.safeParse(dato);
    if (resultado.success) {
      validos.push(resultado.data);
    } else {
      descartados.push({ dato, problemas: describirProblemas(resultado.error) });
    }
  }
  return { validos, descartados };
}

// Valida un único entrenador (la respuesta del POST): si viene mal, es un error de la petición
export function validarEntrenador(dato) {
  const resultado = esquemaEntrenador.safeParse(dato);
  if (!resultado.success) {
    throw new Error(`Respuesta del servidor no válida (${describirProblemas(resultado.error).join("; ")})`);
  }
  return resultado.data;
}
