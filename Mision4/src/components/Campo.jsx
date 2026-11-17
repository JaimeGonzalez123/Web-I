import { idsDeCampo } from "../lib/accesibilidad.js";

// Envoltorio de un campo: etiqueta + control + ayuda + error.
// El control (children) recibe sus atributos ARIA con propsAccesibles() desde el formulario.
export default function Campo({ id, etiqueta, error, ayuda, extra, children }) {
  const { idError, idAyuda } = idsDeCampo(id);
  return (
    <div className={`campo${error ? " con-error" : ""}`}>
      <div className="campo-cabecera">
        <label htmlFor={id}>{etiqueta}</label>
        {extra}
      </div>
      {children}
      {ayuda && (
        <p id={idAyuda} className="ayuda">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="error-campo" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
