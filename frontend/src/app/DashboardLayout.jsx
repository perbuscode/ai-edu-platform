// src/app/DashboardLayout.jsx
import React, { useEffect, useState, useMemo } from "react";
import { SiYoutube, SiTiktok, SiFacebook, SiLinkedin } from "react-icons/si";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ links, activeId, onLinkClick, children, title }) {
  // Global smooth scrolling for anchor navigation
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = prev; };
  }, []);

  // Collapsible sidebar state
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("dashboard:sidebar:collapsed") === "1";
    } catch {
      return false;
    }
  });
  // Match widths in ../components/Sidebar.jsx (collapsed: w-10, expanded: w-56)
  const leftOffsetClass = useMemo(() => (collapsed ? "left-10" : "left-56"), [collapsed]);
  useEffect(() => {
    try { localStorage.setItem("dashboard:sidebar:collapsed", collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);

  const contentPadClass = useMemo(() => (collapsed ? "pl-10" : "pl-56"), [collapsed]);

  return (
    <div className="text-slate-100 bg-slate-900 min-h-screen">
      {/* Sidebar fixed */}
      <Sidebar links={links} activeId={activeId} onLinkClick={onLinkClick} collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Topbar fixed with left offset */}
      <Topbar leftOffsetClass={leftOffsetClass} title={title} />

      {/* Content area with left padding for sidebar and top padding for header */}
      <main className={`${contentPadClass} pt-16 relative transition-all duration-300 ease-in-out`}>
        <div className="max-w-7xl mx-auto px-5 py-8 md:py-10 space-y-10">
          {children}
        </div>
      </main>

      <footer className={`${contentPadClass} mt-10 py-8 transition-all duration-300 ease-in-out bg-transparent`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm">
              <p className="text-slate-300">Edvance impulsando el aprendizaje con inteligencia artificial.</p>
              <p className="text-slate-400 mt-1">&copy; 2025 AI EdTech. Todos los derechos reservados.</p>
            </div>
          <div className="flex items-center gap-4 text-slate-300">
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube (abre en una pestaña nueva)" title="YouTube" className="hover:text-white">
                <SiYoutube size={20} aria-hidden />
              </a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok (abre en una pestaña nueva)" title="TikTok" className="hover:text-white">
                <SiTiktok size={20} aria-hidden />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook (abre en una pestaña nueva)" title="Facebook" className="hover:text-white">
                <SiFacebook size={20} aria-hidden />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (abre en una pestaña nueva)" title="LinkedIn" className="hover:text-white">
                <SiLinkedin size={20} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
