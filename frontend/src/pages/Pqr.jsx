// src/pages/Pqr.jsx
import React, { useState } from "react";

export default function Pqr() {
  const [form, setForm] = useState({ nombre: "", email: "", tipo: "peticion", mensaje: "" });
  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function submit(e) { e.preventDefault(); alert("Enviado (placeholder)"); }
  return (
    <main className="pt-24 md:pt-28 bg-slate-900 min-h-screen">
      <div className="max-w-xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-3xl font-bold text-white">Peticiones, quejas o reclamos</h1>
        <form onSubmit={submit} className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nombre</label>
            <input value={form.nombre} onChange={(e)=>update('nombre', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={form.email} onChange={(e)=>update('email', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Tipo</label>
            <select value={form.tipo} onChange={(e)=>update('tipo', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="peticion">Petición</option>
              <option value="queja">Queja</option>
              <option value="reclamo">Reclamo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Mensaje</label>
            <textarea value={form.mensaje} onChange={(e)=>update('mensaje', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 h-28" required />
          </div>
          <button className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">Enviar</button>
        </form>
      </div>
    </main>
  );
}

