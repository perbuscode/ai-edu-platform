// src/components/dashboard/Sidebar.jsx
import React from "react";

export default function Sidebar({ brand = { title: "EduLearn", subtitle: "Dashboard" }, items = [], active, onSelect, mode = "hidden", onExpand, onCollapse, onBack }) {
  const isHidden = mode === "hidden";
  const isCollapsed = mode === "collapsed";
  const isExpanded = mode === "expanded";
  if (isHidden) return null;

  return (
    <aside className={`fixed top-0 left-0 h-screen ${isCollapsed ? "w-12" : "w-64"} bg-white shadow-lg z-40 border-r border-gray-200 overflow-y-auto dark:bg-slate-900 dark:border-slate-800 transition-[width] duration-200`} aria-label="Navegación del curso">
      <div className="p-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
        {isCollapsed ? (
          <button onClick={onExpand} className="p-1.5 rounded-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800" aria-label="Mostrar navegación">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h12M4 12h16M4 18h12"/></svg>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-md grid place-items-center"><span className="text-white font-bold text-sm">AE</span></div>
            <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">{brand.title}</span>
          </div>
        )}
        {isExpanded && (
          <button onClick={onCollapse} className="p-1.5 rounded-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800" aria-label="Ocultar navegación">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {isExpanded && (
        <>
          <nav className="mt-4" aria-label="Navegación">
            <div className="px-4 mb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navegación</h3>
            </div>
            <ul className="space-y-0.5">
              {items.map((it) => {
                const isActive = active === it.key;
                const base = "flex items-center w-full text-left px-4 py-2 text-sm rounded-md border";
                const classes = isActive
                  ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                  : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800";
                return (
                  <li key={it.key} className="px-2">
                    <button type="button" onClick={() => onSelect?.(it.key)} className={`${base} ${classes}`} aria-current={isActive ? "page" : undefined}>
                      {it.icon ? <span className="w-5 h-5 mr-3" aria-hidden>{it.icon}</span> : null}
                      {it.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="px-2 py-3 border-t border-gray-200 dark:border-slate-800 mt-3">
            <button onClick={onBack} className="w-full text-left px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100">← Volver al Dashboard</button>
          </div>
        </>
      )}
    </aside>
  );
}

