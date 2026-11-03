const MAXIMO = 180; // una estadística base rara vez pasa de 180

// Una fila de estadística: nombre, barra proporcional y valor
export function BarraStat({ nombre, valor }) {
  const porcentaje = Math.min(100, (valor / MAXIMO) * 100);
  return (
    <li>
      <span className="stat-nombre">{nombre}</span>
      <span className="stat-barra"><span style={{ width: `${porcentaje}%` }} /></span>
      <span className="stat-valor">{valor}</span>
    </li>
  );
}
