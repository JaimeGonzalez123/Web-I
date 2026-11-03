import { nombreTipo } from "../lib/logica.js";

// Etiqueta de color con el nombre del tipo en español.
// `apagado` la pinta en gris (se usa en la cobertura de Mi equipo).
export function ChipTipo({ tipo, apagado = false }) {
  return (
    <span className={`chip tipo-${tipo}${apagado ? " apagado" : ""}`}>
      {nombreTipo(tipo)}
    </span>
  );
}
