# Web-I · M1 El Despertar del DOM ⚔️

Mini-juego de **Piedra, papel o tijera** contra la máquina, hecho con HTML, CSS y JavaScript puro. Todo el DOM se manipula a mano, sin frameworks ni librerías.

## Descripción

El jugador elige piedra, papel o tijera y la máquina responde con una jugada aleatoria. La página muestra las dos jugadas, el resultado de la ronda, el marcador acumulado y un historial con las últimas 5 rondas. Un botón permite reiniciar la partida.

## Cómo jugar

1. Pulsa uno de los tres botones: ✊ Piedra, ✋ Papel o ✌️ Tijera.
2. Mira la jugada de la máquina y el resultado de la ronda.
3. El marcador y el historial se actualizan solos.
4. Pulsa **Reiniciar marcador** para empezar de cero.

## Cómo ejecutarlo

Como el script se carga con `type="module"`, hay que abrir la página desde un servidor local (no con doble clic en el archivo):

- Con la extensión **Live Server** de VS Code: clic derecho en `DOM/indexDOM.html` → *Open with Live Server*.
- O desde la carpeta del proyecto: `npx serve .` y abrir `DOM/indexDOM.html`.

## Tecnologías

- HTML5
- CSS3 (flexbox)
- JavaScript (ES6+, módulos). Sin React, sin jQuery y sin otras librerías.

## Estructura del proyecto

```
Web-I/
├── DOM/
│   ├── indexDOM.html   # Estructura de la página
│   ├── styleDOM.css    # Estilos
│   └── scriptDOM.js    # Lógica del juego y manipulación del DOM
├── Mision1/            # Ejercicio anterior (El oráculo de los números)
├── .gitignore
└── README.md
```

## Uso del DOM

- **Selección de nodos:** `getElementById` y `querySelectorAll`.
- **Modificación de nodos:** `textContent`, `style.color` y `classList.add` / `classList.remove`.
- **Creación y borrado de nodos:** `createElement`, `prepend`, `remove` y `replaceChildren` para el historial.
- **Eventos:** `addEventListener` desde el JS, sin *handlers* inline en el HTML. Cada botón guarda su jugada en un atributo `data-opcion`, que se lee con `dataset`.

## Autor

Jaime González ([@JaimeGonzalez123](https://github.com/JaimeGonzalez123))
