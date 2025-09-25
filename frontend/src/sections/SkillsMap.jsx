// src/sections/SkillsMap.jsx
import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DiagnosticCard from "../components/missions/DiagnosticCard";
import MissionRubricModal from "../components/missions/MissionRubricModal";
import { MISSIONS } from "../data/missions";

function SkillBar({ name, levelText, pct, badge }) {
  return (
    <li className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium text-slate-900">{name}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${badge?.bg || "bg-slate-100"} ${badge?.text || "text-slate-800"}`}>{badge?.label || ""}</span>
      </div>
      <div className="mt-2 w-full h-2 bg-slate-200 rounded-full">
        <div className="h-2 bg-sky-600 rounded-full" style={{ width: pct }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">{levelText}</p>
    </li>
  );
}

export default function SkillsMap({ observe, courseId }) {
  const sectionRef = useRef(null);
  const diagnosticAnchorRef = useRef(null);
  const diagnosticCardRef = useRef(null);
  useEffect(() => (observe ? observe(sectionRef.current) : undefined), [observe]);

  const [qrDataUrl, setQrDataUrl] = useState("");
  useEffect(() => {
    const url = typeof window !== "undefined" ? window.location.href : "https://example.com";
    QRCode.toDataURL(url, { width: 200, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, []);

  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeRubricMission, setActiveRubricMission] = useState(null);

  const primaryCourseId = "powerbi";
  const missions = MISSIONS;

  const handleScrollToDiagnostic = () => {
    if (typeof window === "undefined") return;
    const node = diagnosticAnchorRef.current || document.getElementById("diagnostico-anchor");
    if (!node) return;
    try {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      node.scrollIntoView();
    }
  };

  const handleStartDiagnosticFromTop = () => {
    const start = diagnosticCardRef.current?.startDiagnostic;
    const maybePromise = start ? start() : null;
    if (maybePromise && typeof maybePromise.then === "function") {
      maybePromise.finally(handleScrollToDiagnostic);
    } else {
      handleScrollToDiagnostic();
    }
  };

  const handleOpenMission = (mission) => {
    navigate(`/missions/${mission.id}`);
  };

  const handleOpenRubric = (mission) => {
    setActiveRubricMission(mission);
  };

  const handleCloseRubric = () => {
    setActiveRubricMission(null);
  };

  return (
    <section id="mapa" ref={sectionRef} className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Mapa de competencias + Misiones adaptativas</h3>
          <p className="text-sm text-slate-600 mt-1">Radar de skills y misiones de 15-30 min para cerrar brechas hacia tu rol objetivo.</p>
        </div>
        <button
          type="button"
          onClick={handleStartDiagnosticFromTop}
          className="hidden md:inline-flex px-3 py-2 rounded-lg bg-slate-900 text-white text-sm"
        >
          Realizar diagnostico
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="aspect-square bg-slate-100 rounded-xl border border-slate-200 grid place-items-center">
            <svg viewBox="0 0 200 200" className="w-3/4" aria-label="Radar de competencias" role="img">
              <g stroke="#cbd5e1" strokeWidth="1">
                <polygon points="100,10 183,55 183,145 100,190 17,145 17,55" fill="none" />
                <polygon points="100,35 160,67 160,133 100,165 40,133 40,67" fill="none" />
                <polygon points="100,60 137,80 137,120 100,140 63,120 63,80" fill="none" />
              </g>
              <polygon points="100,45 150,75 142,130 100,165 55,120 60,70" fill="#38bdf8" fillOpacity="0.35" stroke="#0ea5e9" strokeWidth="2" />
              <g fill="#475569" fontSize="10" textAnchor="middle">
                <text x="100" y="8">DAX</text>
                <text x="188" y="55">ETL</text>
                <text x="188" y="150">Modelado</text>
                <text x="100" y="198">Storytelling</text>
                <text x="12" y="150">SQL</text>
                <text x="12" y="55">Ingles B2</text>
              </g>
            </svg>
          </div>
        </div>

        <div className="md:col-span-2">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkillBar name="DAX" levelText="Nivel 3/5" pct="60%" badge={{ label: "Subiendo", bg: "bg-emerald-100", text: "text-emerald-800" }} />
            <SkillBar name="ETL / Power Query" levelText="Nivel 2/5" pct="40%" badge={{ label: "Estable", bg: "bg-slate-100", text: "text-slate-800" }} />
            <SkillBar name="Modelado" levelText="Nivel 2/5" pct="35%" badge={{ label: "Subiendo", bg: "bg-emerald-100", text: "text-emerald-800" }} />
            <SkillBar name="Storytelling" levelText="Nivel 3/5" pct="60%" badge={{ label: "Bajando", bg: "bg-amber-100", text: "text-amber-800" }} />
            <SkillBar name="SQL" levelText="Nivel 2/5" pct="40%" badge={{ label: "Estable", bg: "bg-slate-100", text: "text-slate-800" }} />
            <SkillBar name="Ingles B2" levelText="Nivel 2/5" pct="40%" badge={{ label: "Estable", bg: "bg-slate-100", text: "text-slate-800" }} />
          </ul>
        </div>
      </div>

      <div className="mt-6 hidden">
        <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-4 w-full md:w-auto">
          <div>
            <p className="text-sm font-medium text-slate-900">Comparte / Abre en movil</p>
            <p className="text-xs text-slate-600">Escanea el codigo para abrir esta misma pagina</p>
          </div>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR hacia esta pagina" className="w-24 h-24 ml-auto" />
          ) : (
            <div className="w-24 h-24 ml-auto bg-slate-100 rounded grid place-items-center text-slate-400 text-xs">QR</div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-base font-semibold text-slate-900">Misiones sugeridas</h4>
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {missions.map((mission) => (
            <article key={mission.id} className="border border-slate-200 rounded-lg p-4">
              <h5 className="font-medium text-slate-900">{mission.title}</h5>
              <p className="text-sm text-slate-600 mt-1">{mission.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {mission.chips.map((chip, index) => (
                  <span
                    key={`${mission.id}-chip-${index}`}
                    className={`px-2 py-1 text-xs rounded-full ${mission.chipStyles?.[index] || "bg-slate-100 text-slate-700"}`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm whitespace-nowrap"
                  onClick={() => handleOpenMission(mission)}
                >
                  Iniciar mision
                </button>
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm whitespace-nowrap"
                  onClick={() => handleOpenRubric(mission)}
                >
                  Ver rubrica
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div id="diagnostico-anchor" ref={diagnosticAnchorRef} className="block h-0" aria-hidden="true" />

      <DiagnosticCard ref={diagnosticCardRef} userId={user?.uid || null} courseId={courseId || primaryCourseId} />

      <MissionRubricModal open={Boolean(activeRubricMission)} mission={activeRubricMission} onClose={handleCloseRubric} />
    </section>
  );
}










