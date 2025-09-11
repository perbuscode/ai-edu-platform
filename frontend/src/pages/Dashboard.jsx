// src/pages/Dashboard.jsx
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../app/DashboardLayout";
import useActiveSection from "../app/useActiveSection";

import Intro from "../sections/Intro";
import Courses from "../sections/Courses";
import Metrics from "../sections/Metrics";
import NextClasses from "../sections/NextClasses";
import SkillsMap from "../sections/SkillsMap";
import Employability from "../sections/Employability";
import SkillsWallet from "../sections/SkillsWallet";
import FloatingAssistant from "../components/FloatingAssistant";
// import Certifications from "../sections/Certifications";

export default function Dashboard() {
  const { activeId, observe } = useActiveSection();
  const navigate = useNavigate();

  // Sidebar links sin "Métricas" se calculan al pasar al layout
  // Navegación del sidebar: Métricas primero, sin Certificaciones ni Skills Wallet
  const links = [
    { href: "#metrics", label: "Métricas" },
    { href: "#intro", label: "Inicio" },
    { href: "#cursos", label: "Mis cursos" },
    { href: "#mapa", label: "Mapa & Misiones" },
    { href: "#empleo", label: "Empleabilidad" },
    { href: "#tutor", label: "Tutor IA" },
    { href: "#copilot", label: "Co-pilot" },
  ];

  // Reorder and clean links: Métricas first, remove Certificaciones and Skills Wallet
  /* const navLinks = React.useMemo(() => {
    try {
      const without = (links || []).filter(
        (l) => l?.href !== '#certificaciones' && l?.href !== '#wallet'
      );
      const metrics = without.find((l) => l?.href === '#metrics');
      const rest = without.filter((l) => l?.href !== '#metrics');
      const fixedMetrics = metrics ? { ...metrics, label: 'Métricas' } : null;
      return fixedMetrics ? [fixedMetrics, ...rest] : without;
    } catch {
      return links || [];
    }
  }, []); */

/*       const legacyLinks = [
    { href: "#intro", label: "Inicio" },
    { href: "#cursos", label: "Mis cursos" },
    { href: "#certificaciones", label: "Certificaciones" },
    { href: "#metrics", label: "Métricas" },
    { href: "#mapa", label: "Mapa & Misiones" },
    { href: "#empleo", label: "Empleabilidad" },
    { href: "#wallet", label: "Skills Wallet" },
    { href: "#portafolio", label: "Portafolio" },
    { href: "#tutor", label: "Tutor IA" },
    { href: "#copilot", label: "Co-pilot" },
  ]; */

  const onLinkClick = useCallback((hash) => {
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      try { window.history.replaceState(null, "", `#${id}`); } catch {}
    }
  }, []);

  return (
    <DashboardLayout links={links.filter((l) => !["#metrics"].includes(l?.href))} activeId={activeId} onLinkClick={onLinkClick}>
      <Intro observe={observe} />
      <Metrics observe={observe} />
      <NextClasses observe={observe} />
      <Courses
        observe={observe}
        onOpenCourse={(c) => navigate('/course', { state: { courseId: c?.id } })}
        onOpenCerts={() => navigate('/dashboard/certificaciones')}
      />
      <SkillsMap observe={observe} />
      <Employability observe={observe} />
      {false && <SkillsWallet observe={observe} />}
      <FloatingAssistant />
    </DashboardLayout>
  );
}






