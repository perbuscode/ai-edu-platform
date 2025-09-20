// src/pages/Certificates.jsx
import React from "react";
import DashboardLayout from "../app/DashboardLayout";
import useActiveSection from "../app/useActiveSection";
import Certifications from "../sections/Certifications";
import FloatingAssistant from "../components/FloatingAssistant";

export default function Certificates() {
  const { activeId } = useActiveSection();
  const links = [];
  return (
    <DashboardLayout links={links} activeId={activeId} onLinkClick={() => {}}>
      <Certifications />
      <FloatingAssistant placement="top-right" strategy="absolute" offsetClass="top-20" />
    </DashboardLayout>
  );
}
