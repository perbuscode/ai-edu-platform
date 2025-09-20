// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ValueSection from "./components/ValueSection";
import Courses from "./components/Courses";
import Testimonials from "./components/Testimonials";
import ChatPlanner from "./components/ChatPlanner";
import Footer from "./components/Footer";
// FAQ flotante removido; usamos menú en Navbar
import PlanExampleModal from "./components/PlanExampleModal";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Certificates from "./pages/Certificates";
import PortfolioProjects from "./pages/PortfolioProjects";
import VirtualRoom from "./pages/VirtualRoom";
import Course from "./pages/Course";
import Profile from "./pages/Profile";
import CV from "./pages/CV";
import PracticeInterview from "./pages/PracticeInterview";
import Faqs from "./pages/Faqs";
import Pqr from "./pages/Pqr";
import Contacto from "./pages/Contacto";
import BlogSection from "./components/BlogSection";
import BlogPostModal from "./components/BlogPostModal";
import AssistantSidebar from "./components/AssistantSidebar";

function Landing() {
  const [openExample, setOpenExample] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [openBlog, setOpenBlog] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const onOpenExample = () => { setCurrentPlan(null); setOpenExample(true); };
    const onOpenPlan = (ev) => { try { setCurrentPlan(ev?.detail?.plan || null); } catch {} setOpenExample(true); };
    window.addEventListener("open-example-plan", onOpenExample);
    window.addEventListener("open-plan-modal", onOpenPlan);
    return () => {
      window.removeEventListener("open-example-plan", onOpenExample);
      window.removeEventListener("open-plan-modal", onOpenPlan);
    };
  }, []);

  return (
    <>
      <main>
        <Hero onOpenExample={() => setOpenExample(true)} />
        <ValueSection />
        <Courses />
        <Testimonials />
        <ChatPlanner />
        <BlogSection onOpenPost={(post)=>{ setCurrentPost(post); setOpenBlog(true); }} />
      </main>
      <Footer onOpenExample={() => setOpenExample(true)} />
      <PlanExampleModal open={openExample} onClose={() => setOpenExample(false)} plan={currentPlan} />
      <BlogPostModal open={openBlog} onClose={()=> setOpenBlog(false)} post={currentPost} />
    </>
  );
}

export default function App() {
  const location = useLocation();
  // Scroll a secciones del landing cuando la URL trae hash (ej: "/#plan")
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const scroll = () => {
      const el = document.getElementById(id);
      if (!el) return;
      try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      catch { el.scrollIntoView(); }
    };
    // Ejecuta varias veces para cubrir montaje de Landing
    const t0 = setTimeout(scroll, 0);
    const t1 = setTimeout(scroll, 120);
    const t2 = setTimeout(scroll, 300);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [location.pathname, location.hash]);
  const hideNavbar = (
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/course") ||
    location.pathname.startsWith("/cv") ||
    location.pathname.startsWith("/practice")
  );
  const showAssistantSidebar = location.pathname.startsWith("/dashboard");

  return (
    <div className="bg-slate-900 min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/pqr" element={<Pqr />} />
        <Route path="/contacto" element={<Contacto />} />
        { /* Blog ahora es sección en landing; se elimina ruta dedicada */ }
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/portafolio"
          element={
            <ProtectedRoute>
              <PortfolioProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/certificaciones"
          element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/salon-virtual"
          element={
            <ProtectedRoute>
              <VirtualRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course"
          element={
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv"
          element={
            <ProtectedRoute>
              <CV />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice-interview"
          element={
            <ProtectedRoute>
              <PracticeInterview />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* Asesor IA visible solo en dashboard */}
      {showAssistantSidebar && <AssistantSidebar />}
    </div>
  );
}
