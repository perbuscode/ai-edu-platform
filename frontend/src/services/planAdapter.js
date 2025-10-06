export function adaptPlan(raw = {}) {
  return {
    title: raw.title ?? raw.name ?? 'Plan sin título',
    subtitle: raw.subtitle ?? raw.level ?? null,
    level: raw.level ?? null,
    description:
      raw.description ??
      raw.overview ??
      raw.summary ??
      raw.intro ??
      null,
    goals: raw.goals ?? raw.kpis ?? raw.objectives ?? [],
    modules: raw.modules ?? raw.sections ?? raw.chapters ?? [],
    blocks: raw.blocks ?? [], // proyectos ya normalizados
    salary:
      raw.salary ??
      raw.remuneration ??
      raw.expectedSalary ??
      raw.meta?.salary ??
      null,
    durationWeeks: raw.duration ?? raw.weeks ?? raw.durationWeeks ?? null,
    hoursPerWeek: raw.hoursPerWeek ?? raw.weeklyHours ?? null,
  };
}
