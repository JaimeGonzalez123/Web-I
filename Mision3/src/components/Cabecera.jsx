// Cabecera con las luces de la Pokédex. Sin props: siempre es igual.
export function Cabecera() {
  return (
    <header className="cabecera">
      <div className="luces" aria-hidden="true">
        <span className="luz grande" />
        <span className="luz roja" />
        <span className="luz amarilla" />
        <span className="luz verde" />
      </div>
      <div>
        <h1>PokéOdisea</h1>
        <p className="lema">«Todo es un componente.» — hasta una Pokéball.</p>
      </div>
    </header>
  );
}
