// src/sections/Intro.jsx
import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function Intro({ observe }) {
  const { user } = useAuth();
  function getDisplayName(u) {
    if (!u) return "Estudiante";
    if (u.displayName && u.displayName.trim()) return u.displayName.trim();
    if (u.email) {
      const local = u.email.split('@')[0] || '';
      return local.charAt(0).toUpperCase() + local.slice(1);
    }
    return "Estudiante";
  }
  const displayName = getDisplayName(user);
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  return (
    <section id="intro" ref={ref} className="scroll-mt-20 bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Hola, {displayName} 👋</h2>
          <p className="text-slate-300 mt-1">Este es tu salón de clases. Aquí encuentras tu plan, tu avance y tus oportunidades.</p>
        </div>
        {/* Botón de navegación eliminado por redundante */}
      </div>
    </section>
  );
}
