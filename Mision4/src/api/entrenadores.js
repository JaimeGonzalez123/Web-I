// Peticiones al recurso /entrenadores de json-server (GET, POST y DELETE)
import { API_URL, ErrorDeCampo, pedirJSON } from "./cliente.js";
import { validarEntrenador, validarListaEntrenadores } from "../schemas/entrenador.js";

const URL_ENTRENADORES = `${API_URL}/entrenadores`;

// Listado, opcionalmente filtrado por región (el filtro lo hace el servidor: ?region=Kanto)
export async function obtenerEntrenadores({ region }, signal) {
  const parametros = new URLSearchParams();
  if (region) parametros.set("region", region);
  const consulta = parametros.toString();
  const datos = await pedirJSON(`${URL_ENTRENADORES}${consulta ? `?${consulta}` : ""}`, { signal });
  const { validos, descartados } = validarListaEntrenadores(datos);
  // Los más recientes primero
  validos.sort((a, b) => b.inscritoEl.localeCompare(a.inscritoEl));
  return { entrenadores: validos, descartados };
}

// Alta. json-server no tiene restricciones de unicidad, así que el alias se comprueba antes del POST.
export async function inscribirEntrenador(inscripcion) {
  const coincidencias = await pedirJSON(
    `${URL_ENTRENADORES}?alias=${encodeURIComponent(inscripcion.alias)}`,
  );
  if (Array.isArray(coincidencias) && coincidencias.length > 0) {
    throw new ErrorDeCampo("alias", "Ese alias ya está inscrito en el torneo");
  }

  // aceptaNormas solo sirve para validar: no se guarda
  const { aceptaNormas: _aceptaNormas, ...datos } = inscripcion;
  const creado = await pedirJSON(URL_ENTRENADORES, {
    method: "POST",
    body: JSON.stringify({ ...datos, inscritoEl: new Date().toISOString() }),
  });
  return validarEntrenador(creado);
}

export async function darDeBaja(id) {
  await pedirJSON(`${URL_ENTRENADORES}/${id}`, { method: "DELETE" });
  return id;
}
