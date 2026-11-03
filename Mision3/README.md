# Web-I · M3 Reactor Core — PokéOdisea en React ⚛️

> «Todo es un componente.» — hasta una Pokéball.

Reconstrucción en **React 19** de la PokéOdisea de la M2. Eliges un tipo (Fuego, Agua, Dragón…) y la app trae los primeros 12 Pokémon de ese tipo desde la [PokeAPI](https://pokeapi.co), con sus estadísticas y un resumen del tipo. La novedad es **Mi equipo**: puedes elegir hasta 6 Pokémon de cualquier tipo, ver la suma y la media de su fuerza y qué tipos cubre tu equipo. El equipo se guarda entre visitas.

La UI reacciona al estado: ningún componente toca el DOM a mano.

## Funcionalidades

- Selector con todos los tipos de la PokeAPI, traducidos al español.
- Tarjetas con imagen, tipos, altura, peso y barras de estadísticas base.
- Búsqueda por nombre y ordenación (nº de Pokédex, fuerza, nombre o peso) sin repetir peticiones.
- Resumen del tipo: campeón, media, el más pesado y con qué tipos se combina.
- Estados visibles: cargando (Pokéball), error con *Reintentar* y vacío (tipo sin Pokémon o búsqueda sin resultados).
- **Mi equipo** (originalidad): hasta 6 Pokémon de tipos distintos, suma y media de estadísticas, y **cobertura de tipos** (qué tipos de los 18 tiene tu equipo, en color, y cuáles le faltan, en gris). Se guarda en `localStorage`.
- Caché en `localStorage` de 24 h para los tipos y los Pokémon (de la M2), con botón *Vaciar caché*.
- ★ **Bonus**: dos custom hooks reutilizables, `useFetch` y `useLocalStorage`.

## Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
cd Mision3
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

Otros scripts:

- `npm run build`: genera la versión de producción en `dist/`.
- `npm run preview`: sirve localmente la versión de `dist/`.
- `npm run lint`: ESLint con `eslint-plugin-react-hooks` (reglas de los hooks y dependencias de los efectos).

## Tecnologías

- **React 19** (componentes de función, hooks y `StrictMode`).
- **Vite 7** con `@vitejs/plugin-react`.
- JavaScript moderno (ES2024+): `toSorted`, `Object.groupBy`, `?.`, `??`, `AbortController`.
- **PokeAPI** como API pública (no necesita clave).
- ESLint 9 con las reglas de los hooks.

## Estructura

```
Mision3/
├── index.html                  # Solo el <div id="root">; React pinta el resto
├── src/
│   ├── main.jsx                # createRoot + StrictMode
│   ├── App.jsx                 # Componente raíz: estado mínimo y manejadores
│   ├── index.css               # Estilos (los de la M2 + Mi equipo)
│   ├── components/
│   │   ├── Cabecera.jsx        # Cabecera tipo Pokédex
│   │   ├── Controles.jsx       # Tipo, búsqueda, orden y vaciar caché (inputs controlados)
│   │   ├── MiEquipo.jsx        # Panel del equipo y cobertura de tipos
│   │   ├── Resultados.jsx      # Decide qué estado mostrar y deriva la lista visible
│   │   ├── Resumen.jsx         # Resumen del tipo (con el subcomponente Dato)
│   │   ├── RejillaPokemon.jsx  # Lista de tarjetas con key estable
│   │   ├── TarjetaPokemon.jsx  # Una tarjeta
│   │   ├── BarraStat.jsx       # Una barra de estadística
│   │   ├── ChipTipo.jsx        # Etiqueta de color de un tipo
│   │   └── EstadoCarga.jsx     # Cargando, ErrorCarga y Vacio
│   ├── hooks/
│   │   ├── useFetch.js         # Bonus: carga asíncrona con cancelación y reintento
│   │   └── useLocalStorage.js  # Bonus: useState que persiste en localStorage
│   └── lib/                    # Sin React: se reutiliza de la M2
│       ├── api.js              # fetch + response.ok + ErrorApi (ahora con AbortSignal)
│       ├── cache.js            # Caché en localStorage con caducidad
│       ├── logica.js           # Funciones puras: normalizar, filtrar, ordenar, resumir, equipo
│       └── pokedex.js          # Cargas completas: tipos y Pokémon de un tipo (allSettled)
├── eslint.config.js
├── vite.config.js
└── package.json
```

## Cómo se cumple la rúbrica

| Criterio | Cómo | Dónde |
|---|---|---|
| **Componentización** | 13 componentes pequeños, cada uno con una responsabilidad. Las tarjetas, la rejilla, los estados y el resumen solo reciben props; el único componente con estado propio es `App`. | `src/components/` |
| **Gestión de estado** | Estado mínimo en `App`: `tipo`, `busqueda`, `orden`, `equipo` y `aviso`. La lista visible, el resumen, los ids del equipo, si está lleno y la cobertura se **derivan** en el render. El equipo se **levanta** a `App` porque lo usan dos ramas distintas: las tarjetas (botón ★) y el panel Mi equipo. Actualizaciones inmutables (`filter`, `[...equipo, p]`) y con función actualizadora. | `App.jsx`, `lib/logica.js` (`alternarMiembro`, `resumirEquipo`) |
| **Efectos** | Solo 3 efectos, todos para sincronizar con algo externo: la red (`useFetch`, con limpieza que **aborta** la petición), `localStorage` (`useLocalStorage`) y un temporizador (aviso de caché, con `clearTimeout` en la limpieza). Las dependencias están completas y las comprueba `eslint-plugin-react-hooks`. Responder a una acción del usuario (cambiar de tipo, añadir al equipo) va en el manejador, no en un efecto. | `hooks/`, `App.jsx` |
| **Listas y condicionales** | Keys estables (`p.id`, el nombre del tipo o de la estadística), nunca el índice. Condicionales con retornos tempranos en `Resultados` y `&&` solo con booleanos (`fallidos > 0 && …`, `equipo.length > 0 && …`). Eventos con funciones flecha (`onClick={() => onAlternarEquipo(pokemon)}`). | `Resultados.jsx`, `RejillaPokemon.jsx`, `TarjetaPokemon.jsx` |
| **Originalidad** | Mi equipo con cobertura de tipos, que se conserva al cambiar de tipo y al recargar. | `MiEquipo.jsx` |
| **Bonus** | `useFetch(cargar)` devuelve `{ estado, datos, error, reintentar }` y se usa para dos cargas distintas (tipos y Pokémon de un tipo). `useLocalStorage(clave, inicial)` se usa para el equipo. | `src/hooks/` |

### Qué cambia respecto a la M2

- `render.js`, que pintaba con `innerHTML`, desaparece: ahora son componentes JSX y React escapa los textos, así que no hay riesgo de XSS con los nombres.
- El contador `cargaActual` que evitaba que una respuesta vieja pisara a la nueva se sustituye por la limpieza del efecto con `AbortController`: al cambiar de tipo, la petición anterior se cancela de verdad.
- Las opciones de orden pasan de estar escritas en `index.html` a una lista en `logica.js` (`CRITERIOS_ORDEN`).

## Declaración de uso de IA

He usado **Claude (Anthropic)** con Claude Code. Le pasé el enunciado de la M3, la rúbrica, la diapositiva de «Buenas prácticas y errores comunes» de la U3 y el código de mi M2, y le pedí que me ayudara a reinventar la mision dos para hacerlo con react.

Prompts reales (resumidos):

1. «Reconstruye (o reinventa) tu app de la misión anterior en React 19: componentes, props, estado y efectos» (el enunciado completo de la M3, con la rúbrica y el bonus).


Qué hizo la IA: la descomposición en componentes, los dos hooks, la adaptación de `api.js` para cancelar peticiones, Mi equipo y este README. Reutilizó `logica.js` y `cache.js` de mi M2.

Cómo lo he verificado:

- `npm run lint` sin errores (incluye las reglas de los hooks) y `npm run build` correcto.
- Probado en el navegador:
  - carga de tipos;
  - búsqueda sin resultados;
  - error sin conexión y *Reintentar*;
  - cambio rápido de tipo (solo se muestra el último);
  - límite de 6 en el equipo;
  - el equipo se mantiene al recargar;
  - vista de móvil.
- [Completar: qué partes has revisado tú y qué has cambiado o entendido de forma distinta.]

## Autopsia

Dos decisiones discutibles y la alternativa que descarté:

1. **`useFetch` deriva el estado «cargando» en vez de guardarlo.** El hook guarda el último resultado junto a la petición que lo produjo. Si no coincide con la petición actual, está cargando. Así no se llama a `setState` al empezar el efecto. **Descartado:** un `useState("cargando")` que se pone al principio del efecto. Es más fácil de leer, pero duplica estado y provoca un render extra. También descarté `use()` + `<Suspense>` de React 19: obliga a crear y cachear la promesa fuera del render, y el reintento y la cancelación son más difíciles de explicar.
2. **El equipo guarda los Pokémon completos en `localStorage`, no solo sus ids.** Así el panel se pinta al instante al recargar, aunque esos Pokémon sean de otro tipo distinto al que se está viendo. **Descartado:** guardar solo los ids y volver a pedirlos. Ocupa menos, pero haría 6 peticiones más en cada visita y necesitaría otro estado de carga para el panel.
3. **Props en lugar de Context.** Los datos del equipo bajan tres niveles (`App` → `Resultados` → `RejillaPokemon` → `TarjetaPokemon`) y en cada uno se ve qué prop llega. **Descartado:** `useContext`, que tendría sentido si el equipo hiciera falta en muchos componentes lejanos. Aquí esconde de dónde vienen los datos.

## Autor

Jaime González ([@JaimeGonzalez123](https://github.com/JaimeGonzalez123))
