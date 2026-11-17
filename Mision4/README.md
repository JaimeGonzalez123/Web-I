# M4 · Full Contact Forms — Torneo de la Liga Pokémon

> «Valida o muere.» Misión 4 de Programación Web I (U-tad, 2026-27).

App React para **inscribirse en un torneo Pokémon** y ver la **lista de participantes**.
El formulario usa **React Hook Form + Zod** y los datos remotos van con **TanStack Query v5**
contra un API REST local (json-server).

## Qué hace

- **Formulario de inscripción** no controlado (React Hook Form): alias, nombre, correo, fecha de
  nacimiento, región, categoría, equipo de 1 a 6 Pokémon (lista dinámica con `useFieldArray`),
  lema opcional con contador y aceptación de las normas.
- **Validación con un único esquema Zod** (`src/schemas/inscripcion.js`), conectado con `zodResolver`.
  Además de las reglas por campo, tiene **reglas del torneo que cruzan campos**:
  - categoría *junior* solo hasta 15 años el día del torneo;
  - en *junior*, ningún Pokémon por encima del nivel 50;
  - **cláusula de especies**: no se puede repetir especie (el error sale en la fila repetida);
  - la especie tiene que existir en la Pokédex (lista cargada de la PokeAPI).
- **Listado de participantes** con `useQuery`, filtro por región (lo filtra el servidor) y botón
  **Dar de baja** (`useMutation` + DELETE).
- **Inscribir** con `useMutation` + POST; al terminar se **invalida** la caché y el listado se recarga solo.
- **Estados para el usuario**: esqueleto de carga, «actualizando…» en segundo plano, error con
  botón *Reintentar*, lista vacía, «Inscribiendo…» / «Dando de baja…», aviso de éxito y resumen de errores.
- **Accesibilidad**: cada error está enlazado a su campo con `aria-invalid` + `aria-describedby`,
  se anuncia con `role="alert"` y, al enviar, el foco salta al primer campo con error.
- **Reto bonus**: la respuesta del API también se valida con `safeParse`. `db.json` trae a propósito
  un registro corrupto (`MissingNo`: nombre vacío, correo mal formado, región inexistente, nivel 255,
  fecha inválida). La app **no se rompe**: lo aparta y lo enseña en el panel
  «⚠ 1 registro descartado por datos corruptos del servidor» con el motivo de cada fallo.

## Cómo arrancarlo

Requisitos: Node.js 22 o superior.

```bash
npm install
npm run api   # terminal 1: API REST falso en http://localhost:3001 (json-server, con 600 ms de retardo)
npm run dev   # terminal 2: la app en http://localhost:5173
```

Otros scripts: `npm run lint` (ESLint con las reglas de hooks) y `npm run build`.

> json-server **escribe en `db.json`** cuando inscribes o das de baja. Para volver a los datos de
> ejemplo: `git checkout db.json`.
> La URL del API se puede cambiar con la variable `VITE_API_URL`.

Pruebas rápidas para ver cada cosa:

| Qué probar | Cómo |
|---|---|
| Errores por campo | Pulsa *Inscribirme* con el formulario vacío |
| Reglas cruzadas | Categoría junior con fecha de 2004, o un Pokémon a nivel 60, o la misma especie dos veces |
| Error del servidor en un campo | Inscríbete con el alias `Rojo_Meseta` (ya existe) |
| Invalidación | Inscribe a alguien: aparece arriba de la lista sin recargar |
| Error de red | Para `npm run api` y recarga: sale el error con *Reintentar* |
| Bonus `safeParse` | Abre el panel de registros descartados, debajo de la lista |

## Estructura

```
src/
├── main.jsx                  QueryClient (caché compartida) + devtools de TanStack Query
├── App.jsx                   Disposición: formulario | participantes
├── schemas/
│   ├── inscripcion.js        Esquema Zod del formulario (única fuente de verdad) + reglas del torneo
│   └── entrenador.js         Esquema Zod de la RESPUESTA del API (bonus safeParse)
├── api/
│   ├── cliente.js            fetch con control de errores (ok, red) y ErrorDeCampo
│   ├── entrenadores.js       GET / POST / DELETE de /entrenadores
│   └── pokedex.js            Lista de especies de la PokeAPI
├── hooks/
│   └── consultas.js          Claves de query + useEntrenadores, usePokedex, useInscribir, useDarDeBaja
├── lib/
│   └── accesibilidad.js      aria-invalid / aria-describedby de cada campo
└── components/
    ├── FormularioInscripcion.jsx   useForm + zodResolver + mutación
    ├── CamposEquipo.jsx            useFieldArray (1-6 Pokémon)
    ├── Campo.jsx                   Etiqueta + control + ayuda + error
    ├── ListaEntrenadores.jsx       useQuery + filtro + estados
    ├── TarjetaEntrenador.jsx       Un participante
    ├── RegistrosDescartados.jsx    Datos corruptos que atrapó safeParse
    └── Aviso.jsx                   Mensajes de éxito / error
```

