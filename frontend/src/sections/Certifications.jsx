// src/sections/Certifications.jsx
import React, { useEffect, useMemo, useRef } from "react";

const defaultCerts = [
  { id: "cert-react", title: "Certificado: React Avanzado", issuer: "Edvance", date: "2025-05-12" },
  { id: "cert-powerbi", title: "Certificado: Power BI Profesional", issuer: "Edvance", date: "2025-03-28" },
  { id: "cert-scrum", title: "Certificado: Fundamentos de Scrum", issuer: "Edvance", date: "2024-11-02" },
];

export default function Certifications({ observe, items }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  const data = useMemo(() => (items && Array.isArray(items) ? items : defaultCerts), [items]);

  function downloadSampleCertificate(cert) {
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 56px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificado de Finalización', width / 2, 150);

    // Subtitle
    ctx.fillStyle = '#334155';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText('Edvance certifica que', width / 2, 220);

    // Name placeholder
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.fillText('Estudiante Ejemplo', width / 2, 290);

    // For course title
    ctx.fillStyle = '#334155';
    ctx.font = '22px Arial, sans-serif';
    const title = (cert?.title || 'Curso').replace(/^Certificado:\s*/i, '');
    ctx.fillText(`ha completado satisfactoriamente: ${title}`, width / 2, 340);

    // Issuer and date
    ctx.fillStyle = '#475569';
    ctx.font = '20px Arial, sans-serif';
    const date = cert?.date ? new Date(cert.date).toLocaleDateString() : new Date().toLocaleDateString();
    ctx.fillText(`${cert?.issuer || 'AI Edu'}  •  ${date}`, width / 2, 390);

    // Seal
    const cx = width - 220;
    const cy = height - 180;
    const r = 80;
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('EDVANCE', cx, cy - 4);
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('CERTIFIED', cx, cy + 24);

    // Download
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert?.id || 'certificado'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <section id="certificaciones" ref={ref} className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Certificaciones</h3>
        <span className="text-sm text-slate-500">{data.length} obtenida{data.length === 1 ? '' : 's'}</span>
      </div>

      <ul className="divide-y divide-slate-200">
        {data.map((c) => (
          <li key={c.id} className="py-3 flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white grid place-items-center flex-shrink-0" aria-hidden>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{c.title}</p>
              <p className="text-xs text-slate-600">{c.issuer} • {new Date(c.date).toLocaleDateString()}</p>
            </div>
            <div>
              <a
                href="#"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-slate-300 text-slate-700 text-xs hover:bg-slate-50"
                onClick={(e) => { e.preventDefault(); downloadSampleCertificate(c); }}
                title="Descargar certificado (ejemplo)"
              >
                Descargar
              </a>
            </div>
          </li>
        ))}
      </ul>

      {/* Navegación inferior eliminada */}
    </section>
  );
}
