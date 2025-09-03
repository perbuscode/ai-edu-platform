import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ValueSection from "./components/ValueSection";
import ChatPlanner from "./components/ChatPlanner";      // 👈 NUEVO (chat)
import Courses from "./components/Courses";
import Testimonials from "./components/Testimonials";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import Modal from "./components/Modal";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HowItWorks from "./components/HowItWorks";
import FinalCTA from "./components/FinalCTA";
import ExamplePlanButton from "./components/ExamplePlanButton";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="bg-slate-900">
      <Navbar
        onOpenLogin={() => setShowLogin(true)}
        onOpenRegister={() => setShowRegister(true)}
      />

      <Hero />
      <ValueSection />
      {/* Conversacional: genera el plan vía chat */}
      <HowItWorks />
      <Testimonials />
      <Courses />
      <ChatPlanner />
      <ContactSection />
      <FinalCTA />
      <Footer />

      {/* Widget flotante de preguntas (sigue igual) */}
      <ChatWidget />

      {/* Modales de Auth */}
      <Modal
        open={showLogin}
        title="Iniciar sesión"
        onClose={() => setShowLogin(false)}
      >
        <LoginForm onSubmit={() => setShowLogin(false)} />
      </Modal>

      <Modal
        open={showRegister}
        title="Crear cuenta"
        onClose={() => setShowRegister(false)}
      >
        <RegisterForm onSubmit={() => setShowRegister(false)} />
      </Modal>
    </div>
  );
}

export default App;
