// src/pages/Contacto.jsx
import React, { useState } from "react";

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    setStatus("submitting");
    // Simulación de envío a una API
    setTimeout(() => {
      console.log("Formulario enviado:", formData);
      setStatus("success");
    }, 1500);
  };

  return (
    <main className="pt-24 md:pt-28 bg-slate-900 min-h-screen">
      <div className="max-w-xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-3xl font-bold text-white text-center">
          Contáctanos
        </h1>
        <p className="mt-2 text-slate-300 text-center">
          ¿Tienes alguna pregunta o sugerencia? Escríbenos y te responderemos
          pronto.
        </p>

        {status === "success" ? (
          <div className="mt-8 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 p-6 text-center">
            <h2 className="text-lg font-semibold">¡Mensaje enviado!</h2>
            <p className="mt-1 text-sm">
              Gracias por contactarnos. Te responderemos a la brevedad.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-slate-700"
              >
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
            >
              {status === "submitting" ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
