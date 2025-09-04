// src/components/Footer.jsx
import React from "react";

export default function Footer({ onOpenExample }) {
  return (
    <footer id="contacto" className="bg-slate-900 border-t border-white/10 mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-white font-semibold">AI Edu Platform</h5>
            <p className="text-slate-300 text-sm mt-2">
              Impulsando el aprendizaje con inteligencia artificial.
            </p>
          </div>
          <div>
            <h6 className="text-white font-semibold">Enlaces</h6>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a href="#inicio" className="text-slate-300 hover:text-white">Inicio</a></li>
              <li><a href="#cursos" className="text-slate-300 hover:text-white">Cursos</a></li>
              <li><a href="#plan" className="text-slate-300 hover:text-white">Plan</a></li>
              <li><a href="#contacto" className="text-slate-300 hover:text-white">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-white font-semibold">Acciones</h6>
            <div className="mt-3 flex gap-2 justify-center md:justify-start">
              <a
                href="#plan"
                className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-500"
              >
                Generar mi plan
              </a>
              <button
                onClick={onOpenExample}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow transition-[padding] duration-200 hover:px-5"
              >
                <span className="absolute inset-y-0 left-0 w-0 bg-sky-600 transition-all duration-300 group-hover:w-full"/>
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Ver plan de ejemplo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} AI EdTech. Todos los derechos reservados.
          </p>
          {/* Redes alineadas a la izquierda (debajo del texto) */}
          <div className="mt-3 flex items-center gap-4">
            <a href="#" aria-label="YouTube" className="text-slate-300 hover:text-white">YouTube</a>
            <a href="#" aria-label="TikTok" className="text-slate-300 hover:text-white">TikTok</a>
            <a href="#" aria-label="Facebook" className="text-slate-300 hover:text-white">Facebook</a>
            <a href="#" aria-label="LinkedIn" className="text-slate-300 hover:text-white">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
