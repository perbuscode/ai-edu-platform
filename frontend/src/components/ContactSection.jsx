import React, { useState } from "react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [msg, setMsg] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert("Mensaje enviado. (Placeholder MVP)");
    setName(""); setMail(""); setMsg("");
  }

  return (
    <section id="contacto" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Contacto</h2>
          <p className="text-slate-600 mt-2">
            ¿Necesitas ayuda para elegir tu ruta? Escríbenos y te responderemos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow p-6 space-y-4">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Correo"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
          <textarea
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Tu mensaje"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            required
          />
          <button className="w-full rounded-lg bg-slate-900 text-white py-2 hover:bg-slate-800">
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
