// src/context/DashboardProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getMetrics, getCourses, getSkillsMap } from "../services/dashboard.real";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [metrics, setMetrics] = useState(null);
  const [courses, setCourses] = useState(null);
  const [skillsMap, setSkillsMap] = useState(null);
  const [loading, setLoading] = useState(true);

  // Evita doble fetch por StrictMode en dev
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let isMounted = true;

    async function load() {
      setLoading(true);
      const [mRes, cRes, sRes] = await Promise.allSettled([
        getMetrics(),
        getCourses(),
        getSkillsMap(),
      ]);

      if (!isMounted) return;

      setMetrics(mRes.status === "fulfilled" ? mRes.value : null);
      setCourses(cRes.status === "fulfilled" ? cRes.value : null);
      setSkillsMap(sRes.status === "fulfilled" ? sRes.value : null);
      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const value = { metrics, courses, skillsMap, loading };
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  return useContext(DashboardContext);
}
