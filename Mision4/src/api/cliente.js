// Cliente HTTP mínimo sobre fetch: centraliza la URL base y convierte los fallos en errores con sentido.
// fetch solo rechaza la promesa si no hay red: un 404 o un 500 hay que detectarlo a mano con `ok`.

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Error de negocio que el formulario sabe colocar en un campo concreto (p. ej. alias ocupado)
export class ErrorDeCampo extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorDeCampo";
    this.campo = campo;
  }
}

export async function pedirJSON(url, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(url, {
      ...opciones,
      headers: { "Content-Type": "application/json", ...opciones.headers },
    });
  } catch {
    throw new Error("No hay conexión con el servidor. ¿Está arrancado (npm run api)?");
  }
  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status} ${respuesta.statusText}`);
  }
  // DELETE en json-server devuelve {}; si no hay cuerpo, devolvemos null
  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
}
