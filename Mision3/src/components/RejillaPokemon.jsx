import { TarjetaPokemon } from "./TarjetaPokemon.jsx";

// Lista de tarjetas. La key es el id de la Pokédex: estable aunque se filtre u ordene
// (con el índice, React confundiría las tarjetas al reordenar).
export function RejillaPokemon({ pokemon, idsEnEquipo, equipoLleno, onAlternarEquipo }) {
  return (
    <section className="rejilla" aria-label="Pokémon">
      {pokemon.map((p) => (
        <TarjetaPokemon
          key={p.id}
          pokemon={p}
          enEquipo={idsEnEquipo.has(p.id)}
          equipoLleno={equipoLleno}
          onAlternarEquipo={onAlternarEquipo}
        />
      ))}
    </section>
  );
}
