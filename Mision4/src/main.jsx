import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { z } from "zod";
import App from "./App.jsx";
import "./index.css";

// Mensajes de Zod por defecto en castellano (los del formulario son propios; estos se ven en
// el panel de registros descartados, donde se usan los mensajes genéricos)
z.config(z.locales.es());

// Un único QueryClient para toda la app: es la caché compartida de las peticiones
const clienteQuery = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 s "frescos": cambiar de filtro y volver no repite la petición
      retry: 1, // un reintento automático; después se muestra el error con el botón Reintentar
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={clienteQuery}>
      <App />
      {/* Las devtools solo se incluyen en desarrollo (en el build de producción no aparecen) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
