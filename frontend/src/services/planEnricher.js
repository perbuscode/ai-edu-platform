function mapTaskToProject(t, meta = {}) {
  return {
    id: t.id ?? `task-${meta.week ?? meta.module ?? 'x'}-${meta.index ?? 0}`,
    title: t.title ?? t.name ?? 'Proyecto',
    summary: t.summary ?? t.description ?? '',
    deliverable: t.deliverable ?? t.output ?? '',
    rubric: t.rubric ?? null,
    estimatedHours: t.estimatedHours ?? t.hours ?? null,
    tags: t.tags ?? [],
    // conserva campos crudos por si el modal los usa
    _raw: t
  };
}

function mapProject(p, meta = {}) {
  return {
    id: p.id ?? `proj-${meta.week ?? meta.module ?? 'x'}-${meta.index ?? 0}`,
    title: p.title ?? p.name ?? 'Proyecto',
    summary: p.summary ?? p.description ?? '',
    deliverable: p.deliverable ?? p.output ?? '',
    rubric: p.rubric ?? null,
    estimatedHours: p.estimatedHours ?? p.hours ?? null,
    tags: p.tags ?? [],
    _raw: p
  };
}

export function normalizeProjects(plan) {
  const blocks = [];

  // 1) weeksPlan[].tasks -> blocks[].project
  if (Array.isArray(plan?.weeksPlan)) {
    plan.weeksPlan.forEach((week, wi) => {
      const tasks = week?.tasks ?? [];
      tasks.forEach((t, ti) => {
        const isProject =
          t?.type?.toLowerCase?.() === 'project' ||
          t?.isProject === true ||
          t?.category?.toLowerCase?.() === 'project';
        if (isProject) {
          blocks.push({
            week: wi + 1,
            project: mapTaskToProject(t, { week: wi + 1, index: ti })
          });
        }
      });
    });
  }

  // 2) modules[].projects -> blocks[].project
  if (Array.isArray(plan?.modules)) {
    plan.modules.forEach((m, mi) => {
      const projects = m?.projects ?? [];
      projects.forEach((p, pi) => {
        blocks.push({
          module: mi + 1,
          project: mapProject(p, { module: mi + 1, index: pi })
        });
      });
    });
  }

  // 3) Passthrough si ya viene normalizado
  if (Array.isArray(plan?.blocks)) {
    plan.blocks.forEach((b) => {
      if (b?.project) {
        blocks.push(b);
      }
    });
  }

  return { blocks };
}