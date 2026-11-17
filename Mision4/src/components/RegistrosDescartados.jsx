// Reto bonus: registros del API que NO pasaron el safeParse de esquemaEntrenador.
// En vez de romper la lista (o pintar "undefined"), se apartan y se explica por qué.
export default function RegistrosDescartados({ descartados }) {
  if (descartados.length === 0) return null;

  return (
    <details className="descartados">
      <summary>
        ⚠ {descartados.length === 1 ? "1 registro descartado" : `${descartados.length} registros descartados`} por
        datos corruptos del servidor
      </summary>
      <ul>
        {descartados.map(({ dato, problemas }, i) => (
          // Un dato corrupto puede no tener id: se combina con la posición para que la key sea única
          <li key={`${dato?.id ?? "sin-id"}-${i}`}>
            <code>{JSON.stringify(dato?.alias ?? dato?.id ?? "(sin alias)")}</code>
            <ul>
              {problemas.map((problema) => (
                <li key={problema}>{problema}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </details>
  );
}
