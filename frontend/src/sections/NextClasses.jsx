// src/sections/NextClasses.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultItems = [
  {
    color: "bg-blue-500",
    title: "Async/Await (Frontend)",
    when: "Hoy, 3:00 PM",
  },
  {
    color: "bg-green-500",
    title: "Modelado de Datos (Power BI)",
    when: "Mañana, 10:00 AM",
  },
  {
    color: "bg-purple-500",
    title: "Pruebas unitarias",
    when: "Viernes, 2:00 PM",
  },
];

export default function NextClasses({ observe, items }) {
  const ref = useRef(null);
  useEffect(() => (observe ? observe(ref.current) : undefined), [observe]);
  const data = useMemo(
    () => (items && Array.isArray(items) ? items : defaultItems),
    [items]
  );
  const navigate = useNavigate();

  // Hora y zona horaria actuales del usuario
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );
  const offsetMinutes = -now.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  const offsetStr = `GMT${sign}${hh}:${mm}`;
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <section
      id="proximas"
      ref={ref}
      className="scroll-mt-20 bg-white rounded-xl shadow-xl border border-slate-200 p-6 text-slate-900"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Próximas clases
        </h2>
        <div
          className="text-sm text-slate-500"
          aria-live="polite"
          aria-atomic="true"
        >
          Zona horaria actual: {timeStr} ({offsetStr}, {tz})
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((it, i) => (
          <li
            key={i}
            className="border border-slate-200 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 focus-within:ring-2 focus-within:ring-sky-500"
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate("/course", {
                state: { openTab: "classroom", classTitle: it.title },
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/course", {
                  state: { openTab: "classroom", classTitle: it.title },
                });
              }
            }}
            aria-label={`Abrir salón de clases de ${it.title}`}
          >
            <span className={`w-2 h-2 rounded-full ${it.color}`} aria-hidden />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{it.title}</p>
              <p className="text-xs text-slate-600">{it.when}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
