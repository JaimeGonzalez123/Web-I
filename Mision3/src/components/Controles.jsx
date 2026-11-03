import { CRITERIOS_ORDEN } from "../lib/logica.js";

// Panel de controles. Todos los campos son controlados: el valor viene del estado de App
// (value) y cada cambio sube con su callback (onChange). Este componente no guarda estado.
export function Controles({
  tipos, cargandoTipos, tipo, onCambiarTipo,
  busqueda, onCambiarBusqueda, orden, onCambiarOrden,
  onVaciarCache, aviso,
}) {
  return (
    <section className="panel" aria-label="Controles">
      <label>
        Tipo
        <select value={tipo} disabled={cargandoTipos} onChange={(e) => onCambiarTipo(e.target.value)}>
          <option value="">{cargandoTipos ? "Cargando tipos…" : "— Elige un tipo —"}</option>
          {tipos.map(({ valor, texto }) => <option key={valor} value={valor}>{texto}</option>)}
        </select>
      </label>

      <label>
        Buscar por nombre
        <input
          type="search"
          placeholder="p. ej. char"
          autoComplete="off"
          value={busqueda}
          disabled={!tipo}
          onChange={(e) => onCambiarBusqueda(e.target.value)}
        />
      </label>

      <label>
        Ordenar por
        <select value={orden} onChange={(e) => onCambiarOrden(e.target.value)}>
          {CRITERIOS_ORDEN.map(({ valor, texto }) => <option key={valor} value={valor}>{texto}</option>)}
        </select>
      </label>

      <button type="button" className="boton secundario" onClick={onVaciarCache}>Vaciar caché</button>
      {aviso && <p className="aviso-cache" aria-live="polite">{aviso}</p>}
    </section>
  );
}
