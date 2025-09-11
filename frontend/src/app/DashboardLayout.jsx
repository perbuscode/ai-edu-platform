// src/app/DashboardLayout.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ links, activeId, onLinkClick, children }) {
  // Global smooth scrolling for anchor navigation
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = prev; };
  }, []);

  // Collapsible sidebar state
  const [collapsed, setCollapsed] = useState(false);
  const leftOffsetClass = useMemo(() => (collapsed ? "left-16" : "left-64"), [collapsed]);
  const contentPadClass = useMemo(() => (collapsed ? "pl-16" : "pl-64"), [collapsed]);

  return (
    <div className="text-slate-100 bg-slate-900 min-h-screen">
      {/* Sidebar fixed */}
      <Sidebar links={links} activeId={activeId} onLinkClick={onLinkClick} collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Topbar fixed with left offset */}
      <Topbar leftOffsetClass={leftOffsetClass} onToggleSidebar={() => setCollapsed((v) => !v)} collapsed={collapsed} />

      {/* Content area with left padding for sidebar and top padding for header */}
      <main className={`${contentPadClass} pt-16 transition-all duration-300 ease-in-out`}>
        <div className="max-w-7xl mx-auto px-5 py-8 md:py-10 space-y-10">
          {children}
        </div>
      </main>

      <footer className={`${contentPadClass} mt-10 py-8 text-center text-sm text-slate-400 transition-all duration-300 ease-in-out`}>
        2025 Plataforma AI Edu
      </footer>
    </div>
  );
}

