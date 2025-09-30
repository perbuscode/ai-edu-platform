import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { getCourses, getMetrics, getSkillsMap } from "../services/dashboard";

const DashboardContext = createContext(undefined);

export function DashboardProvider({ children }) {
  const [metrics, setMetrics] = useState(null);
  const [courses, setCourses] = useState(null);
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextMetrics, nextCourses, nextSkills] = await Promise.all([
        getMetrics(),
        getCourses(),
        getSkillsMap(),
      ]);
      setMetrics(nextMetrics);
      setCourses(nextCourses);
      setSkills(nextSkills);
    } catch (err) {
      setError(err?.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({ metrics, courses, skills, loading, error, refresh: load }),
    [metrics, courses, skills, loading, error, load]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard debe usarse dentro de <DashboardProvider>");
  }
  return context;
}
