// Los tres estados de una carga, cada uno como componente pequeño.

export function Cargando({ mensaje }) {
  return (
    <div className="estado cargando" role="status">
      <span className="pokeball" aria-hidden="true" />
      <p>{mensaje}</p>
    </div>
  );
}

export function ErrorCarga({ mensaje, onReintentar }) {
  return (
    <div className="estado error" role="alert">
      <p className="icono" aria-hidden="true">💥</p>
      <p>{mensaje}</p>
      <button type="button" className="boton" onClick={onReintentar}>Reintentar</button>
    </div>
  );
}

export function Vacio({ mensaje, icono = "🔍" }) {
  return (
    <div className="estado vacio" role="status">
      <p className="icono" aria-hidden="true">{icono}</p>
      <p>{mensaje}</p>
    </div>
  );
}
