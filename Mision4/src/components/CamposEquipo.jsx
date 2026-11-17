import { useFieldArray } from "react-hook-form";
import { MAX_EQUIPO } from "../schemas/inscripcion.js";
import { propsAccesibles } from "../lib/accesibilidad.js";
import Campo from "./Campo.jsx";

const ID_DATALIST = "especies-pokedex";

// Lista dinámica de Pokémon del equipo con useFieldArray.
// Cada fila sigue siendo NO controlada: register() conecta los inputs sin useState.
export default function CamposEquipo({ control, register, errors, especies }) {
  const { fields, append, remove } = useFieldArray({ control, name: "equipo" });
  const equipoLleno = fields.length >= MAX_EQUIPO;
  // Un error del array completo (p. ej. "al menos un Pokémon") llega en .root o en el propio campo
  const errorDelEquipo = errors.equipo?.root ?? (errors.equipo?.message ? errors.equipo : null);

  return (
    <fieldset className="equipo">
      <legend>
        Tu equipo <span className="contador">{fields.length}/{MAX_EQUIPO}</span>
      </legend>

      {/* Sugerencias de especies (de la PokeAPI); solo ayuda a escribir, no valida */}
      <datalist id={ID_DATALIST}>
        {especies.map((especie) => (
          <option key={especie} value={especie} />
        ))}
      </datalist>

      <ol className="filas-equipo">
        {fields.map((field, i) => {
          const errorFila = errors.equipo?.[i];
          return (
            // field.id lo genera useFieldArray: es la key estable (el índice cambiaría al borrar)
            <li key={field.id} className="fila-equipo">
              <Campo id={`equipo-${i}-especie`} etiqueta={`Pokémon ${i + 1}`} error={errorFila?.especie}>
                <input
                  {...propsAccesibles(`equipo-${i}-especie`, errorFila?.especie)}
                  list={ID_DATALIST}
                  placeholder="pikachu"
                  autoComplete="off"
                  {...register(`equipo.${i}.especie`)}
                />
              </Campo>
              <Campo id={`equipo-${i}-mote`} etiqueta="Mote (opcional)" error={errorFila?.mote}>
                <input
                  {...propsAccesibles(`equipo-${i}-mote`, errorFila?.mote)}
                  placeholder="Chispitas"
                  {...register(`equipo.${i}.mote`)}
                />
              </Campo>
              <Campo id={`equipo-${i}-nivel`} etiqueta="Nivel" error={errorFila?.nivel}>
                <input
                  {...propsAccesibles(`equipo-${i}-nivel`, errorFila?.nivel)}
                  type="number"
                  inputMode="numeric"
                  // valueAsNumber: RHF entrega un número (o NaN si está vacío) y Zod lo valida como number
                  {...register(`equipo.${i}.nivel`, { valueAsNumber: true })}
                />
              </Campo>
              <button
                type="button"
                className="boton-quitar"
                onClick={() => remove(i)}
                disabled={fields.length === 1}
                aria-label={`Quitar el Pokémon ${i + 1}`}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ol>

      {errorDelEquipo && (
        <p className="error-campo" role="alert">
          {errorDelEquipo.message}
        </p>
      )}

      <button
        type="button"
        className="boton-secundario"
        onClick={() => append({ especie: "", mote: "", nivel: 5 }, { shouldFocus: true })}
        disabled={equipoLleno}
      >
        {equipoLleno ? "Equipo completo" : "+ Añadir Pokémon"}
      </button>
    </fieldset>
  );
}
