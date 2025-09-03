import React, { useState } from "react";

export default function RegisterForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (pass !== pass2) return alert("Las contraseñas no coinciden");
    onSubmit?.({ name, email, pass });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm text-slate-700">Nombre</span>
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-700">Correo</span>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-700">Contraseña</span>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700">Repetir contraseña</span>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-slate-900 text-white py-2 hover:bg-slate-800"
      >
        Crear cuenta
      </button>
    </form>
  );
}
