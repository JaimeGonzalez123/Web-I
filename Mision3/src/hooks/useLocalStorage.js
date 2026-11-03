// useLocalStorage — BONUS: como useState, pero el valor sobrevive a recargar la página.
//
// - Lee localStorage UNA sola vez, en el inicializador perezoso de useState
//   (no en cada render).
// - El efecto sincroniza con un sistema externo (localStorage) cada vez que cambia el valor:
//   es justo el caso en el que useEffect está justificado.
// - try/catch: JSON corrupto, modo privado o cuota llena → la app sigue funcionando.

import { useEffect, useState } from "react";

export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave);
      return guardado === null ? valorInicial : JSON.parse(guardado);
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      console.warn(`No se pudo guardar «${clave}» en localStorage:`, error.message);
    }
  }, [clave, valor]);

  return [valor, setValor];
}
