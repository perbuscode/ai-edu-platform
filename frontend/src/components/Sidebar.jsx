import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LuChevronFirst, LuChevronLast, LuHouse, LuBookOpen, LuMap, LuBriefcase, LuBot, LuSparkles, LuLayoutDashboard, LuAward } from "react-icons/lu";

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
    <aside className={`fixed inset-y-0 left-0 ${collapsed ? 'w-10' : 'w-56'} bg-slate-900/80 border-r border-white/10 backdrop-blur z-40 transition-[width] duration-300 ease-in-out overflow-hidden flex flex-col`}>
      <div className={`border-b border-white/10 ${collapsed ? 'h-16 grid place-items-center px-0' : 'h-16 relative flex items-center justify-end px-3'}`}>
        {!collapsed && (
          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/80 rounded-md"
            aria-label="Ir al landing de Edvance"
          >
            <img src="/images/logo-edvance.png" alt="Edvance" className="h-20 md:h-30 w-auto" />
          </button>
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
          const layoutClasses = collapsed ? 'justify-center px-0 py-3' : 'justify-start items-center gap-1.5 px-2 py-2 sm:gap-2 sm:px-3';
          const baseClasses = `w-full flex items-center ${layoutClasses} rounded hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 ${collapsed ? '' : 'overflow-hidden whitespace-nowrap'}`;
          const activeClass = isActive ? "nav-active" : "";
          const iconWrapperClass = `inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-200 ${collapsed ? '' : 'bg-white/5'}`;
          const shouldHide = HIDDEN_KEYS.has(key);

          if (shouldHide) {
            return (
              <div
                key={l.href}
                aria-hidden
                className={`${baseClasses} opacity-0 pointer-events-none`}
              >
                <span className={iconWrapperClass} aria-hidden />
                {!collapsed && <span className="flex-1 min-w-0 text-left">&nbsp;</span>}
              </div>
            );
          }

          return (
            <a
              key={l.href}
              href={l.href}
              className={`${baseClasses} ${activeClass}`}
              title={l.label}
              onClick={(e) => {
                e.preventDefault();
                onLinkClick?.(l.href);
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={iconWrapperClass}>{iconFor(l.href, l.label)}</span>
              {collapsed ? (
                <span className="sr-only">{l.label}</span>
              ) : (
                <span className="flex-1 min-w-0 truncate text-left">{l.label}</span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Sección: Certificaciones (solo en Dashboard) */}
      {showCerts && !collapsed && (
        <div className="px-4 mt-10 md:mt-20 lg:mt-28">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Certificaciones</h4>
          <ul className="space-y-1">
            {[
              "React Avanzado (2025)",
              "Power BI Profesional (2025)",
              "Fundamentos de Scrum (2024)",
            ].map((txt, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-slate-300/90">
                <span className="mt-0.5 inline-flex w-5 h-5 shrink-0 rounded bg-emerald-500/20 text-emerald-300 items-center justify-center" aria-hidden>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                </span>
                <span className="flex-1 leading-5 whitespace-nowrap">{txt}</span>
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
      {showCerts && collapsed && (
        <div className="mt-auto px-2 pb-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/certificaciones')}
            className="w-full flex justify-center"
            aria-label="Ver certificaciones"
            title="Ver certificaciones"
          >
            <span className="w-8 h-8 grid place-items-center rounded-full bg-sky-500/25 text-sky-200 shadow-lg">
              <LuAward size={18} aria-hidden />
            </span>
          </button>
        </div>
      )}

    </aside>
  );
}
