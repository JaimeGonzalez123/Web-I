// Atributos ARIA de un campo con posible error y texto de ayuda.
// aria-invalid hace que el lector de pantalla diga "no válido" y aria-describedby le hace leer
// el mensaje de error (y la ayuda) al entrar en el campo.
export function idsDeCampo(id) {
  return { idError: `${id}-error`, idAyuda: `${id}-ayuda` };
}

export function propsAccesibles(id, error, conAyuda = false) {
  const { idError, idAyuda } = idsDeCampo(id);
  const descritoPor = [conAyuda && idAyuda, error && idError].filter(Boolean).join(" ");
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": descritoPor || undefined,
  };
}
