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
import FAQ from "./components/FAQ";
import PlanExampleModal from "./components/PlanExampleModal";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function Landing() {
  const [openExample, setOpenExample] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpenExample(true);
    window.addEventListener("open-example-plan", onOpen);
    return () => window.removeEventListener("open-example-plan", onOpen);
  }, []);

  return (
    <>
      <main>
        <Hero onOpenExample={() => setOpenExample(true)} />
        <ValueSection />
        <Courses />
        <Testimonials />
        <ChatPlanner />
      </main>
      <Footer onOpenExample={() => setOpenExample(true)} />
      <FAQ />
      <PlanExampleModal open={openExample} onClose={() => setOpenExample(false)} />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/profile");
  return (
    <div className="bg-slate-900 min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
      </Routes>
    </div>
  );
}
