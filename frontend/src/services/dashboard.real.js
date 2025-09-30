import { api } from "./http";

export const getMetrics = () => api("/api/metrics");
export const getCourses = () => api("/api/courses");
export const getSkillsMap = () => api("/api/skills-map");
