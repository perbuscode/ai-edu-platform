// src/components/Navbar.jsx
import React, { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-[80] bg-slate-900/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#inicio" className="flex items-center gap-2 text-white font-semibold">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-500" />
          AI Edu Platform
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#cursos" className="text-slate-200 hover:text-white text-sm">Cursos</a>
          <a href="#plan" className="text-slate-200 hover:text-white text-sm">Plan</a>
          <a href="#contacto" className="text-slate-200 hover:text-white text-sm">Contacto</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-200 hover:bg-white/10"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur">
          <div className="px-4 py-3 space-y-2">
            <a href="#cursos" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm">Cursos</a>
            <a href="#plan" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm">Plan</a>
            <a href="#contacto" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm">Contacto</a>
          </div>
        </div>
      )}
    </nav>
  );
}
