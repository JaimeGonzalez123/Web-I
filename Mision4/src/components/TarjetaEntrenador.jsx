import { edadEn } from "../schemas/inscripcion.js";

const formatoFecha = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" });

// Capitaliza el nombre de la especie que viene de la PokeAPI ("mr-mime" → "Mr-mime")
const bonito = (especie) => especie.charAt(0).toUpperCase() + especie.slice(1);

export default function TarjetaEntrenador({ entrenador, onBaja, dandoDeBaja }) {
  const { alias, nombre, region, categoria, fechaNacimiento, equipo, lema, inscritoEl } = entrenador;

  return (
    <li className={`tarjeta-entrenador${dandoDeBaja ? " saliendo" : ""}`}>
      <div className="tarjeta-cabecera">
        <div>
          <h3>{alias}</h3>
          <p className="subtitulo">
            {nombre} · {region} · {edadEn(fechaNacimiento)} años el día del torneo
          </p>
        </div>
        <span className={`insignia insignia-${categoria}`}>{categoria}</span>
      </div>

      {lema && <p className="lema">«{lema}»</p>}

      <ul className="chips" aria-label={`Equipo de ${alias}`}>
        {equipo.map((miembro) => (
          <li key={miembro.especie} className="chip">
            {miembro.mote ? `${miembro.mote} (${bonito(miembro.especie)})` : bonito(miembro.especie)}
            <span className="nivel">Nv. {miembro.nivel}</span>
          </li>
        ))}
      </ul>

      <div className="tarjeta-pie">
        <time dateTime={inscritoEl}>Inscrito el {formatoFecha.format(new Date(inscritoEl))}</time>
        <button type="button" className="boton-texto" onClick={onBaja} disabled={dandoDeBaja}>
          {dandoDeBaja ? "Dando de baja…" : "Dar de baja"}
        </button>
      </div>
    </li>
  );
}
