import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CATEGORIAS,
  crearEsquemaInscripcion,
  FECHA_TORNEO,
  REGIONES,
  VALORES_INICIALES,
} from "../schemas/inscripcion.js";
import { ErrorDeCampo } from "../api/cliente.js";
import { useInscribir, usePokedex } from "../hooks/consultas.js";
import { propsAccesibles } from "../lib/accesibilidad.js";
import Aviso from "./Aviso.jsx";
import Campo from "./Campo.jsx";
import CamposEquipo from "./CamposEquipo.jsx";

const MAX_LEMA = 80;
const TEXTO_CATEGORIA = {
  junior: "Junior (hasta 15 años, nivel máx. 50)",
  abierta: "Abierta (sin límites)",
};

export default function FormularioInscripcion() {
  const pokedex = usePokedex();
  const inscripcion = useInscribir();

  // El esquema se rehace solo cuando llega la Pokédex: hasta entonces no se comprueba la especie
  const esquema = useMemo(() => crearEsquemaInscripcion(pokedex.data ?? null), [pokedex.data]);
  const especies = useMemo(() => (pokedex.data ? [...pokedex.data] : []), [pokedex.data]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: VALORES_INICIALES,
    // Valida al salir de cada campo y, a partir de ahí, mientras se corrige: no grita mientras escribes
    mode: "onTouched",
  });

  // useWatch solo re-renderiza por este campo (contador de caracteres del lema)
  const lema = useWatch({ control, name: "lema" }) ?? "";

  const enviar = (datos) => {
    // `datos` ya es la SALIDA de Zod: recortada, especies en minúsculas y nivel como número
    inscripcion.mutate(datos, {
      onSuccess: () => reset(VALORES_INICIALES),
      onError: (error) => {
        // Un error de negocio del servidor se coloca en su campo, como uno de validación más
        if (error instanceof ErrorDeCampo) {
          setError(error.campo, { type: "servidor", message: error.message }, { shouldFocus: true });
        }
      },
    });
  };

  const numErrores = Object.keys(errors).length;
  const errorGeneral = inscripcion.isError && !(inscripcion.error instanceof ErrorDeCampo);

  return (
    <section className="tarjeta-panel" aria-labelledby="titulo-formulario">
      <h2 id="titulo-formulario">Inscripción</h2>
      <p className="subtitulo">Torneo de la Liga · {FECHA_TORNEO}</p>

      {inscripcion.isSuccess && (
        <Aviso tipo="exito" titulo={`¡${inscripcion.data.alias} ya está inscrito!`}>
          Aparecerá en la lista de participantes. Puedes inscribir a otro entrenador.
        </Aviso>
      )}
      {errorGeneral && (
        <Aviso tipo="error" titulo="No se ha podido completar la inscripción">
          {inscripcion.error.message}
        </Aviso>
      )}
      {isSubmitted && numErrores > 0 && (
        <Aviso tipo="error" titulo={`Revisa ${numErrores === 1 ? "1 campo" : `${numErrores} campos`}`}>
          Están marcados en rojo; el cursor ya está en el primero.
        </Aviso>
      )}

      {/* noValidate: desactiva las burbujas del navegador; la validación es de Zod */}
      <form onSubmit={handleSubmit(enviar)} noValidate className="formulario">
        <div className="rejilla-2">
          <Campo id="alias" etiqueta="Alias de entrenador" error={errors.alias} ayuda="3-16 caracteres: letras, números y _">
            <input {...propsAccesibles("alias", errors.alias, true)} autoComplete="username" {...register("alias")} />
          </Campo>
          <Campo id="nombre" etiqueta="Nombre" error={errors.nombre}>
            <input {...propsAccesibles("nombre", errors.nombre)} autoComplete="name" {...register("nombre")} />
          </Campo>
          <Campo id="email" etiqueta="Correo electrónico" error={errors.email}>
            <input {...propsAccesibles("email", errors.email)} type="email" autoComplete="email" {...register("email")} />
          </Campo>
          <Campo id="fechaNacimiento" etiqueta="Fecha de nacimiento" error={errors.fechaNacimiento}>
            <input {...propsAccesibles("fechaNacimiento", errors.fechaNacimiento)} type="date" {...register("fechaNacimiento")} />
          </Campo>
          <Campo id="region" etiqueta="Región de origen" error={errors.region}>
            <select {...propsAccesibles("region", errors.region)} {...register("region")}>
              <option value="">Elige una región…</option>
              {REGIONES.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </Campo>

          <fieldset
            className={`campo grupo-radio${errors.categoria ? " con-error" : ""}`}
            aria-describedby={errors.categoria ? "categoria-error" : undefined}
          >
            <legend>Categoría</legend>
            {CATEGORIAS.map((categoria) => (
              <label key={categoria} className="opcion">
                <input type="radio" value={categoria} aria-invalid={errors.categoria ? true : undefined} {...register("categoria")} />
                {TEXTO_CATEGORIA[categoria]}
              </label>
            ))}
            {errors.categoria && (
              <p id="categoria-error" className="error-campo" role="alert">
                {errors.categoria.message}
              </p>
            )}
          </fieldset>
        </div>

        <CamposEquipo control={control} register={register} errors={errors} especies={especies} />
        {pokedex.isPending && <p className="ayuda">Cargando la Pokédex para sugerir especies…</p>}
        {pokedex.isError && (
          <p className="ayuda">No se ha podido cargar la Pokédex: no se comprobará que la especie exista.</p>
        )}

        <Campo
          id="lema"
          etiqueta="Lema de combate (opcional)"
          error={errors.lema}
          extra={
            <span className={`contador${lema.length > MAX_LEMA ? " pasado" : ""}`} aria-live="polite">
              {lema.length}/{MAX_LEMA}
            </span>
          }
        >
          <textarea {...propsAccesibles("lema", errors.lema)} rows={2} {...register("lema")} />
        </Campo>

        <div className={`campo${errors.aceptaNormas ? " con-error" : ""}`}>
          <label className="opcion">
            <input
              type="checkbox"
              {...propsAccesibles("aceptaNormas", errors.aceptaNormas)}
              {...register("aceptaNormas")}
            />
            Acepto las normas del torneo (cláusula de especies incluida)
          </label>
          {errors.aceptaNormas && (
            <p id="aceptaNormas-error" className="error-campo" role="alert">
              {errors.aceptaNormas.message}
            </p>
          )}
        </div>

        <div className="acciones">
          <button type="submit" className="boton-principal" disabled={inscripcion.isPending}>
            {inscripcion.isPending ? "Inscribiendo…" : "Inscribirme"}
          </button>
          <button
            type="button"
            className="boton-secundario"
            onClick={() => {
              reset(VALORES_INICIALES);
              inscripcion.reset();
            }}
            disabled={inscripcion.isPending}
          >
            Vaciar
          </button>
        </div>
      </form>
    </section>
  );
}
