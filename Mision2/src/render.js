// render.js — Todo lo que toca el DOM. Recibe datos ya transformados y los pinta.

import { nombreTipo } from "./logica.js";

const $ = (id) => document.getElementById(id);

const caja = {
  tipo: $("tipo"),
  busqueda: $("busqueda"),
  orden: $("orden"),
  vaciar: $("vaciar-cache"),
  avisoCache: $("aviso-cache"),
  estado: $("estado"),
  resumen: $("resumen"),
  rejilla: $("rejilla"),
};

// ---------- Controles ----------

export function escucharControles({ alCambiarTipo, alFiltrar, alVaciarCache }) {
  caja.tipo.addEventListener("change", () => alCambiarTipo(caja.tipo.value));
  caja.busqueda.addEventListener("input", alFiltrar);
  caja.orden.addEventListener("change", alFiltrar);
  caja.vaciar.addEventListener("click", alVaciarCache);
}

export const leerFiltros = () => ({ busqueda: caja.busqueda.value, orden: caja.orden.value });

export function pintarOpcionesTipo(tipos) {
  caja.tipo.innerHTML = `<option value="">— Elige un tipo —</option>`
    + tipos.map(({ valor, texto }) => `<option value="${valor}">${texto}</option>`).join("");
  caja.tipo.disabled = false;
}

export function mostrarAvisoCache(texto) {
  caja.avisoCache.textContent = texto;
}

// ---------- Estados: cargando, error y vacío ----------

export function mostrarCargando(mensaje) {
  caja.estado.className = "estado cargando";
  caja.estado.innerHTML = `<span class="pokeball" aria-hidden="true"></span><p></p>`;
  caja.estado.querySelector("p").textContent = mensaje;
  caja.resumen.innerHTML = "";
  caja.rejilla.innerHTML = "";
}

export function mostrarError(mensaje, alReintentar) {
  caja.estado.className = "estado error";
  caja.estado.innerHTML = `<p class="icono" aria-hidden="true">💥</p><p></p>
    <button type="button" class="boton">Reintentar</button>`;
  caja.estado.querySelector("p:not(.icono)").textContent = mensaje;
  caja.estado.querySelector("button").addEventListener("click", alReintentar);
  caja.resumen.innerHTML = "";
  caja.rejilla.innerHTML = "";
}

export function mostrarVacio(mensaje, icono = "🔍") {
  caja.estado.className = "estado vacio";
  caja.estado.innerHTML = `<p class="icono" aria-hidden="true">${icono}</p><p></p>`;
  caja.estado.querySelector("p:not(.icono)").textContent = mensaje;
}

export function limpiarEstado() {
  caja.estado.className = "estado";
  caja.estado.innerHTML = "";
}