## Decisiones

- **Claves de query jerárquicas** (`hooks/consultas.js`): `['entrenadores']` es el prefijo y cada
  lista filtrada es `['entrenadores', 'lista', { region }]`. Así cada región tiene su propia caché y
  **una sola** `invalidateQueries({ queryKey: ['entrenadores'] })` deja obsoletas todas a la vez.
- **El `onSuccess` de la mutación devuelve la promesa de `invalidateQueries`**: la mutación sigue
  «pendiente» hasta que el listado ya está recargado, así que el botón no vuelve a «Inscribirme»
  antes de que el nuevo participante aparezca.
- **Errores del servidor dentro del formulario**: si el alias ya existe, la API lanza un `ErrorDeCampo` y
  el formulario lo coloca con `setError('alias', …)`, como si fuera un error más de validación.
- **`mode: 'onTouched'`**: valida al salir de cada campo y luego mientras se corrige; no marca errores
  mientras escribes por primera vez.
- **`noValidate` en el `<form>`**: sin burbujas del navegador; toda la validación es de Zod.
- **`valueAsNumber` en el nivel**: React Hook Form entrega un número (NaN si está vacío) y Zod lo valida
  como `number` con su propio mensaje.
- **`placeholderData: (anterior) => anterior`** al cambiar de filtro: se sigue viendo la lista anterior
  (atenuada) mientras llega la nueva, en vez de un esqueleto en cada cambio.
- **La Pokédex con `staleTime: Infinity`**: la lista de especies no cambia en la sesión, se pide una vez.

## Uso de IA

- **Herramienta**: Claude Code (modelo Claude Opus 5.5) en el escritorio de Windows.
- **Qué hizo la IA**: propuso el dominio (torneo Pokémon, siguiendo la M2 y la M3) y la estructura, y
  el `db.json` con el registro corrupto y el borrador de este README.
- **Prompts reales**:
  1. «vamos a hacer la mision 4 de web» (y le pasé el PDF del enunciado de la Arena).
- **Cómo se verificó**: `npm run lint` sin errores y `npm run build` correcto; pruebas en el navegador
  de todos los casos de la tabla de arriba (formulario vacío, reglas cruzadas, alias repetido,
  inscripción e invalidación, baja, filtro, API apagado y *Reintentar*, panel de descartados y vista
  móvil). Las reglas del esquema también se probaron sueltas en Node con `safeParse`.
- **Qué revisé o escribí yo**: gran parte de codigo y las ideas.
## Autopsia

1. **El esquema depende de datos remotos (la Pokédex).** `crearEsquemaInscripcion(pokedex)` es una
   función que crea el esquema con el `Set` de especies; se rehace con `useMemo` cuando llega la
   Pokédex y, mientras no ha llegado (o si falla), no comprueba la especie. Así **una sola** pieza
   valida todo, incluida esa regla.
   *Alternativa descartada*: un esquema fijo (constante) y comprobar la especie aparte, en el
   `onSubmit` o con un `validate` de React Hook Form. Habría sido más simple, pero rompía la idea de
   «Zod como única fuente de verdad», con reglas repartidas en dos sitios.

2. **El alias único se comprueba con un GET justo antes del POST**, dentro del `mutationFn`. json-server
   no tiene restricciones de unicidad, así que es la forma de no duplicar alias. El fallo vuelve
   al campo con `setError`.
   *Alternativas descartadas*: (a) un `refine` asíncrono en Zod, que llamaría al API en cada validación
   (cada vez que sales del campo) y metería red dentro del esquema; (b) no comprobarlo. El punto
   débil que sigue habiendo: entre el GET y el POST otro usuario podría coger el mismo alias (condición
   de carrera). En un backend de verdad la unicidad la garantiza la base de datos.

*Otra decisión discutible*: las reglas que cruzan campos van en un `superRefine` con
`when: () => true`. Por defecto Zod v4 no ejecuta los refinamientos del objeto si algún campo ya
tiene error, y el usuario descubriría «junior hasta 15 años» solo al final. Con `when` se ven a la vez,
a cambio de escribir la función con cuidado, porque recibe datos aún sin validar.
