import { ChipTipo } from "./ChipTipo.jsx";
import { resumirEquipo, TAM_EQUIPO } from "../lib/logica.js";

// Panel "Mi equipo": hasta 6 Pokémon de cualquier tipo, guardados entre visitas.
// El estado vive en App (lo comparte con las tarjetas); aquí solo se muestra y se derivan datos.
export function MiEquipo({ equipo, onQuitar, onVaciar }) {
  const { total, media, cobertura, tiposCubiertos, totalTipos } = resumirEquipo(equipo);
  const huecos = TAM_EQUIPO - equipo.length;

  return (
    <section className="equipo" aria-label="Mi equipo">
      <div className="equipo-cabecera">
        <h2>Mi equipo <span className="contador">{equipo.length}/{TAM_EQUIPO}</span></h2>
        {equipo.length > 0 && (
          <button type="button" className="boton secundario" onClick={onVaciar}>Vaciar equipo</button>
        )}
      </div>

      {equipo.length === 0 ? (
        <p className="equipo-vacio">
          Pulsa «☆ Añadir al equipo» en cualquier tarjeta. Puedes mezclar Pokémon de distintos tipos.
        </p>
      ) : (
        <>
          <ul className="miembros">
            {equipo.map((p) => (
              <li key={p.id} className={`miembro tipo-${p.tipos[0] ?? "normal"}`}>
                {p.imagen ? <img src={p.imagen} alt="" width="48" height="48" /> : <span className="sin-imagen">?</span>}
                <span className="miembro-nombre">{p.nombre}</span>
                <span className="miembro-total">Σ {p.total}</span>
                <button type="button" className="quitar" aria-label={`Quitar a ${p.nombre}`} onClick={() => onQuitar(p)}>×</button>
              </li>
            ))}
          </ul>
          <p className="equipo-datos">
            Σ total {total} · media {media}
            {huecos > 0 && ` · quedan ${huecos} ${huecos === 1 ? "hueco" : "huecos"}`}
          </p>
        </>
      )}

      <div className="cobertura">
        <span className="etiqueta">Cobertura de tipos: {tiposCubiertos}/{totalTipos}</span>
        <div className="chips">
          {cobertura.map(({ tipo, cubierto }) => <ChipTipo key={tipo} tipo={tipo} apagado={!cubierto} />)}
        </div>
      </div>
    </section>
  );
}
