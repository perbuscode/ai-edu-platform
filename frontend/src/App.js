// src/App.js
import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { useScrollToHash } from "./hooks/useScrollToHash";

// Layouts
import MainLayout from "./pages/MainLayout";
import ProtectedLayout from "./routes/ProtectedLayout";

// Pages
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const Plan = lazy(() => import("./pages/Plan"));

const Dashboard = lazy(
  () => import(/* webpackPrefetch: true */ "./pages/Dashboard")
);
const PortfolioProjects = lazy(
  () => import(/* webpackPrefetch: true */ "./pages/PortfolioProjects")
);
const Certificates = lazy(() => import("./pages/Certificates"));
const MissionDetail = lazy(() => import("./pages/MissionDetail"));
const VirtualRoom = lazy(() => import("./pages/VirtualRoom"));
const Course = lazy(() => import("./pages/Course"));
const Profile = lazy(() => import("./pages/Profile"));
const CV = lazy(() => import("./pages/CV"));
const PracticeInterview = lazy(() => import("./pages/PracticeInterview"));
const Faqs = lazy(() => import("./pages/Faqs"));
const Pqr = lazy(() => import("./pages/Pqr"));
const Contacto = lazy(() => import("./pages/Contacto"));

export default function App() {
  const location = useLocation();
  useScrollToHash([location.pathname, location.hash]);

  return (
    <div className="bg-slate-900 min-h-screen">
      <Suspense
        fallback={<div className="p-6 text-slate-400">Cargando...</div>}
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/pqr" element={<Pqr />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/plan" element={<Plan />} />
          </Route>

          {/* Rutas Públicas Estáticas */}
          <Route>
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Route>

          {/* Rutas Protegidas */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/portafolio"
              element={<PortfolioProjects />}
            />
            <Route
              path="/dashboard/certificaciones"
              element={<Certificates />}
            />
            <Route path="/dashboard/salon-virtual" element={<VirtualRoom />} />
            <Route path="/course" element={<Course />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/practice-interview" element={<PracticeInterview />} />
            <Route path="/missions/:missionId" element={<MissionDetail />} />
          </Route>

          {/* Ruta para páginas no encontradas (404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}
