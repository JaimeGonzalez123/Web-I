import FormularioInscripcion from "./components/FormularioInscripcion.jsx";
import ListaEntrenadores from "./components/ListaEntrenadores.jsx";

export default function App() {
  return (
    <>
      <header className="cabecera">
        <div className="pokeball" aria-hidden="true" />
        <div>
          <h1>Torneo de la Liga Pokémon</h1>
          <p className="lema-cabecera">Valida o muere: inscripciones abiertas</p>
        </div>
      </header>
      <main className="disposicion">
        <FormularioInscripcion />
        <ListaEntrenadores />
      </main>
    </>
  );
}
