// src/App.js
import React, { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ValueSection from "./components/ValueSection";
import Courses from "./components/Courses";
import Testimonials from "./components/Testimonials";
import ChatPlanner from "./components/ChatPlanner";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import PlanExampleModal from "./components/PlanExampleModal";

export default function App() {
  const [openExample, setOpenExample] = useState(false);

  // Open example plan modal when chat auto-generates the plan
  useEffect(() => {
    const onOpen = () => setOpenExample(true);
    window.addEventListener("open-example-plan", onOpen);
    return () => window.removeEventListener("open-example-plan", onOpen);
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen">
      <Navbar />
      <main>
        <Hero onOpenExample={() => setOpenExample(true)} />
        <ValueSection />
        <Courses />
        <Testimonials />
        <ChatPlanner />
      </main>

      <Footer onOpenExample={() => setOpenExample(true)} />

      {/* FAQ flotante (cerrado por defecto) */}
      <FAQ />

      {/* Modal plan de ejemplo */}
      <PlanExampleModal open={openExample} onClose={() => setOpenExample(false)} />
    </div>
  );
}
