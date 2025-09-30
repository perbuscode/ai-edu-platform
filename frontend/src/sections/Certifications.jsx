// src/sections/Certifications.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { mockCertifications as defaultCerts } from "../data/certifications.mock";

export default function Certifications({ observe, items }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  const data = useMemo(
    () => (items && Array.isArray(items) ? items : defaultCerts),
    [items]
  );

  function downloadSampleCertificate(cert) {
    const canvas = document.createElement("canvas");
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Title
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 56px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Certificado de Finalización", width / 2, 150);

    // Subtitle
    ctx.fillStyle = "#334155";
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText("Edvance certifica que", width / 2, 220);

    // Name placeholder
    ctx.fillStyle = "#111827";
    ctx.font = "bold 48px Arial, sans-serif";
    ctx.fillText("Estudiante Ejemplo", width / 2, 290);

    // For course title
    ctx.fillStyle = "#334155";
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText(
      `ha completado satisfactoriamente: ${cert?.name || "Curso"}`,
      width / 2,
      340
    );

    // Issuer and date
    ctx.fillStyle = "#475569";
    ctx.font = "20px Arial, sans-serif";
    const date = cert?.date
      ? new Date(cert.date).toLocaleDateString()
      : new Date().toLocaleDateString();
    ctx.fillText(`${cert?.issuer || "AI Edu"}  •  ${date}`, width / 2, 390);

    // Seal
    const cx = width - 220;
    const cy = height - 180;
    const r = 80;
    ctx.fillStyle = "#0ea5e9";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial, sans-serif";
    ctx.fillText("EDVANCE", cx, cy - 4);
    ctx.font = "16px Arial, sans-serif";
    ctx.fillText("CERTIFIED", cx, cy + 24);

    // Download
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cert?.id || "certificado"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <section
      id="certificaciones"
      ref={ref}
      className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Certificaciones
        </h3>
        <span className="text-sm text-slate-500">
          {data.length} obtenida{data.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((c) => (
          <article
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col text-center items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white grid place-items-center flex-shrink-0">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="mt-3 flex-1">
              <h4 className="text-base font-semibold text-slate-900">
                {c.name}
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Emitido por {c.issuer} • {new Date(c.date).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 w-full flex items-center gap-2">
              <a
                href="#"
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-500"
                onClick={(e) => {
                  e.preventDefault();
                  downloadSampleCertificate(c);
                }}
                title="Descargar certificado (ejemplo)"
              >
                Descargar
              </a>
              <button
                type="button"
                className="flex-shrink-0 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
                title="Compartir certificado (próximamente)"
              >
                Compartir
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
