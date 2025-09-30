// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ServerCrash } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
      <ServerCrash className="w-24 h-24 text-sky-400 mb-6" strokeWidth={1} />
      <h1 className="text-5xl md:text-6xl font-bold mb-2">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-300 mb-6">
        Página No Encontrada
      </h2>
      <p className="max-w-md text-slate-400 mb-8">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors duration-300"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
