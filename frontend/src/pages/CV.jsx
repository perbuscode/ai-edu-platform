// src/pages/CV.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { jsPDF } from "jspdf";

export default function CV() {
  const navigate = useNavigate();

  function downloadPDF() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    let y = margin;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Estudiante Ejemplo', margin, y);

    y += 22; doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Email: estudiante@example.com  |  LinkedIn: linkedin.com/in/ejemplo', margin, y);

    y += 28; doc.setTextColor(30); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
    doc.text('Resumen', margin, y);
    y += 16; doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(50);
    const resumen = 'Analista de datos con foco en BI (Power BI, DAX) y visualización ejecutiva. Experiencia en modelado, ETL y storytelling con impacto en negocio.';
    const wrappedResumen = doc.splitTextToSize(resumen, 515);
    doc.text(wrappedResumen, margin, y);
    y += wrappedResumen.length * 14 + 10;

    doc.setTextColor(30); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
    doc.text('Habilidades', margin, y);
    y += 16; doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(50);
    const skills = ['Power BI (DAX, Power Query)', 'SQL', 'Modelado de datos', 'Storytelling', 'Git', 'Excel avanzado'];
    skills.forEach((s) => { doc.text('- ' + s, margin, y); y += 14; });

    y += 6; doc.setTextColor(30); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
    doc.text('Experiencia', margin, y);
    y += 18; doc.setFont('helvetica', 'bold'); doc.text('Proyecto: Dashboard de Ventas', margin, y);
    y += 14; doc.setFont('helvetica', 'normal'); doc.setTextColor(50);
    const exp1 = 'Diseño y desarrollo de dashboard con KPIs trimestrales y análisis de tendencias. Mejora de claridad y performance (DAX) en un 25%.';
    doc.text(doc.splitTextToSize(exp1, 515), margin, y);

    doc.save('CV_Estudiante_Ejemplo.pdf');
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Topbar />
      <main className="pl-64 pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">CV de ejemplo</h1>
            <div className="flex gap-2">
              <button onClick={() => navigate('/dashboard#empleo')} className="px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm">Volver</button>
              <button onClick={downloadPDF} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">Descargar PDF</button>
            </div>
          </div>
          <section className="bg-white rounded-xl shadow border border-slate-200 p-6 text-slate-900">
            <header>
              <h2 className="text-xl font-semibold">Estudiante Ejemplo</h2>
              <p className="text-sm text-slate-600">Email: estudiante@example.com · LinkedIn: linkedin.com/in/ejemplo</p>
            </header>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Resumen</h3>
              <p className="text-sm text-slate-700 mt-1">Analista de datos con foco en BI (Power BI, DAX) y visualización ejecutiva. Experiencia en modelado, ETL y storytelling con impacto en negocio.</p>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Habilidades</h3>
                <ul className="mt-1 text-sm list-disc pl-5 text-slate-700">
                  <li>Power BI (DAX, Power Query)</li>
                  <li>SQL y modelado de datos</li>
                  <li>Storytelling ejecutivo</li>
                  <li>Git y Excel avanzado</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Experiencia</h3>
                <div className="mt-1 text-sm text-slate-700">
                  <p className="font-medium">Proyecto: Dashboard de Ventas</p>
                  <p>KPIs trimestrales y análisis de tendencias. Mejora de claridad y performance (DAX) en 25%.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

