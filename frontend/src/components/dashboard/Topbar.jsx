// src/components/dashboard/Topbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { applyTheme, getStoredTheme } from "../../theme/applyTheme";

export default function Topbar({
  title = "Bienvenido de vuelta",
  subtitle = "Continúa tu aprendizaje donde lo dejaste",
  actions,
}) {
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : getStoredTheme()
  );

  const [notifOpen, setNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true); // mock flag
  const notifBtnRef = useRef(null);
  const notifFirstRef = useRef(null);

  const [userOpen, setUserOpen] = useState(false);
  const userBtnRef = useRef(null);
  const userFirstRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (notifOpen) {
          setNotifOpen(false);
          notifBtnRef.current?.focus();
        }
        if (userOpen) {
          setUserOpen(false);
          userBtnRef.current?.focus();
        }
      }
    }
    function onDocClick(e) {
      const target = e.target;
      if (notifOpen) {
        const panel = document.getElementById("notif-panel");
        if (
          panel &&
          !panel.contains(target) &&
          !notifBtnRef.current?.contains(target)
        ) {
          setNotifOpen(false);
          notifBtnRef.current?.focus();
        }
      }
      if (userOpen) {
        const panel = document.getElementById("userMenu");
        if (
          panel &&
          !panel.contains(target) &&
          !userBtnRef.current?.contains(target)
        ) {
          setUserOpen(false);
          userBtnRef.current?.focus();
        }
      }
    }
    if (notifOpen || userOpen) {
      document.addEventListener("keydown", onKey);
      const t = setTimeout(
        () => document.addEventListener("mousedown", onDocClick),
        0
      );
      return () => {
        clearTimeout(t);
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("mousedown", onDocClick);
      };
    }
  }, [notifOpen, userOpen]);

  useEffect(() => {
    if (notifOpen) {
      setHasUnread(false);
      requestAnimationFrame(() => notifFirstRef.current?.focus());
    }
    if (userOpen) {
      requestAnimationFrame(() => userFirstRef.current?.focus());
    }
  }, [notifOpen, userOpen]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  const ctrlBtn =
    "h-9 px-2.5 inline-flex items-center justify-center rounded-md border border-transparent text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-800";

  const items = [
    {
      time: "Hace 5 min",
      title: "Nueva clase disponible",
      desc: 'Se publicó "Patrones de diseño".',
    },
    {
      time: "Hoy 10:15",
      title: "Recordatorio",
      desc: "Clase de Async/Await a las 15:00.",
    },
    { time: "Ayer", title: "Calificación", desc: "Obtuviste 95% en el quiz." },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-gray-600 dark:text-slate-400 mt-1">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {actions ? (
            actions
          ) : (
            <>
              <button
                id="btn-theme"
                aria-label="Cambiar tema"
                className={ctrlBtn}
                onClick={toggleTheme}
                title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
              >
                {theme === "dark" ? (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M21.64 13.64A9 9 0 1110.36 2.36a7 7 0 1011.28 11.28z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0L16.95 7.05M7.05 16.95l-1.414 1.414"
                    />
                  </svg>
                )}
              </button>

              <div className="relative">
                <button
                  id="btn-notifications"
                  ref={notifBtnRef}
                  className={ctrlBtn + " relative"}
                  aria-haspopup="dialog"
                  aria-expanded={notifOpen}
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setUserOpen(false);
                  }}
                  title="Notificaciones"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {hasUnread && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"
                      aria-hidden
                    />
                  )}
                </button>
                {notifOpen && (
                  <div
                    id="notif-panel"
                    role="dialog"
                    aria-label="Notificaciones"
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg py-2 z-50"
                  >
                    <div className="px-3 pb-2 text-xs text-gray-500 dark:text-slate-400">
                      Últimas notificaciones
                    </div>
                    <ul>
                      {items.map((n, i) => (
                        <li key={i}>
                          <button
                            ref={i === 0 ? notifFirstRef : undefined}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 focus:bg-gray-50 dark:focus:bg-slate-800"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                              {n.title}{" "}
                              <span className="text-xs font-normal text-gray-500 dark:text-slate-400">
                                • {n.time}
                              </span>
                            </p>
                            <p className="text-xs text-gray-600 dark:text-slate-400">
                              {n.desc}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  id="btn-user"
                  ref={userBtnRef}
                  className={ctrlBtn + " pl-2 pr-2.5"}
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                  onClick={() => {
                    setUserOpen((v) => !v);
                    setNotifOpen(false);
                  }}
                  title="Cuenta"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 grid place-items-center text-[10px] font-medium text-gray-700 dark:text-slate-200">
                    U
                  </div>
                </button>
                {userOpen && (
                  <div
                    id="userMenu"
                    className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg py-1 z-50"
                  >
                    <button
                      ref={userFirstRef}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      Perfil
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800">
                      Ajustes
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-slate-700" />
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
