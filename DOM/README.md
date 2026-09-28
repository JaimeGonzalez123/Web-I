# ✊✋✌️ Piedra, papel o tijera — El Despertar del DOM

En esta carpeta está mi versión del clásico **piedra, papel o tijera** contra la máquina. La hice con HTML, CSS y JavaScript puro para practicar la manipulación del DOM: seleccionar elementos, cambiar su contenido y su estilo, crear y borrar nodos y responder a eventos. No uso ningún framework ni librería.

## ¿Qué hace el juego?

- Eliges una jugada pulsando uno de los tres botones: **Piedra**, **Papel** o **Tijera**.
- La máquina elige una jugada al azar.
- Se muestran las dos jugadas con emojis, una frente a la otra ("Tú VS Máquina").
- Aparece un mensaje con el resultado de la ronda, en un color distinto según el caso:
  - 🟢 verde si ganas,
  - 🟠 naranja si gana la máquina,
  - 🟡 amarillo si hay empate.
- El **marcador** suma un punto al ganador de cada ronda.
- Un **historial** guarda las **últimas 5 rondas**, con la más reciente arriba.
- El botón **Reiniciar marcador** aparece después de la primera ronda y deja todo como al principio.

## Archivos

```
DOM/
├── indexDOM.html   # Estructura de la página
├── styleDOM.css    # Estilos y diseño
├── scriptDOM.js    # Lógica del juego y manipulación del DOM
└── README.md       # Este archivo
```

### `indexDOM.html`

Es la estructura de la página. Todo va dentro de un `<main class="tarjeta">`:

| Elemento | Para qué sirve |
|---|---|
| `.opciones` con tres `.btn-opcion` | Los botones del jugador. Cada uno tiene un atributo `data-opcion` (`piedra`, `papel` o `tijera`) que indica qué jugada representa. |
| `#jugada-jugador` y `#jugada-maquina` | Muestran el emoji de cada jugada. Al principio tienen un ❓. |
| `#mensaje` | El texto con el resultado de la ronda. |
| `#puntos-jugador` y `#puntos-maquina` | Los puntos de cada uno. |
| `#historial` | Una lista `<ul>`, vacía al principio, que se va llenando desde JavaScript. |
| `#btn-reiniciar` | Empieza con la clase `oculto`, así que no se ve hasta que se juega la primera ronda. |

El script se carga con `<script type="module">`. Así el código funciona en *strict mode* y sus variables no se convierten en globales de la página. Además, un módulo se ejecuta cuando el HTML ya está cargado, por lo que el script siempre encuentra los elementos.

En el HTML no hay ningún `onclick`: todos los eventos se asignan desde JavaScript.

### `styleDOM.css`

- La página tiene un fondo oscuro y la tarjeta queda centrada en la pantalla con **flexbox** (`display: flex`, `align-items` y `justify-content` en el `body`).
- La tarjeta tiene esquinas redondeadas y sombra, y su ancho máximo es de `420px` para que también se vea bien en el móvil.
- Los tres botones se reparten el espacio a partes iguales con `flex: 1` y cambian de color al pasar el ratón por encima (`:hover`).
- La zona "Tú VS Máquina" y el marcador también se colocan con flexbox.
- La clase `.oculto` (`display: none`) sirve para mostrar u ocultar el botón de reiniciar desde JavaScript.
- Las rondas del historial están separadas por una línea fina.

### `scriptDOM.js`

El código está dividido en cuatro partes:

**1. Selección de elementos**

Al principio guardo en constantes todos los elementos que voy a usar. Uso `querySelectorAll('.btn-opcion')` para los tres botones y `getElementById` para el resto. Así no tengo que buscarlos en el DOM cada vez que los necesito.

**2. Datos y estado**

- `EMOJIS` es un objeto que relaciona cada jugada con su emoji.
- `OPCIONES` es el array con las tres jugadas posibles.
- `MAX_RONDAS_HISTORIAL = 5` es el número de rondas que se guardan en el historial.
- `puntosJugador` y `puntosMaquina` son las variables `let` que llevan la cuenta de los puntos.

**3. Funciones**

| Función | Qué hace |
|---|---|
| `elegirJugadaMaquina()` | Genera un índice aleatorio con `Math.random()` y `Math.floor()` y devuelve la jugada que ocupa esa posición en `OPCIONES`. |
| `gana(a, b)` | Devuelve `true` si la jugada `a` le gana a la `b`: piedra gana a tijera, papel gana a piedra y tijera gana a papel. |
| `jugarRonda(opcionJugador)` | Es la función principal. Pide la jugada de la máquina, muestra los dos emojis, decide si hay empate, victoria o derrota, suma el punto y actualiza el marcador y el historial. |
| `mostrarMensaje(texto, color)` | Cambia el texto del mensaje con `textContent` y su color con `style.color`. |
| `actualizarMarcador()` | Escribe los puntos en la página y quita la clase `oculto` del botón de reiniciar para que aparezca. |
| `anadirAlHistorial(...)` | Crea un `<li>` con `createElement`, le pone el texto de la ronda (por ejemplo `✊ vs ✌️ · Ganas`) y lo coloca el primero de la lista con `prepend`. Si hay más de 5 rondas, borra la más antigua con `lastElementChild.remove()`. |
| `reiniciarMarcador()` | Pone los puntos a cero, vuelve a mostrar los ❓ y el mensaje inicial, vacía el historial con `replaceChildren()` y vuelve a ocultar el botón de reiniciar. |

**4. Eventos**

- Recorro los tres botones con `forEach` y a cada uno le añado un `addEventListener('click', ...)`. Al pulsar un botón, leo su jugada con `boton.dataset.opcion` y se la paso a `jugarRonda`. Así me basta con un solo código para los tres botones.
- El botón de reiniciar llama a `reiniciarMarcador` al pulsarlo.

## Conceptos del DOM que he practicado

- **Seleccionar nodos:** `getElementById` y `querySelectorAll`.
- **Modificar nodos:** `textContent`, `style.color` y `classList.add` / `classList.remove`.
- **Leer atributos `data-*`:** `dataset`.
- **Crear y borrar nodos:** `createElement`, `prepend`, `remove` y `replaceChildren`.
- **Eventos:** `addEventListener`, sin manejadores escritos en el HTML.

## Cómo ejecutarlo

El script se carga como módulo (`type="module"`) y los navegadores no dejan cargar módulos si abres el archivo con doble clic (`file://`). Por eso hay que abrirlo desde un servidor local:

- **Con Live Server (VS Code):** clic derecho en `indexDOM.html` → *Open with Live Server*.
- **Con Node:** desde la carpeta del proyecto ejecuta `npx serve .` y abre `DOM/indexDOM.html` en el navegador.

## Autor

Jaime González ([@JaimeGonzalez123](https://github.com/JaimeGonzalez123))
