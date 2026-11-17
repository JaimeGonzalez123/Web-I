import { useState } from "react";
import { REGIONES } from "../schemas/inscripcion.js";
import { useDarDeBaja, useEntrenadores } from "../hooks/consultas.js";
import Aviso from "./Aviso.jsx";
import RegistrosDescartados from "./RegistrosDescartados.jsx";
import TarjetaEntrenador from "./TarjetaEntrenador.jsx";

export default function ListaEntrenadores() {
  const [region, setRegion] = useState("");
  // El filtro forma parte de la clave: cada región tiene su propia entrada en la caché
  const consulta = useEntrenadores({ region });
  const baja = useDarDeBaja();

  const entrenadores = consulta.data?.entrenadores ?? [];
  const descartados = consulta.data?.descartados ?? [];
  // isFetching sin isPending = ya hay datos en pantalla y se están refrescando en segundo plano
  const refrescando = consulta.isFetching && !consulta.isPending;

  return (
    <section className="tarjeta-panel" aria-labelledby="titulo-lista">
      <div className="lista-cabecera">
        <div>
          <h2 id="titulo-lista">Participantes</h2>
          <p className="subtitulo" aria-live="polite">
            {consulta.isSuccess &&
              `${entrenadores.length} ${entrenadores.length === 1 ? "inscrito" : "inscritos"}${region ? ` de ${region}` : ""}`}
            {refrescando && " · actualizando…"}
          </p>
        </div>
        <label className="filtro">
          Región
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Todas</option>
            {REGIONES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      {baja.isError && (
        <Aviso tipo="error" titulo="No se ha podido dar de baja">
          {baja.error.message}
        </Aviso>
      )}

      {consulta.isPending && (
        <ul className="lista-esqueleto" aria-busy="true" aria-label="Cargando participantes">
          {[1, 2, 3].map((n) => (
            <li key={n} className="esqueleto" />
          ))}
        </ul>
      )}

      {consulta.isError && (
        <Aviso
          tipo="error"
          titulo="No se ha podido cargar la lista"
          accion={
            <button type="button" className="boton-secundario" onClick={() => consulta.refetch()}>
              Reintentar
            </button>
          }
        >
          {consulta.error.message}
        </Aviso>
      )}

      {consulta.isSuccess && entrenadores.length === 0 && (
        <p className="vacio">
          {region ? `Nadie de ${region} se ha inscrito todavía.` : "Aún no hay inscritos. ¡Sé el primero!"}
        </p>
      )}

      {entrenadores.length > 0 && (
        <ul className={`lista-entrenadores${refrescando ? " atenuada" : ""}`}>
          {entrenadores.map((entrenador) => (
            <TarjetaEntrenador
              key={entrenador.id}
              entrenador={entrenador}
              onBaja={() => baja.mutate(entrenador.id)}
              // Solo la tarjeta que se está borrando muestra el estado pendiente
              dandoDeBaja={baja.isPending && baja.variables === entrenador.id}
            />
          ))}
        </ul>
      )}

      <RegistrosDescartados descartados={descartados} />
    </section>
  );
}
