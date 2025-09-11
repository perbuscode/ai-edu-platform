// src/components/Footer.jsx
import React from "react";

export default function Footer({ onOpenExample }) {
  return (
    <footer id="contacto" className="bg-slate-900 border-t border-white/10 mt-8 scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h5 className="text-white font-semibold">AI Edu Platform</h5>
            <p className="text-slate-300 text-sm mt-2">
              Impulsando el aprendizaje con inteligencia artificial.
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-slate-400 text-sm">© 2025 AI EdTech. Todos los derechos reservados.</p>
            <div className="mt-3 flex flex-wrap md:justify-end items-center gap-4">
              <a href="#" aria-label="YouTube" className="text-slate-300 hover:text-white">YouTube</a>
              <a href="#" aria-label="TikTok" className="text-slate-300 hover:text-white">TikTok</a>
              <a href="#" aria-label="Facebook" className="text-slate-300 hover:text-white">Facebook</a>
              <a href="#" aria-label="LinkedIn" className="text-slate-300 hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
