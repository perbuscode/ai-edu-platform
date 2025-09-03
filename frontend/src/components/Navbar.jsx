import React from "react";

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  return (
    <header className="fixed top-0 inset-x-0 z-30">
      <div className="backdrop-blur bg-slate-900/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-6 rounded bg-white/90" />
            <span className="text-white font-semibold">AI Edu Platform</span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#inicio"
              className="text-slate-200 hover:text-white text-sm"
            >
              Inicio
            </a>
            <a
              href="#plan"
              className="text-slate-200 hover:text-white text-sm"
            >
              Plan
            </a>
            <a
              href="#cursos"
              className="text-slate-200 hover:text-white text-sm"
            >
              Cursos
            </a>
            <a
              href="#contacto"
              className="text-slate-200 hover:text-white text-sm"
            >
              Contacto
            </a>
          </nav>

          {/* Botones */}
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 text-slate-200 border border-white/30 rounded hover:bg-white/10 text-sm"
              onClick={onOpenLogin}
            >
              Iniciar sesión
            </button>
            <button
              className="px-3 py-1.5 bg-slate-700 text-white rounded hover:bg-slate-600 text-sm"
              onClick={onOpenRegister}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
