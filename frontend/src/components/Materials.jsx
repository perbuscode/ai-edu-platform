// frontend/src/components/Materials.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  mockMaterials,
  markMaterialDownloaded,
  markMaterialSeen,
} from "../data/materials.mock";

function TypeIcon({ type }) {
  const cls = "w-5 h-5";
  if (type === "pdf") {
    return (
      <svg
        className={cls}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 3h6l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
        />
        <text x="9" y="17" fontSize="7" fill="currentColor">
          PDF
        </text>
      </svg>
    );
  }
  if (type === "zip") {
    return (
      <svg
        className={cls}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 3h10a2 2 0 012 2v15a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
        />
        <text x="8.5" y="16.5" fontSize="7" fill="currentColor">
          ZIP
        </text>
      </svg>
    );
  }
  // mp4 / video
  return (
    <svg
      className={cls}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
      <polygon points="10,9 16,12 10,15" fill="currentColor" />
    </svg>
  );
}

function StatusBadge({ visto, descargado }) {
  if (descargado) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
        aria-label="Descargado"
      >
        ✅ Descargado
      </span>
    );
  }
  if (visto) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        aria-label="Visto"
      >
        👁️ Visto
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300"
      aria-label="Pendiente"
    >
      Pendiente
    </span>
  );
}

export default function Materials({ items: itemsProp = null, className = "" }) {
  const [items, setItems] = useState(() => itemsProp || mockMaterials);

  useEffect(() => {
    if (itemsProp) setItems(itemsProp);
  }, [itemsProp]);

  const hasItems = useMemo(
    () => Array.isArray(items) && items.length > 0,
    [items]
  );

  function handleView(id) {
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, visto: true } : m))
    );
    try {
      markMaterialSeen(id);
    } catch (_error) {
      // noop
    }
    try {
      alert("Abriendo visor… (simulado)");
    } catch (_error) {
      // noop
    }
  }

  function handleDownload(id) {
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, descargado: true } : m))
    );
    try {
      markMaterialDownloaded(id);
    } catch (_error) {
      // noop
    }
    try {
      alert("Iniciando descarga… (simulado)");
    } catch (_error) {
      // noop
    }
  }

  return (
    <section
      className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 ${className}`}
      aria-labelledby="materials-title"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 id="materials-title" className="text-base font-semibold">
          Materiales de la clase
        </h3>
      </div>

      {!hasItems && (
        <div
          className="rounded-lg border border-dashed border-gray-300 dark:border-slate-700 p-6 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="text-2xl mb-1" aria-hidden>
            📦
          </div>
          <p className="text-sm text-gray-700 dark:text-slate-300">
            No hay materiales disponibles por ahora.
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Vuelve más tarde: aquí aparecerán PDFs, ZIPs o videos.
          </p>
        </div>
      )}

      {hasItems && (
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-slate-800"
        >
          {items.map((m) => (
            <li
              key={m.id}
              role="listitem"
              className="py-3 flex items-start gap-3"
            >
              <div
                className="shrink-0 text-gray-700 dark:text-slate-300 mt-0.5"
                aria-hidden
              >
                <TypeIcon type={m.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium leading-5 truncate">
                    {m.title}
                  </p>
                  <StatusBadge visto={m.visto} descargado={m.descargado} />
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  {m.type.toUpperCase()} • {m.size}
                  {m.duration ? ` • ${m.duration}` : ""}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {(m.type === "pdf" || m.type === "mp4") && (
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      onClick={() => handleView(m.id)}
                      aria-label={`Ver ${m.title}`}
                    >
                      Ver
                    </button>
                  )}
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    onClick={() => handleDownload(m.id)}
                    aria-label={`Descargar ${m.title}`}
                  >
                    Descargar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
