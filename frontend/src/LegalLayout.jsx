// src/layouts/LegalLayout.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div className="bg-slate-900 text-slate-300 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">
            Última actualización: {lastUpdated}
          </p>
        </header>

        <article className="prose prose-invert max-w-none">{children}</article>

        <div className="mt-12 text-center">
          <Link to="/" className="text-sky-400 hover:underline text-sm">
            &larr; Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
