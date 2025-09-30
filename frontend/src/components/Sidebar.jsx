import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockCertifications } from "../data/certifications.mock";
import {
  ChevronFirst,
  ChevronLast,
  Home,
  BookOpen,
  Map,
  Briefcase,
  Bot,
  Sparkles,
  LayoutDashboard,
  Award,
} from "lucide-react";

// Sidebar fijo estilo maqueta (w-64). Usa clase 'nav-active' para el enlace activo.
export default function Sidebar({
  links = [],
  activeId,
  onLinkClick,
  collapsed = false,
  onToggle,
  certifications = mockCertifications,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showCerts = pathname === "/dashboard";
  const iconFor = (href = "", label = "") => {
    const key = (href || "").replace("#", "");
    switch (key) {
      case "intro":
        return <Home size={18} aria-hidden />;
      case "cursos":
        return <BookOpen size={18} aria-hidden />;
      case "mapa":
        return <Map size={18} aria-hidden />;
      case "empleo":
        return <Briefcase size={18} aria-hidden />;
      case "tutor":
        return <Bot size={18} aria-hidden />;
      case "copilot":
        return <Sparkles size={18} aria-hidden />;
      default:
        return <LayoutDashboard size={18} aria-hidden />;
    }
  };
  // Oculta botones de navegación específicos sin alterar el flujo del layout
  const HIDDEN_KEYS = new Set(["tutor", "copilot"]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 ${collapsed ? "w-10" : "w-56"} bg-slate-900/80 border-r border-white/10 backdrop-blur z-40 transition-[width] duration-300 ease-in-out overflow-hidden flex flex-col`}
    >
      <div
        className={`border-b border-white/10 ${collapsed ? "h-16 grid place-items-center px-0" : "h-16 relative flex items-center justify-end px-3"}`}
      >
        {!collapsed && (
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/80 rounded-md"
            aria-label="Ir al landing de Edvance"
          >
            <img
              src="/images/logo-edvance.png"
              alt="Edvance"
              className="h-20 md:h-30 w-auto"
            />
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-white/10 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/80"
          aria-label={collapsed ? "Expandir navegación" : "Contraer navegación"}
          title={collapsed ? "Expandir navegación" : "Contraer navegación"}
        >
          {collapsed ? (
            <ChevronLast size={16} aria-hidden />
          ) : (
            <ChevronFirst size={16} aria-hidden />
          )}
        </button>
      </div>

      <nav
        id="sideNav"
        aria-label="Navegación principal del panel"
        className="p-2"
      >
        <ul className="space-y-1 text-sm">
          {links
            .filter(
              (link) => !HIDDEN_KEYS.has((link?.href || "").replace("#", ""))
            )
            .map((link) => {
              const key = (link?.href || "").replace("#", "");
              const isActive = activeId === key;
              const layoutClasses = collapsed
                ? "justify-center px-0 py-3"
                : "justify-start items-center gap-1.5 px-3 py-2 sm:gap-2";
              const baseClasses = `w-full flex ${layoutClasses} rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/60 ${collapsed ? "" : "overflow-hidden whitespace-nowrap"}`;
              const activeClass = isActive ? "nav-active" : "hover:bg-white/10";
              const iconWrapperClass = `inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-200 ${collapsed ? "" : "bg-white/5"}`;

              return (
                <li key={link.href}>
                  <button
                    type="button"
                    className={`${baseClasses} ${activeClass}`}
                    title={link.label}
                    onClick={() => onLinkClick?.(link.href)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={iconWrapperClass}>
                      {iconFor(link.href, link.label)}
                    </span>
                    {collapsed ? (
                      <span className="sr-only">{link.label}</span>
                    ) : (
                      <span className="flex-1 min-w-0 truncate text-left">
                        {link.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Sección: Certificaciones (anclada abajo) */}
      <div className="mt-auto">
        {showCerts && !collapsed && (
          <div className="px-4 pb-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Certificaciones
              </h4>
              {certifications.length > 0 && (
                <span className="text-xs text-slate-400 font-medium">
                  {certifications.length} obtenida
                  {certifications.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
            {certifications.length > 0 ? (
              <>
                <ul className="space-y-1">
                  {certifications.slice(0, 2).map((cert) => (
                    <li
                      key={cert.id}
                      className="flex items-center gap-2 text-[13px] text-slate-300/90"
                      title={`${cert.name} (${new Date(cert.date).getFullYear()})`}
                    >
                      <Award size={14} className="text-emerald-400 shrink-0" />
                      <span className="flex-1 leading-5 whitespace-nowrap truncate">{`${cert.name} (${new Date(cert.date).getFullYear()})`}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="w-full mt-1 px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-200 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/70"
                  onClick={() => navigate("/dashboard/certificaciones")}
                >
                  Ver todas
                </button>
              </>
            ) : (
              <button
                type="button"
                className="w-full mt-1 px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/70"
                onClick={() => navigate("/dashboard/certificaciones")}
              >
                Ver certificaciones
              </button>
            )}
          </div>
        )}
        {showCerts && collapsed && (
          <div className="px-2 pb-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/certificaciones")}
              className="w-full flex justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/80"
              aria-label="Ver certificaciones"
              title="Ver certificaciones"
            >
              <span className="w-8 h-8 grid place-items-center rounded-full bg-brand-secondary/25 text-brand-secondary shadow-lg">
                <Award size={18} aria-hidden />
              </span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
