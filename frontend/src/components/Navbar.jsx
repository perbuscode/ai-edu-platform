// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { useToast } from "./Toast";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("login");
  const [faqOpen, setFaqOpen] = useState(false);
  const [faqFaqOpen, setFaqFaqOpen] = useState(true);
  const [faqMobileOpen, setFaqMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Cerrar menú ¿Dudas? con ESC / click afuera
  const faqRef = useRef(null);
  useEffect(() => {
    if (!faqOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setFaqOpen(false); };
    const onClick = (e) => { if (faqRef.current && !faqRef.current.contains(e.target)) setFaqOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onClick); };
  }, [faqOpen]);

  async function handleLogout() {
    await logout();
    toast.success("Sesión cerrada");
    navigate("/");
  }

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[80] bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <a href="#inicio" className="flex items-center gap-3 text-white">
            <img src="/images/logo-edvance.png" alt="Logo Edvance" className="h-20 md:h-30 w-auto" />
            <span className="font-semibold tracking-tight text-[15px] sm:text-base">Educación de avanzada</span>
          </a>

          {/* Desktop links centrados */}
          <div className="hidden md:flex items-center gap-6 md:absolute md:left-1/2 md:-translate-x-1/2">
            <a href="#cursos" className="text-slate-200 hover:text-white text-[15px] sm:text-base font-medium">Cursos</a>
            <a href="#historias" className="text-slate-200 hover:text-white text-[15px] sm:text-base font-medium">Historias</a>
            <a href="#plan" className="text-slate-200 hover:text-white text-[15px] sm:text-base font-medium">Plan</a>
            <a href="#blog" className="text-slate-200 hover:text-white text-[15px] sm:text-base font-medium">Blog</a>
          </div>

          {/* Acciones derechas */}
          <div className="hidden md:flex items-center gap-3">
            {/* Menú ¿Dudas? */}
            <div
              ref={faqRef}
              className="relative hidden"
              onMouseEnter={() => { if (window.__dudasClose) clearTimeout(window.__dudasClose); setFaqOpen(true); }}
              onMouseLeave={() => { if (window.__dudasClose) clearTimeout(window.__dudasClose); window.__dudasClose = setTimeout(() => setFaqOpen(false), 200); }}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white text-sm"
                aria-haspopup="menu"
                aria-expanded={faqOpen || undefined}
                aria-controls="menu-dudas"
                onClick={() => setFaqOpen((v) => !v)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFaqOpen((v)=>!v);} if (e.key === 'Escape') setFaqOpen(false); }}
              >
                ¿Dudas?
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <div
                id="menu-dudas"
                role="menu"
                aria-hidden={!faqOpen || undefined}
                className={`absolute right-0 mt-2 w-[320px] rounded-xl bg-white shadow-2xl border border-slate-200 p-2 text-slate-800 origin-top-right transform-gpu transition-all duration-200 ease-out ${faqOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'}`}
              >
                <button
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between"
                  onClick={() => setFaqFaqOpen((v)=>!v)}
                  onKeyDown={(e)=>{ if (e.key==='Escape') setFaqOpen(false);} }
                  aria-expanded={faqFaqOpen || undefined}
                  aria-controls="submenu-faqs"
                >
                  <span className="font-medium">Preguntas frecuentes</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={faqFaqOpen?"rotate-180 transition-transform":"transition-transform"}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
                {faqFaqOpen && (
                  <div id="submenu-faqs" className="px-2 py-1 text-sm text-slate-600 space-y-1">
                    <div>¿El plan es genérico? — No, se adapta.</div>
                    <div>¿El certificado sirve? — Portfolio + certificado.</div>
                    <div>¿Y si me estanco? — Tutoría y ajustes.</div>
                    <Link to="/faqs" className="text-sky-600 hover:underline inline-block mt-1">Ver más</Link>
                  </div>
                )}
                <Link to="/pqr" className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">Peticiones, quejas o reclamos</Link>
                <Link to="/contacto" className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">Contactar con un agente</Link>
              </div>
            </div>

            {!user && (
              <>
                <button
                  onClick={() => { setDefaultTab("login"); setAuthOpen(true); }}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-full text-sm text-slate-200 border border-white/10 hover:text-white hover:bg-white/10"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => { setDefaultTab("register"); setAuthOpen(true); }}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-full text-sm text-white bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 shadow-md shadow-sky-500/20"
                >
                  Registrarse
                </button>
              </>
            )}
            {user && (
              <UserMenu
                user={user}
                avatarSize={32}
                items={[
                  { type: 'link', to: '/dashboard', label: 'Dashboard' },
                  { type: 'button', label: 'Cerrar sesión', onClick: handleLogout },
                ]}
              />
            )}

            {/* Menú ¿Dudas? — después de Registrarse o del avatar */}
            <div
              ref={faqRef}
              className="relative"
              onMouseEnter={() => { if (window.__dudasClose) clearTimeout(window.__dudasClose); setFaqOpen(true); }}
              onMouseLeave={() => { if (window.__dudasClose) clearTimeout(window.__dudasClose); window.__dudasClose = setTimeout(() => setFaqOpen(false), 200); }}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white text-sm"
                aria-haspopup="menu"
                aria-expanded={faqOpen || undefined}
                aria-controls="menu-dudas"
                onClick={() => setFaqOpen((v) => !v)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFaqOpen((v)=>!v);} if (e.key === 'Escape') setFaqOpen(false); }}
              >
                ¿Dudas?
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <div
                id="menu-dudas"
                role="menu"
                aria-hidden={!faqOpen || undefined}
                className={`absolute right-0 mt-2 w-[320px] rounded-xl bg-white shadow-2xl border border-slate-200 p-2 text-slate-800 origin-top-right transform-gpu transition-all duration-200 ease-out ${faqOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'}`}
              >
                <button
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between"
                  onClick={() => setFaqFaqOpen((v)=>!v)}
                  onKeyDown={(e)=>{ if (e.key==='Escape') setFaqOpen(false);} }
                  aria-expanded={faqFaqOpen || undefined}
                  aria-controls="submenu-faqs"
                >
                  <span className="font-medium">Preguntas frecuentes</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={faqFaqOpen?"rotate-180 transition-transform":"transition-transform"}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
                {faqFaqOpen && (
                  <div id="submenu-faqs" className="px-2 py-1 text-sm text-slate-600 space-y-1">
                    <div>¿El plan es genérico? — No, se adapta.</div>
                    <div>¿El certificado sirve? — Portfolio + certificado.</div>
                    <div>¿Y si me estanco? — Tutoría y ajustes.</div>
                    <Link to="/faqs" className="text-sky-600 hover:underline inline-block mt-1">Ver más</Link>
                  </div>
                )}
                <Link to="/pqr" className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">Peticiones, quejas o reclamos</Link>
                <Link to="/contacto" className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700">Contactar con un agente</Link>
              </div>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-200 hover:bg-white/10 border border-white/10"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur">
            <div className="px-4 py-3 space-y-2">
              <a href="#cursos" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm">Cursos</a>
              <a href="#historias" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm">Historias</a>
              <a href="#plan" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm">Plan</a>
              <a href="#blog" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm">Blog</a>
              {/* ¿Dudas? en mobile */}
              <button
                onClick={() => setFaqMobileOpen((v)=>!v)}
                className="w-full text-left text-slate-200 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10"
                aria-expanded={faqMobileOpen || undefined}
                aria-controls="mobile-dudas"
              >
                ¿Dudas?
              </button>
              {faqMobileOpen && (
                <div id="mobile-dudas" className="pl-3 space-y-1">
                  <details className="group">
                    <summary className="text-slate-300 text-sm cursor-pointer select-none list-none">Preguntas frecuentes</summary>
                    <div className="mt-1 ml-2 text-xs text-slate-400 space-y-1">
                      <div>¿El plan es genérico? — No, se adapta.</div>
                      <div>¿El certificado sirve? — Portfolio + certificado.</div>
                      <div>¿Y si me estanco? — Tutoría y ajustes.</div>
                      <Link to="/faqs" onClick={()=>setMobileOpen(false)} className="text-sky-400 hover:underline inline-block mt-1">Ver más</Link>
                    </div>
                  </details>
                  <Link to="/pqr" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10">Peticiones, quejas o reclamos</Link>
                  <Link to="/contacto" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10">Contactar con un agente</Link>
                </div>
              )}
              {!user ? (
                <div className="pt-2 flex gap-2">
                  <button onClick={() => { setDefaultTab("login"); setAuthOpen(true); setMobileOpen(false); }} className="flex-1 text-slate-200 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10">Iniciar sesión</button>
                  <button onClick={() => { setDefaultTab("register"); setAuthOpen(true); setMobileOpen(false); }} className="flex-1 text-white text-sm px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700">Registrarse</button>
                </div>
              ) : (
                <div className="pt-2 flex flex-col gap-1">
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10">Dashboard</Link>
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="text-left text-slate-200 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10">Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={defaultTab} />
    </>
  );
}
