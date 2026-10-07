# Web-I · M2 Async Odyssey — PokéOdisea 🧭

> «El event loop no espera a nadie.» — ni los Pokémon tampoco.

Aplicación hecha con **Vite** y JavaScript puro que consume la [PokeAPI](https://pokeapi.co) con `fetch` + `async/await`. Eliges un tipo (Fuego, Agua, Dragón…) y la PokéOdisea trae los primeros 12 Pokémon de ese tipo, con sus estadísticas, y calcula un resumen del "equipo": el campeón, la media de estadísticas, el más pesado y con qué otros tipos se combina.

## Funcionalidades

- Selector con todos los tipos de la PokeAPI (traducidos al español).
- Tarjetas con imagen, tipos, altura, peso y barras de estadísticas base.
- Búsqueda por nombre y ordenación (nº de Pokédex, fuerza, nombre o peso) sin repetir peticiones.
- Resumen del tipo calculado con `reduce` y `Object.groupBy`.
- **Estados visibles**: cargando (Pokéball animada), error con botón *Reintentar*, y vacío (tipos sin Pokémon como *Astral* o búsquedas sin resultados).
- ★ **Bonus — caché en `localStorage`**: cada tipo y cada Pokémon se guardan (ya transformados) durante 24 h. El resumen indica cuántos Pokémon vienen de la caché y cuántos de la red. El botón *Vaciar caché* la borra.

## Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
cd Mision2
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

Otros scripts:

- `npm run build` — genera la versión de producción en `dist/`.
- `npm run preview` — sirve localmente la versión de `dist/`.

## Tecnologías

- HTML5 y CSS3 (grid, flexbox, variables CSS, animaciones).
- JavaScript moderno (ES2024+) con **módulos ES**. Sin frameworks ni librerías.
- **Vite** como servidor de desarrollo y empaquetador.
- **PokeAPI** como API pública (no necesita clave).

## Estructura

```
Mision2/
├── index.html          # Estructura de la página; carga src/main.js como módulo
├── package.json        # Scripts dev/build/preview y dependencia de Vite
├── .gitignore          # node_modules/ y dist/
└── src/
    ├── api.js          # Red: fetch + async/await, comprueba response.ok, clase ErrorApi
    ├── cache.js        # Bonus: caché en localStorage con JSON.stringify/parse y caducidad
    ├── logica.js       # Funciones puras: normalizar, filtrar, ordenar y resumir (map/filter/reduce)
    ├── render.js       # DOM: estados de carga/error/vacío y pintado de tarjetas y resumen
    ├── main.js         # Punto de entrada: conecta los módulos y gestiona los eventos
    └── style.css       # Estilos (estética de Pokédex, colores por tipo)
```

Cada módulo tiene una sola responsabilidad: `api.js` no sabe nada del DOM, `logica.js` no hace peticiones ni toca el DOM, y `render.js` solo pinta lo que recibe.

## Cómo se cumplen los requisitos

| Requisito | Dónde |
|---|---|
| `fetch` con `async/await`, `try/catch` y `response.ok` | `src/api.js` (`pedirJSON`) |
| Estados de carga y error visibles | `src/render.js` (`mostrarCargando`, `mostrarError`, `mostrarVacio`) |
| Peticiones independientes en paralelo | `src/main.js` → `Promise.allSettled` (si falla un Pokémon, los demás se muestran igual y se avisa) |
| `map` / `filter` / `reduce` | `src/logica.js` (normalización, filtrado, total de stats, campeón, media) |
| Métodos inmutables | `toSorted` para ordenar sin mutar, `Object.groupBy` + `Object.entries` para agrupar |
| Módulos ES | `import` / `export` entre los cinco ficheros de `src/` |
| Robustez | `?.` y `??` en todos los accesos a la respuesta, arrays no válidos → `[]`, imagen ausente → marcador `?`, JSON corrupto en caché → se ignora, respuestas viejas descartadas si cambias de tipo antes de que terminen |
| Bonus caché | `src/cache.js` (`conCache`, `vaciarCache`) |

## Declaración de uso de IA

En este proyecto he usado **Claude (Anthropic)** como asistente. Le pasé el enunciado de la misión y el temario de la Unidad 2 (JavaScript avanzado) y le pedí que usara solo lo que aparece en ese temario. La IA generó la estructura inicial del proyecto, el código de los módulos, los estilos y este README. Después he revisado el código, lo he probado en el navegador (carga, error sin conexión, tipos vacíos, búsqueda y caché) y entiendo y puedo explicar cada parte: el event loop y por qué las peticiones van en paralelo, por qué `fetch` no rechaza con un 404, y cómo funciona la caché en `localStorage`.

## Autor

Jaime González ([@JaimeGonzalez123](https://github.com/JaimeGonzalez123))
