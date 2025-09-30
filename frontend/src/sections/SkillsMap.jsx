// src/sections/SkillsMap.jsx
import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardProvider";
import DiagnosticCard from "../components/missions/DiagnosticCard";
import MissionRubricModal from "../components/missions/MissionRubricModal";
import { MISSIONS } from "../data/missions";

const SkillsSkeleton = () => (
  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <li key={index} className="border border-slate-200 rounded-lg p-4">
        <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
        <div className="mt-3 h-2 bg-slate-200 rounded animate-pulse" />
        <div className="mt-2 h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
      </li>
    ))}
  </ul>
);

const EmptyState = () => (
  <div className="text-slate-400 text-sm">No hay datos disponibles</div>
);

const ErrorPanel = ({ msg, onRetry }) => (
  <div className="text-rose-500 text-sm flex items-center gap-2">
    <span>Error: {msg}</span>
    <button type="button" className="underline" onClick={onRetry}>
      Reintentar
    </button>
  </div>
);

function SkillBar({ name, levelText, pct, badge }) {
  return (
    <li className="border border-slate-200 rounded-lg p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium text-slate-900 min-w-0 flex-1">{name}</p>
        <span
          className={`text-xs px-2 py-1 rounded-full shrink-0 whitespace-nowrap ${badge?.bg || "bg-slate-100"} ${badge?.text || "text-slate-800"}`}
        >
          {badge?.label || ""}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full">
        <div className="h-2 bg-sky-600 rounded-full" style={{ width: pct }} />
      </div>
      <p className="text-xs text-slate-500">{levelText}</p>
    </li>
  );
}

export default function SkillsMap({ observe, courseId }) {
  const sectionRef = useRef(null);
  const diagnosticAnchorRef = useRef(null);
  const diagnosticCardRef = useRef(null);
  useEffect(
    () => (observe ? observe(sectionRef.current) : undefined),
    [observe]
  );

  const [qrDataUrl, setQrDataUrl] = useState("");
  useEffect(() => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "https://example.com";
    QRCode.toDataURL(url, { width: 200, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, []);

  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeRubricMission, setActiveRubricMission] = useState(null);

  const { skills, loading, error, refresh } = useDashboard();

  const primaryCourseId = "powerbi";
  const missions = MISSIONS;

  const levelItems = Array.isArray(skills?.levels)
    ? skills.levels.map((level, index) => ({
        id: level?.id ?? `skill-${index}`,
        name: level?.name ?? level?.title ?? `Skill ${index + 1}`,
        levelText: level?.levelText ?? level?.level ?? "",
        pct:
          typeof level?.percent === "number"
            ? `${level.percent}%`
            : (level?.percent ??
              (typeof level?.pct === "number"
                ? `${level.pct}%`
                : (level?.pct ?? "0%"))),
        badge:
          level?.badge ??
          (level?.badgeLabel
            ? {
                label: level.badgeLabel,
                bg: level.badgeBg,
                text: level.badgeText,
              }
            : undefined),
      }))
    : [];

  const handleScrollToDiagnostic = () => {
    if (typeof window === "undefined") return;
    const node =
      diagnosticAnchorRef.current ||
      document.getElementById("diagnostico-anchor");
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

  let skillsContent;
  if (loading) skillsContent = <SkillsSkeleton />;
  else if (error) skillsContent = <ErrorPanel msg={error} onRetry={refresh} />;
  else if (levelItems.length === 0) skillsContent = <EmptyState />;
  else
    skillsContent = (
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {levelItems.map((item) => (
          <SkillBar
            key={item.id}
            name={item.name}
            levelText={item.levelText}
            pct={item.pct}
            badge={item.badge}
          />
        ))}
      </ul>
    );

  return (
    <section
      id="mapa"
      ref={sectionRef}
      className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Mapa de competencias + Misiones adaptativas
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Radar de skills y misiones de 15-30 min para cerrar brechas hacia tu
            rol objetivo.
          </p>
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
            <svg
              viewBox="0 0 200 200"
              className="w-3/4"
              aria-label="Radar de competencias"
              role="img"
            >
              <g stroke="#cbd5e1" strokeWidth="1">
                <polygon
                  points="100,10 183,55 183,145 100,190 17,145 17,55"
                  fill="none"
                />
                <polygon
                  points="100,35 160,67 160,133 100,165 40,133 40,67"
                  fill="none"
                />
                <polygon
                  points="100,60 137,80 137,120 100,140 63,120 63,80"
                  fill="none"
                />
              </g>
              <polygon
                points="100,45 150,75 142,130 100,165 55,120 60,70"
                fill="#38bdf8"
                fillOpacity="0.35"
                stroke="#0ea5e9"
                strokeWidth="2"
              />
              <g fill="#475569" fontSize="10" textAnchor="middle">
                <text x="100" y="8">
                  DAX
                </text>
                <text x="188" y="55">
                  ETL
                </text>
                <text x="188" y="150">
                  Modelado
                </text>
                <text x="100" y="198">
                  Storytelling
                </text>
                <text x="12" y="150">
                  SQL
                </text>
                <text x="12" y="55">
                  Ingles B2
                </text>
              </g>
            </svg>
          </div>
        </div>

        <div className="md:col-span-2">{skillsContent}</div>
      </div>

      <div className="mt-6 hidden">
        <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-4 w-full md:w-auto">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Comparte / Abre en movil
            </p>
            <p className="text-xs text-slate-600">
              Escanea el codigo para abrir esta misma pagina
            </p>
          </div>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR hacia esta pagina"
              className="w-24 h-24 ml-auto"
            />
          ) : (
            <div className="w-24 h-24 ml-auto bg-slate-100 rounded grid place-items-center text-slate-400 text-xs">
              QR
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-base font-semibold text-slate-900">
          Misiones sugeridas
        </h4>
        <div className="mt-3 grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {missions.map((mission) => (
            <article
              key={mission.id}
              className="border border-slate-200 rounded-lg p-4 flex flex-col gap-3 h-full"
            >
              <h5 className="font-medium text-slate-900">{mission.title}</h5>
              <p className="text-sm text-slate-600 mt-1">
                {mission.description}
              </p>
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
              <div className="mt-auto grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-medium min-h-[40px] px-3"
                  onClick={() => handleOpenMission(mission)}
                >
                  Iniciar mision
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 text-slate-800 text-sm font-medium min-h-[40px] px-3 bg-white"
                  onClick={() => handleOpenRubric(mission)}
                >
                  Ver rubrica
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        id="diagnostico-anchor"
        ref={diagnosticAnchorRef}
        className="block h-0"
        aria-hidden="true"
      />

      <DiagnosticCard
        ref={diagnosticCardRef}
        userId={user?.uid || null}
        courseId={courseId || primaryCourseId}
      />

      <MissionRubricModal
        open={Boolean(activeRubricMission)}
        mission={activeRubricMission}
        onClose={handleCloseRubric}
      />
    </section>
  );
}
