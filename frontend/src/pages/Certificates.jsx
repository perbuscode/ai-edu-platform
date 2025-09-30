// src/pages/Certificates.jsx
import React from "react";
import Topbar from "../components/Topbar";
import Certifications from "../sections/Certifications";

export default function CertificatesPage() {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      <Topbar leftOffsetClass="left-0" showLogo title="Certificaciones" />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Certifications />
        </div>
      </main>
    </div>
  );
}
