const botonesOpcion = document.querySelectorAll('.btn-opcion');
const jugadaJugadorEl = document.getElementById('jugada-jugador');
const jugadaMaquinaEl = document.getElementById('jugada-maquina');
const mensajeEl = document.getElementById('mensaje');
const puntosJugadorEl = document.getElementById('puntos-jugador');
const puntosMaquinaEl = document.getElementById('puntos-maquina');
const btnReiniciar = document.getElementById('btn-reiniciar');
const historialEl = document.getElementById('historial');

// --- Datos y estado ---
const EMOJIS = {
  piedra: '✊',
  papel: '✋',
  tijera: '✌️',
};

const OPCIONES = ['piedra', 'papel', 'tijera'];
const MAX_RONDAS_HISTORIAL = 5;

let puntosJugador = 0;
let puntosMaquina = 0;

// --- Funciones ---

function elegirJugadaMaquina() {
  const indice = Math.floor(Math.random() * OPCIONES.length);
  return OPCIONES[indice];
}

// true si "a" le gana a "b"
function gana(a, b) {
  return (
    (a === 'piedra' && b === 'tijera') ||
    (a === 'papel' && b === 'piedra') ||
    (a === 'tijera' && b === 'papel')
  );
}

function jugarRonda(opcionJugador) {
  const opcionMaquina = elegirJugadaMaquina();

  jugadaJugadorEl.textContent = EMOJIS[opcionJugador];
  jugadaMaquinaEl.textContent = EMOJIS[opcionMaquina];

  let resultado;
  if (opcionJugador === opcionMaquina) {
    resultado = 'Empate';
    mostrarMensaje('Empate 🤝', '#ffcc66');
  } else if (gana(opcionJugador, opcionMaquina)) {
    puntosJugador++;
    resultado = 'Ganas';
    mostrarMensaje(`¡Ganas esta ronda! ${opcionJugador} vence a ${opcionMaquina} 🎉`, '#7cff9a');
  } else {
    puntosMaquina++;
    resultado = 'Pierdes';
    mostrarMensaje(`Gana la máquina: ${opcionMaquina} vence a ${opcionJugador} 💻`, '#ff9c66');
  }

  actualizarMarcador();
  anadirAlHistorial(opcionJugador, opcionMaquina, resultado);
}

function mostrarMensaje(texto, color) {
  mensajeEl.textContent = texto;
  mensajeEl.style.color = color;
}

function actualizarMarcador() {
  puntosJugadorEl.textContent = puntosJugador;
  puntosMaquinaEl.textContent = puntosMaquina;
  btnReiniciar.classList.remove('oculto');
}

function anadirAlHistorial(opcionJugador, opcionMaquina, resultado) {
  const ronda = document.createElement('li');
  ronda.textContent = `${EMOJIS[opcionJugador]} vs ${EMOJIS[opcionMaquina]} · ${resultado}`;
  historialEl.prepend(ronda);

  while (historialEl.children.length > MAX_RONDAS_HISTORIAL) {
    historialEl.lastElementChild.remove();
  }
}

function reiniciarMarcador() {
  puntosJugador = 0;
  puntosMaquina = 0;
  actualizarMarcador();
  jugadaJugadorEl.textContent = '❓';
  jugadaMaquinaEl.textContent = '❓';
  mostrarMensaje('Elige una opción para empezar', '#f2f0f7');
  historialEl.replaceChildren();
  btnReiniciar.classList.add('oculto');
}

// --- Eventos ---
botonesOpcion.forEach((boton) => {
  boton.addEventListener('click', () => {
    const opcionElegida = boton.dataset.opcion;
    jugarRonda(opcionElegida);
  });
});

btnReiniciar.addEventListener('click', reiniciarMarcador);
