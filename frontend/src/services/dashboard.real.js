// src/services/dashboard.real.js
import { safeJsonFetch } from "./http";

export function getMetrics() {
  return safeJsonFetch("/metrics");
}
export function getCourses() {
  return safeJsonFetch("/courses");
}
export function getSkillsMap() {
  return safeJsonFetch("/skills-map");
}