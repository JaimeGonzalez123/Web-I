// useFetch — BONUS: custom hook reutilizable para cualquier carga asíncrona.
//
// Recibe una función `cargar(signal)` que devuelve una promesa (o null para no cargar nada)
// y devuelve { estado, datos, error, reintentar }, con estado:
// "inactivo" | "cargando" | "error" | "listo".
//
// Decisiones:
// - El estado "cargando" NO se guarda: se deriva. Si el último resultado no corresponde
//   a la petición actual (otra función `cargar` u otro intento), es que estamos cargando.
//   Así no hay que llamar a setState al empezar el efecto.
// - La limpieza del efecto aborta la petición anterior. Si el usuario cambia de tipo
//   antes de que termine una carga, la respuesta vieja nunca pisa a la nueva
//   (en la M2 esto se hacía a mano con el contador `cargaActual`).
// - `cargar` debe ser estable entre renders (definida fuera del componente o con useCallback);
//   si no, el efecto se repetiría en cada render.

import { useCallback, useEffect, useState } from "react";

export function useFetch(cargar) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState({ cargar: null, intento: -1, datos: null, error: null });

  useEffect(() => {
    if (!cargar) return;
    const control = new AbortController();

    cargar(control.signal)
      .then((datos) => {
        if (!control.signal.aborted) setResultado({ cargar, intento, datos, error: null });
      })
      .catch((error) => {
        if (!control.signal.aborted) setResultado({ cargar, intento, datos: null, error });
      });

    return () => control.abort();
  }, [cargar, intento]);

  // Volver a lanzar la misma carga (botón "Reintentar")
  const reintentar = useCallback(() => setIntento((i) => i + 1), []);

  if (!cargar) return { estado: "inactivo", datos: null, error: null, reintentar };

  const esDeEstaPeticion = resultado.cargar === cargar && resultado.intento === intento;
  if (!esDeEstaPeticion) return { estado: "cargando", datos: null, error: null, reintentar };

  return {
    estado: resultado.error ? "error" : "listo",
    datos: resultado.datos,
    error: resultado.error,
    reintentar,
  };
}
