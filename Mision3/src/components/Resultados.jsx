import { Cargando, ErrorCarga, Vacio } from "./EstadoCarga.jsx";
import { Resumen } from "./Resumen.jsx";
import { RejillaPokemon } from "./RejillaPokemon.jsx";
import { filtrarPorNombre, nombreTipo, ordenar, resumir } from "../lib/logica.js";

// Zona de resultados del tipo elegido. Decide qué estado mostrar con retornos tempranos
// (más legible que ternarios anidados) y deriva la lista visible en el render:
// buscar u ordenar no hace peticiones ni guarda nada en el estado.
export function Resultados({ tipo, carga, busqueda, orden, idsEnEquipo, equipoLleno, onAlternarEquipo }) {
  if (!tipo) return <Vacio icono="🧭" mensaje="Elige un tipo para empezar la odisea." />;
  if (carga.estado === "cargando") return <Cargando mensaje={`Rastreando Pokémon de tipo ${nombreTipo(tipo)}…`} />;
  if (carga.estado === "error") return <ErrorCarga mensaje={carga.error.message} onReintentar={carga.reintentar} />;

  const { pokemon, fallidos, desdeCache } = carga.datos;
  if (pokemon.length === 0) {
    return <Vacio icono="🫙" mensaje={`No hay ningún Pokémon de tipo ${nombreTipo(tipo)}. ¡Tipo fantasma (literalmente)!`} />;
  }

  const visibles = ordenar(filtrarPorNombre(pokemon, busqueda), orden);

  return (
    <>
      <Resumen
        resumen={resumir(pokemon, tipo)}
        tipo={tipo}
        cargados={pokemon.length}
        fallidos={fallidos}
        desdeCache={desdeCache}
      />
      {visibles.length === 0
        ? <Vacio mensaje={`Ningún Pokémon coincide con «${busqueda.trim()}».`} />
        : (
          <RejillaPokemon
            pokemon={visibles}
            idsEnEquipo={idsEnEquipo}
            equipoLleno={equipoLleno}
            onAlternarEquipo={onAlternarEquipo}
          />
        )}
    </>
  );
}
