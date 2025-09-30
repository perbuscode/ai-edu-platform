// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    () =>
      (typeof window !== "undefined" && localStorage.getItem("ai-edu-theme")) ||
      "light"
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifFirstRef = useRef(null);
  const userFirstRef = useRef(null);
  const [view, setView] = useState("dashboard"); // 'dashboard' | 'course'
  const [sidebarMode, setSidebarMode] = useState("hidden"); // 'hidden' | 'expanded' | 'collapsed'
  const [activeTab, setActiveTab] = useState("overview");
  const [step, setStep] = useState(1);
  const [courseTitle, setCourseTitle] = useState("Nombre del curso");

  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  useEffect(() => {
    function onResize() {
      setMobile(
        typeof window !== "undefined" ? window.innerWidth < 1024 : false
      );
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    function onDocClick() {
      if (notifOpen) setNotifOpen(false);
      if (userOpen) setUserOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") {
        if (notifOpen) setNotifOpen(false);
        if (userOpen) setUserOpen(false);
      }
    }
    if (notifOpen || userOpen) {
      setTimeout(() => document.addEventListener("click", onDocClick), 0);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [notifOpen, userOpen]);

  useEffect(() => {
    if (notifOpen) requestAnimationFrame(() => notifFirstRef.current?.focus());
  }, [notifOpen]);
  useEffect(() => {
    if (userOpen) requestAnimationFrame(() => userFirstRef.current?.focus());
  }, [userOpen]);

  // Normaliza etiquetas en espaï¿½ol cuando hubo textos mal codificados
  useEffect(() => {
    try {
      const lbl = document.getElementById("sidebar-label");
      if (lbl) lbl.textContent = "Navegaciï¿½n";
      const sb = document.getElementById("sidebar");
      if (sb) sb.setAttribute("aria-label", "Navegaciï¿½n del curso");
      const showBtn = document.getElementById("showNavBtn");
      if (showBtn) showBtn.setAttribute("aria-label", "Mostrar navegaciï¿½n");
      const hideBtn = document.getElementById("hideSidebar");
      if (hideBtn) hideBtn.setAttribute("aria-label", "Ocultar navegaciï¿½n");
    } catch (_error) {
      // noop
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("ai-edu-theme", next);
    } catch (_error) {
      // noop
    }
  }

  function showDashboard() {
    setView("dashboard");
    setSidebarMode("hidden");
    setStep(1);
    setActiveTab("overview");
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_error) {
      // noop
    }
  }

  function openCourse(name) {
    setCourseTitle(name);
    setView("course");
    setSidebarMode("expanded");
    setActiveTab("overview");
    setStep(1);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_error) {
      // noop
    }
  }

  function collapseSidebar() {
    setSidebarMode("collapsed");
  }
  function expandSidebar() {
    setSidebarMode("expanded");
  }
  function hideSidebar() {
    setSidebarMode("hidden");
  }

  function getDisplayName(u) {
    if (!u) return "Invitado";
    if (u.displayName && u.displayName.trim()) return u.displayName.trim();
    if (u.email) {
      const local = u.email.split("@")[0] || "";
      return local.charAt(0).toUpperCase() + local.slice(1);
    }
    return "Invitado";
  }
  const displayName = getDisplayName(user);
  const avatarInitial = (displayName || user?.email || "I")
    .trim()
    .charAt(0)
    .toUpperCase();

  // Mock local de cursos (antes de efectos que lo usan)
  const coursesMock = useMemo(
    () => [
      {
        id: "frontend",
        title: "Desarrollo Web Frontend",
        progress: 68,
        hours: "2.5",
        next: "Hoy, 3:00 p.m.",
      },
      {
        id: "powerbi",
        title: "Master Power BI",
        progress: 25,
        hours: "1.2",
        next: "Maï¿½ana, 10:00 a.m.",
      },
    ],
    []
  );

  // Fallback de red y estados vacï¿½os (patrï¿½n de carga simulada)
  const [coursesData, setCoursesData] = useState(() => []);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  useEffect(() => {
    // Inicializa con el mock actual si no hay error
    if (!coursesError && !coursesLoading) setCoursesData(coursesMock);
  }, [coursesError, coursesLoading, coursesMock]);

  function retryLoadCourses() {
    setCoursesError(null);
    setCoursesLoading(true);
    try {
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        throw new Error("offline");
      }
      setCoursesData(coursesMock);
    } catch (e) {
      setCoursesError(e?.message || "error");
      if (e?.message === "offline") toast.offline();
      else toast.loadError();
    } finally {
      setCoursesLoading(false);
    }
  }

  /* const courses = useMemo(() => ([
    { id: 'frontend', title: 'Desarrollo Web Frontend', progress: 68, hours: '2.5', next: 'Hoy, 3:00 p.m.' },
    { id: 'powerbi', title: 'Master Power BI', progress: 25, hours: '1.2', next: 'Maï¿½ana, 10:00 a.m.' },
  ]), []); */

  const appClass =
    sidebarMode === "expanded"
      ? "with-sidebar-expanded"
      : sidebarMode === "collapsed"
        ? "with-sidebar-collapsed"
        : "";

  async function handleLogout() {
    try {
      await logout();
      toast.success("Sesiï¿½n cerrada");
      setUserOpen(false);
      navigate("/");
    } catch (e) {
      toast.error("No se pudo cerrar sesiï¿½n");
    }
  }

  return (
    <div className="bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      {sidebarMode !== "hidden" && (
        <aside
          id="sidebar"
          className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 z-40 ${sidebarMode === "collapsed" ? "collapsed" : "expanded"}`}
          aria-label="Navegaciï¿½n del curso"
          aria-hidden={sidebarMode === "hidden"}
        >
          <div
            id="sidebar-header"
            className="p-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between"
          >
            <button
              id="showNavBtn"
              onClick={expandSidebar}
              className={`${sidebarMode === "collapsed" ? "" : "hidden"} p-1.5 rounded-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800`}
              aria-label="Mostrar navegación"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h12M4 12h16M4 18h12"
                />
              </svg>
            </button>
            <div
              id="sidebarLogo"
              className={`${sidebarMode === "collapsed" ? "hidden" : "hidden lg:flex"} items-center gap-2`}
            >
              <div className="w-8 h-8 gradient-bg rounded-md grid place-items-center">
                <span className="text-white font-bold text-sm">AE</span>
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                AI Edu
              </span>
            </div>
            <button
              id="hideSidebar"
              onClick={collapseSidebar}
              className={`${sidebarMode === "collapsed" ? "hidden" : ""} p-1.5 rounded-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800`}
              aria-label="Ocultar navegación"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav
            id="sidebar-content"
            className="mt-3 p-2"
            role="tablist"
            aria-orientation="vertical"
          >
            <p
              id="sidebar-label"
              className={`${sidebarMode === "collapsed" ? "hidden" : ""} px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider`}
            >
              Navegación
            </p>
            <div
              id="sidebar-course-tabs"
              className={`${sidebarMode === "collapsed" ? "hidden" : "flex"} flex-col gap-1 px-2 pb-3`}
            >
              {[
                { key: "overview", label: "Resumen" },
                { key: "classroom", label: "Clase" },
                { key: "studyplan", label: "Plan" },
                { key: "materials", label: "Materiales" },
              ].map((t) => (
                <button
                  key={t.key}
                  id={`tab-${t.key}`}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 rounded-md text-sm text-left ${activeTab === t.key ? "bg-blue-600 text-white" : "hover:bg-gray-50 dark:hover:bg-slate-800"}`}
                  role="tab"
                  aria-selected={activeTab === t.key}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div
              id="sidebar-back-wrap"
              className={`${sidebarMode === "collapsed" ? "hidden" : ""} px-2`}
            >
              <button
                id="btn-back-dashboard"
                type="button"
                onClick={showDashboard}
                aria-label="Volver al dashboard"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7 7-7"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12h18"
                  />
                </svg>
                <span>Volver al dashboard</span>
              </button>
            </div>
          </nav>
        </aside>
      )}

      {sidebarMode === "expanded" && mobile && (
        <div
          id="sidebar-overlay"
          onClick={hideSidebar}
          className="fixed inset-0 z-30 bg-black/40"
        />
      )}

      <div id="app" className={appClass}>
        <header
          className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-gray-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-4 ${view === "course" ? "" : "sticky top-0 z-20"}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                id="topbarLogo"
                className={`flex items-center gap-2 ${view === "course" ? "hidden" : ""}`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 gradient-bg rounded-md grid place-items-center">
                  <span className="text-white font-bold text-sm sm:text-base">
                    AE
                  </span>
                </div>
                <span className="text-base sm:text-lg font-semibold text-gray-800 dark:text-slate-100">
                  AI Edu
                </span>
              </div>
              <div className="pl-2">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-slate-100 leading-tight">
                  Bienvenido,{" "}
                  <span className="text-blue-600">{displayName}</span>
                </h1>
                <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm">
                  Explora tu aprendizaje desde el Dashboard central
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="themeBtn"
                onClick={toggleTheme}
                className="h-10 px-3 rounded-md border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800"
                aria-label="Cambiar tema"
              >
                <span id="themeIcon">
                  {theme === "dark" ? "\uD83C\uDF19" : "\u2600\uFE0F"}
                </span>
              </button>
              <div className="relative">
                <button
                  id="notifBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotifOpen((v) => !v);
                    setUserOpen(false);
                  }}
                  className="h-10 px-3 rounded-md border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800"
                  aria-label="Notificaciones"
                  aria-expanded={notifOpen}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-7.5-7.5H7.5"
                    />
                  </svg>
                </button>
                {notifOpen && (
                  <div
                    id="notifPanel"
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg py-2 z-50"
                  >
                    <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase">
                      Notificaciones
                    </p>
                    <div className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800">
                      <p className="text-sm">
                        Nueva lecciï¿½n disponible:{" "}
                        <span className="font-medium">Async/Await</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Hoy, 2:45 PM
                      </p>
                    </div>
                    <div className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800">
                      <p className="text-sm">Recordatorio: Quiz de Power BI</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Maï¿½ana, 9:00 AM
                      </p>
                    </div>
                    <div className="px-3 pt-2">
                      <button
                        ref={notifFirstRef}
                        className="text-xs text-blue-600 dark:text-blue-300 hover:underline"
                      >
                        Ver todas
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  id="userMenuBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserOpen((v) => !v);
                    setNotifOpen(false);
                  }}
                  className="h-10 px-3 rounded-md border border-gray-200 dark:border-slate-700 flex items:center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 grid place-items-center text-[10px]">
                    {avatarInitial}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium leading-4">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 leading-4">
                      Estudiante
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {userOpen && (
                  <div
                    id="userMenu"
                    className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg py-1 z-50"
                  >
                    <button
                      ref={userFirstRef}
                      onClick={() => {
                        setUserOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      Perfil
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800">
                      Ajustes
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-slate-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Cerrar sesiï¿½n
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main id="main" className="p-4 sm:p-6 lg:p-8">
          {/* DASHBOARD VIEW */}
          <section
            id="dashboard-view"
            role="tabpanel"
            className={view === "dashboard" ? "" : "hidden"}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 card-hover">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Cursos activos
                </p>
                <p className="text-2xl font-semibold mt-1" id="kpi-courses">
                  2
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 card-hover">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Horas restantes (total)
                </p>
                <p className="text-2xl font-semibold mt-1" id="kpi-hours">
                  3h 40m
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 card-hover">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Prï¿½xima clase
                </p>
                <p className="text-2xl font-semibold mt-1" id="kpi-next">
                  Hoy, 3:00 PM
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 mb-8 card-hover">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Prï¿½ximas clases</h2>
                <div className="text-sm text-gray-500 dark:text-slate-400">
                  Zona horaria local
                </div>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <li className="border border-gray-200 dark:border-slate-800 rounded-lg p-4 flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Async/Await (Frontend)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Hoy, 3:00 PM
                    </p>
                  </div>
                </li>
                <li className="border border-gray-200 dark:border-slate-800 rounded-lg p-4 flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Modelado de Datos (Power BI)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Maï¿½ana, 10:00 AM
                    </p>
                  </div>
                </li>
                <li className="border border-gray-200 dark:border-slate-800 rounded-lg p-4 flex items-center gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pruebas unitarias</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Viernes, 2:00 PM
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <h2 className="text-lg font-semibold mb-4">Tus cursos</h2>
            {coursesError && (
              <div className="rounded-xl border border-dashed border-gray-300 dark:border-slate-700 p-6 text-center mb-6">
                <div className="text-2xl mb-1" aria-hidden>
                  ??
                </div>
                <p className="text-sm text-gray-700 dark:text-slate-300">
                  No pudimos cargar tus cursos.
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
                  Verifica tu conexiï¿½n y vuelve a intentarlo.
                </p>
                <button
                  onClick={retryLoadCourses}
                  className="px-4 py-2 rounded-lg text-sm bg-slate-900 text-white hover:bg-slate-800"
                >
                  Reintentar
                </button>
              </div>
            )}
            {!coursesError && !coursesLoading && coursesData.length === 0 && (
              <div
                className="rounded-xl border border-dashed border-gray-300 dark:border-slate-700 p-6 text-center mb-6"
                role="status"
                aria-live="polite"
              >
                <div className="text-2xl mb-1" aria-hidden>
                  ??
                </div>
                <p className="text-sm text-gray-700 dark:text-slate-300">
                  Aï¿½n no tienes cursos activos.
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Cuando te inscribas, aparecerï¿½n aquï¿½.
                </p>
              </div>
            )}
            <div
              id="courses-grid"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {(!coursesError ? coursesData : []).map((c) => (
                <article
                  key={c.id}
                  className="course-card bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 card-hover"
                  data-hours={c.hours}
                  data-progress={c.progress}
                  data-id={c.id}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 gradient-bg rounded-lg grid place-items-center"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-semibold">{c.title}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {c.id === "frontend"
                          ? "Mï¿½dulo 3: JS Avanzado"
                          : "Nivel: Bï¿½sico â€“ Avanzado"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-slate-300">
                        Progreso
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {c.progress}%
                      </span>
                    </div>
                    <div
                      className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2"
                      aria-hidden="true"
                    >
                      <div
                        className="bar-green h-2 rounded-full"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-slate-300 mb-4">
                    <li>
                      {"\u23F1\uFE0F"}{" "}
                      {c.id === "frontend" ? "2h 30m" : "1h 12m"} restantes
                    </li>
                    <li>
                      {"\uD83D\uDD52"} Prï¿½xima: {c.next}
                    </li>
                  </ul>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn-ver-curso bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      onClick={() => openCourse(c.title)}
                    >
                      Ver curso
                    </button>
                    <button
                      className={`btn-cert px-4 py-2 rounded-lg text-sm font-medium border chip dark:border-slate-700 text-gray-700 dark:text-slate-200 ${c.progress < 100 ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={c.progress < 100}
                      title={
                        c.progress < 100
                          ? "Completa el curso para habilitar el certificado"
                          : "Descargar certificado"
                      }
                    >
                      Certificado
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* COURSE VIEW */}
          <section
            id="course-view"
            aria-live="polite"
            className={view === "course" ? "" : "hidden"}
          >
            <div className="mb-6">
              <h2
                id="course-title"
                className="text-2xl font-bold tracking-tight"
              >
                {courseTitle}
              </h2>
            </div>
            <section
              id="tab-overview"
              className={activeTab === "overview" ? "" : "hidden"}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <article className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">
                    Progreso del curso
                  </h3>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-slate-300">
                        Completado
                      </span>
                      <span
                        id="ov-percent"
                        className="text-sm font-medium text-green-600"
                      >
                        0%
                      </span>
                    </div>
                    <div
                      className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2"
                      aria-hidden="true"
                    >
                      <div
                        id="ov-bar"
                        className="bar-green h-2 rounded-full"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <li className="border chip dark:border-slate-700 rounded-lg px-3 py-2">
                      {"\u23F1\uFE0F"} Horas restantes:{" "}
                      <span id="ov-hours" className="font-medium">
                        0h
                      </span>
                    </li>
                    <li className="border chip dark:border-slate-700 rounded-lg px-3 py-2">
                      {"\uD83D\uDCDA"} Lecciï¿½n actual:{" "}
                      <span id="ov-lesson" className="font-medium">
                        â€”
                      </span>
                    </li>
                    <li className="border chip dark:border-slate-700 rounded-lg px-3 py-2">
                      {"\uD83D\uDD52"} Prï¿½xima clase:{" "}
                      <span id="ov-next" className="font-medium">
                        â€”
                      </span>
                    </li>
                    <li className="border chip dark:border-slate-700 rounded-lg px-3 py-2">
                      {"\u23F1\uFE0F"} Hora estimada de llegada:{" "}
                      <span id="ov-eta" className="font-medium">
                        â€”
                      </span>
                    </li>
                  </ul>
                </article>
              </div>
            </section>
            <section
              id="tab-classroom"
              className={activeTab === "classroom" ? "" : "hidden"}
            >
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  {[1, 2, 3].map((i) => (
                    <React.Fragment key={i}>
                      <div
                        id={`step-${i}-dot`}
                        className={`step-dot rounded-full grid place-items-center ${step === i ? "text-white bg-blue-600" : "text-gray-600 bg-gray-200 dark:bg-slate-800 dark:text-slate-300"}`}
                      >
                        {i}
                      </div>
                      {i < 3 && (
                        <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {step === 1 && (
                  <div id="class-step-1">
                    <h3 className="text-lg font-semibold mb-3">
                      Clase en video
                    </h3>
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 bg-black aspect-video mb-4 grid place-items-center">
                      <span className="text-white/70 text-sm">
                        [Player de video embebido]
                      </span>
                    </div>
                    <button
                      id="btn-step-1-next"
                      onClick={() => setStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                    >
                      Siguiente: Contenido
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div id="class-step-2">
                    <h3 className="text-lg font-semibold mb-3">
                      Contenido de la clase
                    </h3>
                    <div className="prose max-w-none text-gray-800 dark:text-slate-200">
                      <p>
                        En esta lecciï¿½n profundizamos en{" "}
                        <strong>conceptos clave</strong> y buenas prï¿½cticas.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        id="btn-step-2-prev"
                        onClick={() => setStep(1)}
                        className="border chip dark:border-slate-700 px-4 py-2 rounded-lg text-sm"
                      >
                        Volver al video
                      </button>
                      <button
                        id="btn-step-2-next"
                        onClick={() => setStep(3)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                      >
                        Siguiente: Ejercicio
                      </button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div id="class-step-3">
                    <h3 className="text-lg font-semibold mb-3">
                      Ejercicio guiado
                    </h3>
                    <div className="border border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-4">
                      <p className="text-sm mb-2">
                        Resuelve el reto y envï¿½a tu respuesta:
                      </p>
                      <textarea
                        className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg px-3 py-2 text-sm"
                        rows={5}
                        placeholder="Escribe aquï¿½ tu soluciï¿½n, pasos o reflexiï¿½n..."
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        id="btn-step-3-prev"
                        onClick={() => setStep(2)}
                        className="border chip dark:border-slate-700 px-4 py-2 rounded-lg text-sm"
                      >
                        Volver a contenido
                      </button>
                      <button
                        id="btn-finish-step"
                        onClick={() => {
                          alert(
                            "ï¿½Clase marcada como completada! Avanzarï¿½s a la siguiente cuando estï¿½ disponible."
                          );
                          setStep(1);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
                      >
                        Marcar clase como completada
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
            <section
              id="tab-studyplan"
              className={activeTab === "studyplan" ? "" : "hidden"}
            >
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Plan de estudio</h3>
                <ol className="space-y-3">
                  <li className="flex items-center justify-between border chip dark:border-slate-700 rounded-lg px-3 py-2">
                    <span>1. Introducción</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Completado
                    </span>
                  </li>
                  <li className="flex items-center justify-between border chip dark:border-slate-700 rounded-lg px-3 py-2">
                    <span>2. Fundamentos</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      En curso
                    </span>
                  </li>
                  <li className="flex items-center justify-between border chip dark:border-slate-700 rounded-lg px-3 py-2">
                    <span>3. Proyecto práctico</span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200">
                      Pendiente
                    </span>
                  </li>
                </ol>
              </div>
            </section>
            <section
              id="tab-materials"
              className={activeTab === "materials" ? "" : "hidden"}
            >
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Materiales del curso
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg grid place-items-center">
                      <span className="text-xs font-medium text-red-600 dark:text-red-300">
                        PDF
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Guía de conceptos</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        2.3 MB
                      </p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                      Descargar
                    </button>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg grid place-items-center">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                        ZIP
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Dataset + soluciones
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        5.7 MB
                      </p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                      Descargar
                    </button>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg grid place-items-center">
                      <span className="text-xs font-medium text-green-600 dark:text-green-300">
                        MP4
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Clip de apoyo</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        12 min
                      </p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                      Ver
                    </button>
                  </li>
                </ul>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
