import FichaTripulante from "./components/fichaTripulante.jsx";

export default function App() {
  return (
    <section className="tripulacion">
      <FichaTripulante nombre="Ripley" rol="Teniente" especie="humana" />
      <FichaTripulante nombre="Spock" rol="Oficial científico" especie="vulcana" />
      <FichaTripulante nombre="Chewbacca" rol="Copiloto" especie="wookiee" />
      <FichaTripulante nombre="Jaime" rol="Capitán" />
    </section>
  );
}
