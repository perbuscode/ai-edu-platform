import * as real from "./dashboard.real";
import * as mock from "./dashboard.mock";

const metaEnv =
  typeof import.meta !== "undefined" ? import.meta.env : undefined;
const flag =
  (metaEnv && metaEnv.VITE_USE_MOCKS) ??
  process.env.VITE_USE_MOCKS ??
  process.env.REACT_APP_USE_MOCKS;
const useMocks = String(flag ?? "").toLowerCase() === "true";

export const getMetrics = useMocks ? mock.getMetrics : real.getMetrics;
export const getCourses = useMocks ? mock.getCourses : real.getCourses;
export const getSkillsMap = useMocks ? mock.getSkillsMap : real.getSkillsMap;
export const getStudyPlan = useMocks ? mock.getStudyPlan : real.getStudyPlan;
