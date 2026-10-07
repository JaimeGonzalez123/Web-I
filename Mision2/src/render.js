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

// ---------- Datos ----------

const chipTipo = (tipo) => `<span class="chip tipo-${tipo}">${nombreTipo(tipo)}</span>`;

const barraStat = ({ nombre, valor }) => `
  <li>
    <span class="stat-nombre">${nombre}</span>
    <span class="stat-barra"><span style="width:${Math.min(100, (valor / 180) * 100)}%"></span></span>
    <span class="stat-valor">${valor}</span>
  </li>`;

const tarjeta = (p) => `
  <article class="tarjeta tipo-${p.tipos[0] ?? "normal"}">
    <header>
      <span class="numero">#${p.id}</span>
      <span class="total" title="Suma de estadísticas base">Σ ${p.total}</span>
    </header>
    ${p.imagen
      ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy" width="160" height="160">`
      : `<div class="sin-imagen" aria-label="Sin imagen">?</div>`}
    <h2>${p.nombre}</h2>
    <div class="chips">${p.tipos.map(chipTipo).join("")}</div>
    <p class="medidas">${p.altura} m · ${p.peso} kg</p>
    <ul class="stats">${p.stats.map(barraStat).join("")}</ul>
  </article>`;

export function pintarPokemon(lista) {
  caja.rejilla.innerHTML = lista.map(tarjeta).join("");
}

export function pintarResumen(resumen, { tipo, cargados, fallidos, desdeCache }) {
  if (!resumen) {
    caja.resumen.innerHTML = "";
    return;
  }
  const { campeon, masPesado, media, combinaciones } = resumen;

  caja.resumen.innerHTML = `
    <div class="dato">
      <span class="etiqueta">Campeón ${nombreTipo(tipo)}</span>
      <strong>${campeon.nombre}</strong>
      <span>Σ ${campeon.total}</span>
    </div>
    <div class="dato">
      <span class="etiqueta">Media del equipo</span>
      <strong>${media}</strong>
      <span>puntos de estadística</span>
    </div>
    <div class="dato">
      <span class="etiqueta">Peso pesado</span>
      <strong>${masPesado.nombre}</strong>
      <span>${masPesado.peso} kg</span>
    </div>
    <div class="dato">
      <span class="etiqueta">Se combina con</span>
      <span class="combinaciones">${combinaciones.map(({ texto, cantidad }) => `${texto} ×${cantidad}`).join(" · ")}</span>
    </div>
    <p class="origen">
      ${cargados} Pokémon · ⚡ ${desdeCache} desde caché local · 🌐 ${cargados - desdeCache} desde la red
      ${fallidos > 0 ? `· <span class="fallo">⚠ ${fallidos} no se pudieron cargar</span>` : ""}
    </p>`;
}
