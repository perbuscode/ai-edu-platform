// src/components/Topbar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu";

export default function Topbar({
  leftOffsetClass = "left-64",
  showLogo = false,
  title,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const computedTitle = useMemo(() => {
    if (title) return title;
    const rawPath = location.pathname || "";
    const pathname =
      rawPath.length > 1 && rawPath.endsWith("/")
        ? rawPath.slice(0, -1)
        : rawPath;
    if (pathname === "/dashboard") return "Dashboard del estudiante";
    if (pathname.startsWith("/dashboard/salon-virtual"))
      return "Salón de clases";
    if (pathname.startsWith("/dashboard/certificaciones"))
      return "Certificaciones";
    if (pathname.startsWith("/dashboard/portafolio")) return "Portafolio";
    if (pathname.startsWith("/dashboard")) return "Panel del estudiante";
    return "Tutor IA";
  }, [location.pathname, title]);

  const [faqOpen, setFaqOpen] = useState(false);
  const [faqFaqOpen, setFaqFaqOpen] = useState(true);
  const faqRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setFaqOpen(false);
    }
    function onClick(e) {
      if (faqRef.current && !faqRef.current.contains(e.target))
        setFaqOpen(false);
    }
    if (faqOpen) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClick);
      return () => {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("mousedown", onClick);
      };
    }
  }, [faqOpen]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header
      className={`fixed ${leftOffsetClass} right-0 top-0 h-16 bg-slate-900/60 border-b border-white/10 backdrop-blur z-30 flex items-center transition-[left] duration-300 ease-in-out`}
    >
      <div className="max-w-7xl mx-auto w-full px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showLogo && (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 rounded-md"
              aria-label="Ir al landing de Edvance"
            >
              <img
                src="/images/logo-edvance.png"
                alt="Edvance"
                className="h-20 md:h-30 w-auto"
              />
            </button>
          )}
          <h1 className="text-base md:text-lg font-semibold">
            {computedTitle}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <UserMenu
                user={user}
                avatarSize={28}
                items={[
                  {
                    type: "link",
                    to: "/profile?tab=settings",
                    label: "Configuración",
                  },
                  {
                    type: "button",
                    label: "Cerrar sesión",
                    onClick: handleLogout,
                  },
                ]}
              />
              {/* Botón Dudas después del avatar */}
              <div
                ref={faqRef}
                className="relative"
                onMouseEnter={() => {
                  if (window.__dudasClose) clearTimeout(window.__dudasClose);
                  setFaqOpen(true);
                }}
                onMouseLeave={() => {
                  if (window.__dudasClose) clearTimeout(window.__dudasClose);
                  window.__dudasClose = setTimeout(
                    () => setFaqOpen(false),
                    200
                  );
                }}
              >
                <button
                  type="button"
                  aria-label="Dudas"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 text-[0]"
                  aria-haspopup="menu"
                  aria-expanded={faqOpen || undefined}
                  aria-controls="menu-dudas"
                  onClick={() => setFaqOpen((v) => !v)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M9.09 9a3 3 0 115.82 1c0 2-3 2-3 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                  </svg>
                </button>
                <div
                  id="menu-dudas"
                  role="menu"
                  aria-hidden={!faqOpen || undefined}
                  className={`absolute right-0 mt-2 w-[320px] rounded-xl bg-white shadow-2xl border border-slate-200 p-2 text-slate-800 origin-top-right transform-gpu transition-all duration-200 ease-out ${faqOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-1 scale-95 pointer-events-none"}`}
                >
                  <button
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-sm text-slate-700"
                    onClick={() => setFaqFaqOpen((v) => !v)}
                    aria-expanded={faqFaqOpen || undefined}
                    aria-controls="submenu-faqs"
                  >
                    <span className="font-medium">Preguntas frecuentes</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className={
                        faqFaqOpen
                          ? "rotate-180 transition-transform"
                          : "transition-transform"
                      }
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  {faqFaqOpen && (
                    <div
                      id="submenu-faqs"
                      className="px-3 py-1 text-sm text-slate-600 space-y-1"
                    >
                      <div>¿El plan es genérico? — No, se adapta.</div>
                      <div>
                        ¿El certificado sirve? — Portfolio + certificado.
                      </div>
                      <div>¿Y si me estanco? — Tutoría y ajustes.</div>
                      <Link
                        to="/faqs"
                        className="text-sky-600 hover:underline inline-block mt-1"
                      >
                        Ver más
                      </Link>
                    </div>
                  )}
                  <Link
                    to="/pqr"
                    className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700"
                  >
                    Peticiones, quejas o reclamos
                  </Link>
                  <Link
                    to="/contacto"
                    className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700"
                  >
                    Contactar con un agente
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
