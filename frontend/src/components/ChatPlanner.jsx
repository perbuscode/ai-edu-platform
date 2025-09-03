import React, { useEffect, useRef, useState } from "react";
import PlanPreview from "./PlanPreview";

const SUGGESTIONS = [
  "Desarrollador Frontend con React",
  "Analista de Datos con Python",
  "Marketing Digital orientado a e-commerce",
  "Inglés B2 para negocios",
  "Master en Power BI",
];

const LEVELS = ["Principiante", "Intermedio", "Avanzado"];
const HOURS = ["3–5 h/sem", "6–9 h/sem", "10+ h/sem"];
const STYLE = ["Proyectos", "Mixto", "Teoría"];

function Chip({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full border border-slate-300 bg-white text-slate-800 text-sm hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

export default function ChatPlanner() {
  const [step, setStep] = useState(0); // 0 saludo, 1 skill, 2 level, 3 hours, 4 style, 5 resultado
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");
  const [hours, setHours] = useState("");
  const [style, setStyle] = useState("");

  const [plan, setPlan] = useState(null);

  const scrollerRef = useRef(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  useEffect(() => {
    setMessages([
      { from: "bot", text: "¡Hola! 👋 Estoy aquí para armar tu plan de estudio." },
      { from: "bot", text: "Te haré 4 preguntitas y listo. ¿Qué habilidad quieres aprender para tu empleo o negocio?" },
    ]);
    setStep(1);
  }, []);

  function pushUser(text) {
    setMessages((m) => [...m, { from: "user", text }]);
  }
  function pushBot(text) {
    setMessages((m) => [...m, { from: "bot", text }]);
  }

  function handleSend() {
    const value = input.trim();
    if (!value) return;

    if (step === 1) {
      setSkill(value);
      pushUser(value);
      setInput("");
      setTimeout(() => {
        pushBot("Genial. ¿Cuál es tu nivel actual?");
        setStep(2);
      }, 300);
    } else if (step === 2) {
      setLevel(value);
      pushUser(value);
      setInput("");
      setTimeout(() => {
        pushBot("¿Cuántas horas a la semana puedes dedicar?");
        setStep(3);
      }, 300);
    } else if (step === 3) {
      setHours(value);
      pushUser(value);
      setInput("");
      setTimeout(() => {
        pushBot("Perfecto. ¿Prefieres priorizar proyectos, teoría o un enfoque mixto?");
        setStep(4);
      }, 300);
    } else if (step === 4) {
      setStyle(value);
      pushUser(value);
      setInput("");
      setTimeout(() => {
        generarYMostrarPlan(value);
      }, 300);
    }
  }

  function choose(value) {
    setInput(value);
    handleSend();
  }

  function esPowerBI(text) {
    return /power\s*bi/i.test(text || "");
  }

  function generarPlanPowerBI(nivel, dedicacion, enfoque) {
    return {
      title: "Master en Power BI · Intensivo (70h · 5 días)",
      level: nivel,
      duration: "5 días · 70h",
      hours: dedicacion,
      focus: enfoque,
      skill: "Power BI",
      blocks: [
        {
          title: "Bloque 1 — Fundamentos de Power BI",
          bullets: [
            "Conexión a datos, Power Query (ETL) y modelo relacional",
            "Combinar/anexar tablas, tablas calendario y jerarquías",
            "Visualizaciones básicas, filtros/segmentadores y diseño UX",
            "Publicación y compartido (Power BI Service)",
          ],
          project: "Dashboard de Ventas Operativas",
          role: "Jr. BI Analyst",
          salaryRef: "$20–30/h",
        },
        {
          title: "Bloque 2 — DAX + Dashboard Profesional",
          bullets: [
            "DAX básico (SUM, AVERAGE), CALCULATE y FILTER",
            "Columnas vs medidas, tablas/matrices, visualizaciones intermedias",
            "Bookmarks, tooltips, drillthrough y storytelling profesional",
            "Exportación e integración",
          ],
          project: "Dashboard Financiero Interactivo",
          role: "BI Analyst",
          salaryRef: "$35–50/h",
        },
        {
          title: "Bloque 3 — DAX Avanzado + Seguridad + Automatización",
          bullets: [
            "DAX avanzado (SUMX, RANKX), Time Intelligence",
            "RLS (seguridad por roles) y optimización",
            "Automatización (refresh/gateway), SQL y APIs externas",
          ],
          project: "Dashboard Ejecutivo RRHH (DAX avanzado, RLS, automatización)",
          role: "BI Developer",
          salaryRef: "$45–65/h",
        },
        {
          title: "Bloque 4 — IA + Python + Power Platform",
          bullets: [
            "Power BI Copilot / Q&A",
            "Text Analytics / Sentimiento, clustering y anomalías",
            "Python en Power BI, Azure ML, Power Automate",
          ],
          project: "Dashboard Predictivo de Clientes (Python, Azure, Copilot)",
          role: "Data Scientist Jr.",
          salaryRef: "$55–75/h",
        },
        {
          title: "Bloque 5 — Proyecto Master Final",
          bullets: [
            "Caso real multinacional: análisis de requerimientos",
            "Diseño modelo multifuente, ETL, DAX complejo",
            "RLS + automatización, visualización pro, IA integrada",
            "Storytelling final y presentación ejecutiva",
          ],
          project: "Proyecto Master Final",
          role: "BI Consultant / BI Lead",
          salaryRef: "$60–85/h",
        },
      ],
      summary: [
        "Portafolio listo desde el Bloque 1",
        "Preparación para roles de Jr. a Lead",
        "Validación con proyectos y rúbrica pública",
      ],
      details: {
        roles: [
          { role: "Jr. BI Analyst", salary: "$20–30/h", demand: "⭐⭐⭐", impact: "Base para empleo inicial" },
          { role: "BI Analyst", salary: "$35–50/h", demand: "⭐⭐⭐⭐", impact: "KPIs y storytelling" },
          { role: "BI Developer", salary: "$45–65/h", demand: "⭐⭐⭐⭐", impact: "Modelado, DAX y performance" },
          { role: "Data Scientist Jr.", salary: "$55–75/h", demand: "⭐⭐⭐⭐", impact: "IA aplicada en BI" },
          { role: "BI Consultant / Lead", salary: "$60–85/h", demand: "⭐⭐⭐", impact: "Arquitectura y gobierno" },
        ],
        note: "Rangos salariales y demanda son referenciales por mercado y seniority. No constituyen garantía de empleo.",
      },
    };
  }

  function generarPlanGenerico(skillText, nivel, dedicacion, enfoque) {
    const s = skillText || "Habilidad objetivo";
    return {
      title: `${s} · Ruta ${nivel || "Profesional"}`,
      level: nivel || "Profesional",
      duration: "12 semanas (estimado)",
      hours: dedicacion || "6–9 h/sem",
      focus: enfoque || "Mixto",
      skill: s,
      blocks: [
        {
          title: "Bloque 1 — Fundamentos",
          bullets: [
            `Conceptos básicos y setup de ${s}`,
            "Buenas prácticas iniciales y entorno de trabajo",
            "Mini-evaluación de fundamentos",
          ],
          project: `Proyecto 1: Caso básico aplicado a ${s}`,
          role: "Junior / Trainee",
          salaryRef: "ref. local",
        },
        {
          title: "Bloque 2 — Núcleo de la habilidad",
          bullets: [
            `Técnicas y herramientas esenciales para ${s}`,
            "Patrones y resolución de problemas comunes",
            "Uso de librerías/recursos clave",
          ],
          project: `Proyecto 2: Caso aplicado intermedio`,
          role: "Asistente / Jr.",
          salaryRef: "ref. local",
        },
        {
          title: "Bloque 3 — Profundización y performance",
          bullets: [
            "Optimización y escalabilidad",
            "Integración con herramientas/servicios externos",
            "Evaluación intermedia",
          ],
          project: `Proyecto 3: Caso avanzado / portfolio`,
          role: "Semi Senior",
          salaryRef: "ref. local",
        },
        {
          title: "Bloque 4 — Proyecto final y empleabilidad",
          bullets: [
            "Proyecto integrador con feedback",
            "CV, LinkedIn y simulación de entrevista",
            "Checklist de portfolio",
          ],
          project: `Proyecto Final: Presentación ejecutiva`,
          role: "Aplicación a puestos afines",
          salaryRef: "ref. local",
        },
      ],
      summary: [
        "Ruta enfocada en resultados y proyectos",
        "Validación por rúbrica y entregables",
        "Enfoque en empleabilidad / aplicación real",
      ],
      details: {
        roles: [
          { role: "Jr. / Trainee", salary: "ref. local", demand: "⭐⭐⭐", impact: "Base técnica" },
          { role: "Analista / Semi Sr.", salary: "ref. local", demand: "⭐⭐⭐⭐", impact: "Ejecución y autonomía" },
          { role: "Consultor / Especialista", salary: "ref. local", demand: "⭐⭐⭐", impact: "Diseño y liderazgo técnico" },
        ],
        note: "Las referencias varían según país, industria y seniority.",
      },
    };
  }

  function generarYMostrarPlan(last) {
    const nivel = level || "Profesional";
    const dedicacion = hours || "6–9 h/sem";
    const enfoque = style || last || "Mixto";

    const planData = esPowerBI(skill)
      ? generarPlanPowerBI(nivel, dedicacion, enfoque)
      : generarPlanGenerico(skill, nivel, dedicacion, enfoque);

    setPlan(planData);
    localStorage.setItem("lastPlan", JSON.stringify(planData));

    pushBot(
      `¡Listo! 🎉 Tu plan está preparado.\n\n` +
        `• Habilidad: ${planData.skill}\n` +
        `• Nivel: ${planData.level}\n` +
        `• Duración: ${planData.duration}\n` +
        `• Dedicación: ${planData.hours}\n` +
        `• Enfoque: ${planData.focus}\n\n` +
        `Abajo puedes ver el plan completo con módulos, proyectos y roles objetivo.`
    );
    setStep(5);

    setMessages((m) => [
      ...m,
      {
        from: "card",
        plan: {
          title: planData.title,
          modules: planData.blocks.slice(0, 2).map((b) => `${b.title}: ${b.project}`),
          actions: [
            { label: "Ver plan completo", href: "#plan", primary: true },
            { label: "Descargar PDF", href: "#", primary: false },
          ],
        },
      },
    ]);
  }

  function Bubble({ from, children }) {
    const base =
      "max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-line leading-relaxed text-[0.95rem]";
    if (from === "user")
      return <div className={`self-end bg-sky-600 text-white ${base}`}>{children}</div>;
    return <div className={`self-start bg-white text-slate-800 border border-slate-200 ${base}`}>{children}</div>;
  }

  function PlanCard({ plan }) {
    return (
      <div className="self-start bg-white border border-slate-200 rounded-2xl p-5 shadow-md w-full md:w-[520px]">
        <h4 className="font-semibold text-slate-900">{plan.title}</h4>
        <ul className="mt-3 space-y-1 text-sm text-slate-700 list-disc pl-5">
          {plan.modules.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {plan.actions.map((a, i) => (
            <a
              key={i}
              href={a.href}
              className={
                a.primary
                  ? "px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
                  : "px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-800 hover:bg-slate-50"
              }
              onClick={(e) => {
                if (a.label === "Descargar PDF") {
                  e.preventDefault();
                  alert("Descarga de PDF (placeholder MVP)");
                }
              }}
            >
              {a.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          *Vista resumida. Debajo verás el plan completo con bloques, proyectos y roles.
        </p>
      </div>
    );
  }

  return (
    <section id="plan" className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Pide tu plan de estudio con IA
        </h2>
        <p className="text-slate-300 mt-2 max-w-3xl">
          Conversa conmigo y en menos de 2 minutos tendrás tu plan personalizado.
        </p>

        {/* Chat */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-2xl">
          <div ref={scrollerRef} className="h-[380px] overflow-y-auto p-5 md:p-6 flex flex-col gap-3">
            {messages.map((m, i) =>
              m.from === "card" ? (
                <PlanCard key={i} plan={m.plan} />
              ) : (
                <Bubble key={i} from={m.from}>
                  {m.text}
                </Bubble>
              )
            )}

            {/* Chips por paso */}
            {step === 1 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {SUGGESTIONS.map((s) => (
                  <Chip key={s} onClick={() => choose(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {LEVELS.map((s) => (
                  <Chip key={s} onClick={() => choose(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {HOURS.map((s) => (
                  <Chip key={s} onClick={() => choose(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            )}
            {step === 4 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {STYLE.map((s) => (
                  <Chip key={s} onClick={() => choose(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          {step < 5 && (
            <div className="border-t border-slate-200 p-4 flex gap-3">
              <input
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                placeholder={
                  step === 1
                    ? 'Escribe una habilidad… (Ej: "Master en Power BI")'
                    : step === 2
                    ? "Ej: Principiante / Intermedio / Avanzado"
                    : step === 3
                    ? 'Ej: "6–9 h/sem"'
                    : 'Ej: "Proyectos" / "Mixto" / "Teoría"'
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Enviar
              </button>
            </div>
          )}
        </div>

        {/* Plan completo optimizado */}
        {plan && <PlanPreview plan={plan} />}

        <p className="text-xs text-slate-400 mt-3">
          ¿Prefieres el formulario clásico? <a href="#cursos" className="underline">Saltar a cursos</a>.
        </p>
      </div>
    </section>
  );
}
