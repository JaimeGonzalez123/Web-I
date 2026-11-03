// App — Componente raíz. Guarda el estado mínimo y lo reparte por props.
//
// Estado (lo único que no se puede calcular):
//   tipo, busqueda, orden → lo que ha elegido el usuario
//   equipo                → sus Pokémon favoritos (persisten con useLocalStorage)
//   aviso                 → mensaje temporal tras vaciar la caché
// Todo lo demás (lista visible, resumen, ids del equipo, cobertura…) se deriva en el render.

import { useCallback, useEffect, useState } from "react";
import { Cabecera } from "./components/Cabecera.jsx";
import { Controles } from "./components/Controles.jsx";
import { MiEquipo } from "./components/MiEquipo.jsx";
import { Resultados } from "./components/Resultados.jsx";
import { Cargando, ErrorCarga, Vacio } from "./components/EstadoCarga.jsx";
import { useFetch } from "./hooks/useFetch.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { cargarTipos, cargarPokemonDeTipo } from "./lib/pokedex.js";
import { vaciarCache } from "./lib/cache.js";
import { alternarMiembro, TAM_EQUIPO } from "./lib/logica.js";

const DURACION_AVISO_MS = 4000;

export default function App() {
  const [tipo, setTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("numero");
  const [equipo, setEquipo] = useLocalStorage("pokeodisea-equipo", []);
  const [aviso, setAviso] = useState("");

  // cargarTipos está definida fuera del componente: es estable y el efecto solo corre al montar
  const tipos = useFetch(cargarTipos);

  // useCallback: la función solo cambia cuando cambia el tipo, y con ella se relanza la carga
  const cargarTipoElegido = useCallback((signal) => cargarPokemonDeTipo(tipo, signal), [tipo]);
  const carga = useFetch(tipo ? cargarTipoElegido : null);

  // Efecto con limpieza: el aviso desaparece solo; si llega otro antes, se cancela el temporizador viejo
  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(""), DURACION_AVISO_MS);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  // Manejadores: la respuesta a una acción del usuario va aquí, no en un efecto
  function cambiarTipo(nuevoTipo) {
    setTipo(nuevoTipo);
    setBusqueda(""); // la búsqueda del tipo anterior no tiene sentido en el nuevo
  }

  function alternarEnEquipo(pokemon) {
    setEquipo((actual) => alternarMiembro(actual, pokemon));
  }

  function borrarCache() {
    const borradas = vaciarCache();
    setAviso(`Caché vaciada (${borradas} entradas). Las próximas cargas irán a la red.`);
  }

  // Valores derivados
  const idsEnEquipo = new Set(equipo.map((p) => p.id));
  const equipoLleno = equipo.length >= TAM_EQUIPO;

  let contenido;
  if (tipos.estado === "cargando") {
    contenido = <Cargando mensaje="Encendiendo la Pokédex…" />;
  } else if (tipos.estado === "error") {
    contenido = <ErrorCarga mensaje={tipos.error.message} onReintentar={tipos.reintentar} />;
  } else if (tipos.datos.length === 0) {
    contenido = <Vacio icono="🫙" mensaje="La PokeAPI no ha devuelto ningún tipo. Prueba más tarde." />;
  } else {
    contenido = (
      <Resultados
        tipo={tipo}
        carga={carga}
        busqueda={busqueda}
        orden={orden}
        idsEnEquipo={idsEnEquipo}
        equipoLleno={equipoLleno}
        onAlternarEquipo={alternarEnEquipo}
      />
    );
  }

  return (
    <>
      <Cabecera />
      <main>
        <Controles
          tipos={tipos.datos ?? []}
          cargandoTipos={tipos.estado === "cargando"}
          tipo={tipo}
          onCambiarTipo={cambiarTipo}
          busqueda={busqueda}
          onCambiarBusqueda={setBusqueda}
          orden={orden}
          onCambiarOrden={setOrden}
          onVaciarCache={borrarCache}
          aviso={aviso}
        />
        <MiEquipo equipo={equipo} onQuitar={alternarEnEquipo} onVaciar={() => setEquipo([])} />
        {contenido}
      </main>
      <footer className="pie">
        Datos de <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">PokeAPI</a> ·
        Web Development I · Misión 3 · React 19
      </footer>
    </>
  );
}
