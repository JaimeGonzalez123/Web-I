// Mensaje de estado para el usuario. Los errores usan role="alert" (se anuncian al momento);
// el resto, role="status" (se anuncian sin interrumpir).
export default function Aviso({ tipo = "info", titulo, children, accion }) {
  return (
    <div className={`aviso aviso-${tipo}`} role={tipo === "error" ? "alert" : "status"}>
      <div>
        {titulo && <strong>{titulo}</strong>}
        {children && <div>{children}</div>}
      </div>
      {accion}
    </div>
  );
}
