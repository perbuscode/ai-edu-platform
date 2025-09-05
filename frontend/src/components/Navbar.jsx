// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { useToast } from "./Toast";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("login");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    toast.success("Sesión cerrada");
    navigate("/");
  }

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[80] bg-slate-900/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <a href="#inicio" className="flex items-center gap-2 text-white font-semibold">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-500" />
            AI Edu Platform
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#cursos" className="text-slate-200 hover:text-white text-sm">Cursos</a>
            <a href="#plan" className="text-slate-200 hover:text-white text-sm">Plan</a>
            <a href="#contacto" className="text-slate-200 hover:text-white text-sm">Contacto</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!user && (
              <>
                <button
                  onClick={() => { setDefaultTab("login"); setAuthOpen(true); }}
                  className="text-slate-200 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => { setDefaultTab("register"); setAuthOpen(true); }}
                  className="text-white text-sm px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700"
                >
                  Registrarse
                </button>
              </>
            )}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 text-slate-200 hover:text-white"
                  aria-expanded={menuOpen || undefined}
                  aria-haspopup="menu"
                >
                  <Avatar displayName={user.displayName} email={user.email} photoURL={user.photoURL} />
                  <span className="hidden lg:inline text-sm">{user.displayName || user.email}</span>
                </button>
                {menuOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow border border-slate-200 py-1">
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Cerrar sesión</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-200 hover:bg-white/10"
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
              <a href="#plan" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm">Plan</a>
              <a href="#contacto" onClick={()=>setMobileOpen(false)} className="block text-slate-200 hover:text-white text-sm">Contacto</a>
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

function Avatar({ displayName, email, photoURL, size = 28 }) {
  const initial = (displayName || email || "?").trim().charAt(0).toUpperCase();
  if (photoURL) {
    return <img src={photoURL} alt={displayName || email || "Foto de perfil"} className="rounded-full" style={{ width: size, height: size }} />;
  }
  return (
    <div aria-hidden className="rounded-full bg-slate-200 text-slate-700 grid place-items-center font-semibold" style={{ width: size, height: size }}>
      {initial}
    </div>
  );
}

