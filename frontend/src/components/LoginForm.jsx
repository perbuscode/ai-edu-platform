import React, { useState } from "react";

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.({ email, pass });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <label className="block">
        <span className="text-sm text-slate-700">Contraseña</span>
        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="••••••••"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-lg bg-slate-900 text-white py-2 hover:bg-slate-800"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
