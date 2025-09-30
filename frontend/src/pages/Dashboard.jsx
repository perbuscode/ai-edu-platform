// src/pages/Dashboard.jsx
import React, { useCallback } from "react";
import { useScrollToHash } from "../hooks/useScrollToHash";
import { useDashboard } from "../context/DashboardProvider";
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
// import Certifications from "../sections/Certifications";

export default function Dashboard() {
  const { activeId, observe } = useActiveSection();
  const { loading } = useDashboard();
  const navigate = useNavigate();
  useScrollToHash([loading]);

  // Define todas las secciones disponibles en el dashboard.
  const sections = [
    { href: "#intro", label: "Inicio" },
    { href: "#cursos", label: "Mis cursos" },
    { href: "#mapa", label: "Mapa & Misiones" },
    { href: "#empleo", label: "Empleabilidad" },
    { href: "#tutor", label: "Tutor IA" },
    { href: "#copilot", label: "Co-pilot" },
  ];
  // Los enlaces del sidebar son todas las secciones excepto las que queremos ocultar.
  const sidebarLinks = sections.filter((l) => !["#metrics"].includes(l?.href));

  const onLinkClick = useCallback((hash) => {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      try {
        window.history.replaceState(null, "", `#${id}`);
      } catch (_error) {
        // noop
      }
    }
  }, []);

  return (
    <DashboardLayout
      links={sidebarLinks}
      activeId={activeId}
      onLinkClick={onLinkClick}
      title="Dashboard del estudiante"
    >
      <Intro observe={observe} />
      <Metrics observe={observe} />
      <NextClasses observe={observe} />
      <Courses
        observe={observe}
        onOpenCourse={(c) =>
          navigate("/course", { state: { courseId: c?.id } })
        }
        onOpenCerts={() => navigate("/dashboard/certificaciones")}
      />
      <SkillsMap observe={observe} />
      <Employability observe={observe} />
      {false && <SkillsWallet observe={observe} />}
    </DashboardLayout>
  );
}
