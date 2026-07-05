"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <div className="p-6 text-gray-600">Cargando documentación de la API...</div>,
});

export default function ApiDocsPage() {
  useEffect(() => {
    // Guardamos el método original de advertencias
    const originalWarn = console.warn;

    // Interceptamos temporalmente console.warn para ignorar el aviso obsoleto de Swagger
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === "string" && args[0].includes("UNSAFE_componentWillReceiveProps")) {
        return; // Ignora este warning específico
      }
      originalWarn(...args);
    };

    // Al salir de la página, restauramos el comportamiento original de la consola
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <SwaggerUI url="/api/docs/swagger" />
    </div>
  );
}