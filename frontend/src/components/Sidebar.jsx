import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LuChevronFirst, LuChevronLast, LuHouse, LuBookOpen, LuMap, LuBriefcase, LuBot, LuSparkles, LuLayoutDashboard } from "react-icons/lu";

// Sidebar fijo estilo maqueta (w-64). Usa clase 'nav-active' para el enlace activo.
export default function Sidebar({ links = [], activeId, onLinkClick, collapsed = false, onToggle }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showCerts = pathname === '/dashboard';
  const iconFor = (href = '', label = '') => {
    const key = (href || '').replace('#','');
    switch (key) {
      case 'intro': return <LuHouse size={18} aria-hidden />;
      case 'cursos': return <LuBookOpen size={18} aria-hidden />;
      case 'mapa': return <LuMap size={18} aria-hidden />;
      case 'empleo': return <LuBriefcase size={18} aria-hidden />;
      case 'tutor': return <LuBot size={18} aria-hidden />;
      case 'copilot': return <LuSparkles size={18} aria-hidden />;
      default: return <LuLayoutDashboard size={18} aria-hidden />;
    }
  };
  // Oculta botones de navegación específicos sin alterar el flujo del layout
  const HIDDEN_KEYS = new Set(["tutor", "copilot"]);

  return (
    <aside className={`fixed inset-y-0 left-0 ${collapsed ? 'w-16' : 'w-64'} bg-slate-900/80 border-r border-white/10 backdrop-blur z-40 transition-[width] duration-300 ease-in-out overflow-hidden`}>
      <div className={`h-16 border-b border-white/10 ${collapsed ? 'grid place-items-center px-0' : 'flex items-center justify-between px-3'}`}>
        {!collapsed && (
          <span className="text-sm font-semibold">AI Edu Platform</span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-white/10 text-slate-200"
          aria-label={collapsed ? 'Expandir navegación' : 'Contraer navegación'}
          title={collapsed ? 'Expandir navegación' : 'Contraer navegación'}
        >
          {collapsed ? <LuChevronLast size={16} aria-hidden /> : <LuChevronFirst size={16} aria-hidden />}
        </button>
      </div>

      <nav id="sideNav" className="p-2 space-y-1 text-sm">
        {links.map((l) => {
          const key = (l?.href || '').replace('#', '');
          const isActive = activeId === key;
          const base = `flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded hover:bg-white/10 overflow-hidden whitespace-nowrap`;
          const active = isActive ? "nav-active" : "";
          const shouldHide = HIDDEN_KEYS.has(key);

          if (shouldHide) {
            // Mantiene el espacio en el layout pero oculta el contenido e interacciones
            return (
              <div
                key={l.href}
                aria-hidden
                className={`${base} ${collapsed ? '' : ''} invisible`}
              >
                <span className="w-5 h-5" />
                {!collapsed && <span className="ml-2">&nbsp;</span>}
              </div>
            );
          }

          return (
            <a
              key={l.href}
              href={l.href}
              className={`${base} ${active}`}
              title={l.label}
              onClick={(e) => {
                e.preventDefault();
                onLinkClick?.(l.href);
              }}
            >
              <span className="w-5 h-5 grid place-items-center text-slate-200">{iconFor(l.href, l.label)}</span>
              {!collapsed && <span className="ml-2">{l.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Sección: Certificaciones (solo en Dashboard) */}
      {showCerts && !collapsed && (
        <div className="px-4 mt-20 md:mt-36 lg:mt-52">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Certificaciones</h4>
          <ul className="space-y-1">
            {[
              "React Avanzado (2025)",
              "Power BI Profesional (2025)",
              "Fundamentos de Scrum (2024)",
            ].map((txt, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-slate-300/90">
                <span className="mt-0.5 inline-flex w-4 h-4 rounded bg-emerald-500/20 text-emerald-300 items-center justify-center" aria-hidden>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                </span>
                <span className="flex-1 leading-5">{txt}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <a
              href="/dashboard/certificaciones"
              className="inline-block px-2.5 py-1.5 rounded bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs"
              onClick={(e) => { e.preventDefault(); navigate('/dashboard/certificaciones'); }}
            >
              Ver todas
            </a>
          </div>
        </div>
      )}
      
    </aside>
  );
}
