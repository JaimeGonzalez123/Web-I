import { nombreTipo } from "../lib/logica.js";

// Una casilla del resumen. Reutilizable: cambia la etiqueta y el contenido (children).
function Dato({ etiqueta, children }) {
  return (
    <div className="dato">
      <span className="etiqueta">{etiqueta}</span>
      {children}
    </div>
  );
}

// Resumen del tipo cargado. `resumen` ya viene calculado por resumir() en logica.js.
export function Resumen({ resumen, tipo, cargados, fallidos, desdeCache }) {
  const { campeon, masPesado, media, combinaciones } = resumen;

  return (
    <section className="resumen" aria-label="Resumen del tipo">
      <Dato etiqueta={`Campeón ${nombreTipo(tipo)}`}>
        <strong>{campeon.nombre}</strong>
        <span>Σ {campeon.total}</span>
      </Dato>
      <Dato etiqueta="Media del equipo">
        <strong>{media}</strong>
        <span>puntos de estadística</span>
      </Dato>
      <Dato etiqueta="Peso pesado">
        <strong>{masPesado.nombre}</strong>
        <span>{masPesado.peso} kg</span>
      </Dato>
      <Dato etiqueta="Se combina con">
        <span className="combinaciones">
          {combinaciones.map(({ texto, cantidad }) => `${texto} ×${cantidad}`).join(" · ")}
        </span>
      </Dato>
      <p className="origen">
        {cargados} Pokémon · ⚡ {desdeCache} desde caché local · 🌐 {cargados - desdeCache} desde la red
        {fallidos > 0 && <> · <span className="fallo">⚠ {fallidos} no se pudieron cargar</span></>}
      </p>
    </section>
  );
}
