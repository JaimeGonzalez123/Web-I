import { BarraStat } from "./BarraStat.jsx";
import { ChipTipo } from "./ChipTipo.jsx";

// Tarjeta de un Pokémon. No guarda estado: todo llega por props
// y el botón avisa al padre con onAlternarEquipo (flujo inverso).
export function TarjetaPokemon({ pokemon, enEquipo, equipoLleno, onAlternarEquipo }) {
  const { id, nombre, imagen, tipos, altura, peso, stats, total } = pokemon;
  const bloqueado = equipoLleno && !enEquipo;

  return (
    <article className={`tarjeta tipo-${tipos[0] ?? "normal"}`}>
      <header>
        <span className="numero">#{id}</span>
        <span className="total" title="Suma de estadísticas base">Σ {total}</span>
      </header>

      {imagen
        ? <img src={imagen} alt={nombre} loading="lazy" width="160" height="160" />
        : <div className="sin-imagen" aria-label="Sin imagen">?</div>}

      <h2>{nombre}</h2>
      <div className="chips">
        {tipos.map((tipo) => <ChipTipo key={tipo} tipo={tipo} />)}
      </div>
      <p className="medidas">{altura} m · {peso} kg</p>
      <ul className="stats">
        {stats.map((s) => <BarraStat key={s.nombre} nombre={s.nombre} valor={s.valor} />)}
      </ul>

      <button
        type="button"
        className={`boton-equipo${enEquipo ? " activo" : ""}`}
        aria-pressed={enEquipo}
        disabled={bloqueado}
        title={bloqueado ? "Tu equipo ya tiene 6 Pokémon" : undefined}
        onClick={() => onAlternarEquipo(pokemon)}
      >
        {enEquipo ? "★ En tu equipo" : "☆ Añadir al equipo"}
      </button>
    </article>
  );
}
