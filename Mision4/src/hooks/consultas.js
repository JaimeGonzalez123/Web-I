// Todo TanStack Query en un sitio: las claves y los hooks que las usan.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { darDeBaja, inscribirEntrenador, obtenerEntrenadores } from "../api/entrenadores.js";
import { obtenerPokedex } from "../api/pokedex.js";

// Fábrica de claves jerárquicas: ['entrenadores'] es el prefijo de todas las listas.
// Invalidar ['entrenadores'] marca como obsoletas TODAS las variantes filtradas de una vez,
// sin tener que acordarse de cada región.
export const claves = {
  entrenadores: {
    todos: ["entrenadores"],
    lista: (filtros) => ["entrenadores", "lista", filtros],
  },
  pokedex: ["pokedex"],
};

export function useEntrenadores(filtros) {
  return useQuery({
    queryKey: claves.entrenadores.lista(filtros),
    // TanStack Query pasa un AbortSignal: si cambias de filtro, la petición vieja se cancela
    queryFn: ({ signal }) => obtenerEntrenadores(filtros, signal),
    // Al cambiar de filtro se sigue enseñando la lista anterior mientras llega la nueva (sin parpadeo)
    placeholderData: (anterior) => anterior,
  });
}

export function usePokedex() {
  return useQuery({
    queryKey: claves.pokedex,
    queryFn: ({ signal }) => obtenerPokedex(signal),
    // La Pokédex no cambia durante la sesión: no hace falta volver a pedirla
    staleTime: Infinity,
    gcTime: Infinity,
    select: (nombres) => new Set(nombres),
  });
}

export function useInscribir() {
  const clienteQuery = useQueryClient();
  return useMutation({
    mutationFn: inscribirEntrenador,
    // Devolver la promesa hace que la mutación siga "pendiente" hasta que el listado se ha recargado
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: claves.entrenadores.todos }),
  });
}

export function useDarDeBaja() {
  const clienteQuery = useQueryClient();
  return useMutation({
    mutationFn: darDeBaja,
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: claves.entrenadores.todos }),
  });
}
