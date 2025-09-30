// src/app/DashboardLayout.jsx
import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import AssistantSidebar from "../components/AssistantSidebar";

export default function DashboardLayout({
  links,
  activeId,
  onLinkClick,
  children,
  title,
}) {
  // Global smooth scrolling for anchor navigation
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
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
  const leftOffsetClass = useMemo(
    () => (collapsed ? "left-10" : "left-56"),
    [collapsed]
  );
  useEffect(() => {
    try {
      localStorage.setItem(
        "dashboard:sidebar:collapsed",
        collapsed ? "1" : "0"
      );
    } catch (_error) {
      // noop
    }
  }, [collapsed]);

  const contentPadClass = useMemo(
    () => (collapsed ? "pl-10" : "pl-56"),
    [collapsed]
  );

  return (
    <div className="text-slate-100 bg-slate-900 min-h-screen flex flex-col">
      {/* Sidebar fixed */}
      <Sidebar
        links={links}
        activeId={activeId}
        onLinkClick={onLinkClick}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />

      {/* Topbar fixed with left offset */}
      <Topbar leftOffsetClass={leftOffsetClass} title={title} />

      {/* Content area with left padding for sidebar and top padding for header */}
      <main
        className={`${contentPadClass} pt-16 relative transition-all duration-300 ease-in-out flex-1`}
      >
        <div className="max-w-7xl mx-auto px-5 py-8 md:py-10 space-y-10">
          {children}
        </div>
      </main>

      <Footer className={contentPadClass} />

      {/* El Asistente IA es parte del layout del dashboard */}
      <AssistantSidebar />
    </div>
  );
}
