export const mockProjects = [
  {
    title: "Dashboard de Ventas",
    desc: "KPIs trimestrales y storytelling ejecutivo.",
    status: {
      label: "Aprobado",
      bg: "bg-emerald-100",
      text: "text-emerald-800",
    },
  },
  {
    title: "Modelo Financiero",
    desc: "Análisis de márgenes y proyecciones.",
    status: { label: "En revisión", bg: "bg-sky-100", text: "text-sky-800" },
  },
  {
    title: "Análisis de Churn",
    desc: "Segmentación y predicción de bajas.",
    status: { label: "Pendiente", bg: "bg-amber-100", text: "text-amber-800" },
  },
  {
    title: "Exploración de Datos",
    desc: "EDA con hallazgos clave.",
    status: {
      label: "Aprobado",
      bg: "bg-emerald-100",
      text: "text-emerald-800",
    },
  },
  {
    title: "Pipeline ETL",
    desc: "Limpieza y normalización multi-fuente.",
    status: { label: "En revisión", bg: "bg-sky-100", text: "text-sky-800" },
  },
  {
    title: "Storytelling Ejecutivo",
    desc: "Narrativa para comité directivo.",
    status: { label: "Pendiente", bg: "bg-amber-100", text: "text-amber-800" },
  },
];

export const mockProjectDetails = {
  goal: "Construir un dashboard de ventas con foco en conversión y ticket promedio.",
  impact: [
    "Reducción del 18% en tiempo de preparación de reportes para la dirección comercial.",
    "Automatización de alertas semanales con brechas de objetivos.",
    "Historias de datos alineadas a los OKR trimestrales.",
  ],
  stack: ["Power BI", "SQL", "DAX", "Figma"],
  metrics: [
    { label: "Tiempo de desarrollo", value: "3 semanas" },
    { label: "Stakeholders", value: "Gerencia comercial, Finanzas" },
    {
      label: "Entrega",
      value: "Presentación ejecutiva + dashboard interactivo",
    },
  ],
};
