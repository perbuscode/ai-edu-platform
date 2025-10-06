import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

// --- HELPER FUNCTIONS ---
const arr = (x) => (Array.isArray(x) ? x : x != null ? [x] : []);
const str = (v) => (typeof v === "string" ? v.trim() : v);

// --- DATA ADAPTERS ---

function normTopic(t, i, j) {
  if (typeof t === "string") return { id: `t-${i}-${j}`, title: str(t) };
  return {
    id: t?.id ?? `t-${i}-${j}`,
    title: str(t?.title ?? t?.name ?? t?.topic ?? "Tema"),
    summary: str(t?.summary ?? t?.description ?? null),
  };
}

function normModuleFromWeek(week, i) {
  const title = str(week?.title ?? week?.name ?? `Semana ${i + 1}`);
  const topics = arr(week?.goals).map((g, j) => normTopic(g, i, j));

  return {
    id: week?.id ?? `m-${i}`,
    title,
    summary: str(week?.summary ?? week?.description ?? null),
    topics,
    projects: [], // Projects will be merged in later.
  };
}

function deriveBlocks(raw) {
  if (Array.isArray(raw?.blocks)) {
    return raw.blocks.map((b, i) => {
      const projectObject = {
        id: `proj-${i}`,
        title: b.title,
        summary: typeof b.project === "string" ? b.project : null,
        estimatedHours: b.projectHours,
      };
      return { ...b, project: projectObject };
    });
  }
  return [];
}

export function adaptPlan(input = {}) {
  const raw = input._raw ?? input;

  const description =
    str(raw.summary) ??
    str(raw.description) ??
    str(raw.overview) ??
    str(raw.intro) ??
    null;
  const mainGoal = str(raw.goal ?? raw.objective) ?? null;

  const weekOrModuleData = Array.isArray(raw.weeksPlan)
    ? raw.weeksPlan
    : raw.modules;
  let modules = Array.isArray(weekOrModuleData)
    ? weekOrModuleData.map((w, i) => normModuleFromWeek(w, i))
    : [];

  const blocks = deriveBlocks(raw);

  // Merge projects into their corresponding modules
  if (modules.length > 0 && blocks.length > 0) {
    modules = modules.map((module, index) => {
      const moduleWeek = index + 1;
      const relatedProjects = blocks.filter((block) => {
        return (
          block.title?.includes(`Semana ${moduleWeek}`) ||
          block.week === moduleWeek
        );
      });
      return { ...module, projects: relatedProjects };
    });
  }

  const duration = raw.durationWeeks ?? raw.weeks ?? null;

  return {
    title: str(raw.title ?? raw.objective ?? "Plan sin título"),
    subtitle: [raw.level, duration ? `${duration} semanas` : null, raw.hoursPerWeek ? `${raw.hoursPerWeek} h/semana` : null]
      .filter(Boolean)
      .join(" · "),
    level: raw.level ?? null,
    durationWeeks: duration,
    hoursPerWeek: raw.hoursPerWeek ?? null,
    description,
    mainGoal,
    modules,
    salary: raw.salary ?? null,
    skills: raw.skills ?? [],
    roles: raw.roles ?? [],
    _source: raw._source ?? null,
    _raw: raw,
  };
}

// --- UI COMPONENTS ---

function Header({ title, subtitle, onClose }) {
  return (
    <div className="px-6 pt-5 pb-4 border-b border-[#E4ECFF] rounded-t-2xl bg-white/95 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="studyplan-title"
            className="text-xl font-semibold leading-tight text-[#1B2559]"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#0F5BFF] mt-0.5">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#4C5D8B] hover:text-[#0F3FD9] hover:bg-[#E6EEFF] transition"
        >
          <span aria-hidden>×</span>
        </button>
      </div>
    </div>
  );
}

function Body({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const focusable = el.querySelectorAll(
        `a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])`
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={ref} className="px-6 py-6 overflow-y-auto min-h-0 bg-transparent">
      {children}
    </div>
  );
}

function Footer({ children }) {
  return (
    <div className="px-6 py-4 border-t border-[#E4ECFF] rounded-b-2xl bg-white/95 backdrop-blur">
      <div className="flex items-center justify-end gap-3">{children}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-base font-semibold mb-3 text-[#15306D]">{children}</h3>
  );
}

function Card({ title, children }) {
  const highlight =
    typeof title === "string" && title.toLowerCase() === "descripción";
  return (
    <div
      className={[
        "rounded-2xl border p-5 shadow-sm min-h-0",
        highlight
          ? "border-transparent bg-gradient-to-r from-[#0E7CFF] via-[#1369FF] to-[#3858F5] text-white"
          : "border-[#CFDAFF] bg-[#F7FAFF] text-[#1E2A4A]",
      ].join(" ")}
    >
      {title && (
        <h4
          className={[
            "text-sm font-medium mb-2",
            highlight ? "text-white/90" : "text-[#0F5BFF]",
          ].join(" ")}
        >
          {title}
        </h4>
      )}
      <div className={highlight ? "text-white/95" : "text-inherit"}>
        {children}
      </div>
    </div>
  );
}

function Empty({ children }) {
  return <p className="text-sm text-[#5B6C8F]">{children}</p>;
}

function Dashed({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-[#C9D6FF] bg-[#F0F5FF]/90 p-6 text-sm text-[#5B6C8F]">
      {children}
    </div>
  );
}

// --- HOOKS and PORTAL ---

function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

function Portal({ children }) {
  return createPortal(children, document.body);
}

// --- MAIN COMPONENT ---

export default function StudyPlanDialog({ open, onClose, plan, onExport }) {
  useLockBodyScroll(open);
  const adapted = adaptPlan(plan ?? {});

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
            data-testid="studyplan-dialog"
          >
            <motion.button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="absolute inset-0 bg-gradient-to-br from-[#1046A9]/25 via-[#0D2D7A]/15 to-transparent backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="studyplan-title"
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className={[
                "relative pointer-events-auto",
                "w-full max-w-screen-2xl",
                "bg-gradient-to-b from-[#F3F7FF] via-white to-[#DFE9FF] text-[#1B2559]",
                "rounded-2xl shadow-2xl ring-1 ring-[#D6E4FF]",
                "max-h-[min(90svh,900px)] grid grid-rows-[auto,1fr,auto] min-h-0 overflow-hidden",
              ].join(" ")}
            >
              <Header
                title={adapted.title}
                subtitle={adapted.subtitle}
                onClose={onClose}
              />
              <Body>
                <div className="space-y-6">
                  <section>
                    <Card title="Descripción">
                      <p className="text-sm leading-6 whitespace-pre-wrap">
                        {adapted.description || "—"}
                      </p>
                    </Card>
                  </section>

                  <section>
                    <Card title="Meta Principal">
                      {adapted.mainGoal ? (
                        <p className="text-sm text-[#1E2A4A]">
                          {adapted.mainGoal}
                        </p>
                      ) : (
                        <Empty>Sin una meta principal definida.</Empty>
                      )}
                    </Card>
                  </section>

                  <section>
                    <Card title="Habilidades a Desarrollar">
                      {Array.isArray(adapted.skills) &&
                      adapted.skills.length > 0 ? (
                        <ul className="text-sm space-y-2 text-[#1E2A4A]">
                          {adapted.skills.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      ) : (
                        <Empty>No se especificaron habilidades.</Empty>
                      )}
                    </Card>
                  </section>

                  <section>
                    <SectionTitle>Plan de Estudio Semanal</SectionTitle>
                    {Array.isArray(adapted.modules) &&
                    adapted.modules.length > 0 ? (
                      <ol className="space-y-6">
                        {adapted.modules.map((m, mi) => (
                          <li
                            key={m.id ?? mi}
                            className="rounded-2xl border border-[#D6E4FF] p-5 shadow-sm bg-[#F7FAFF]"
                          >
                            <div className="font-medium mb-2 text-[#15306D]">
                              {m.title}
                            </div>
                            {Array.isArray(m.topics) && m.topics.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-xs font-semibold uppercase text-[#5B6C8F] mb-2">
                                  Temas
                                </h5>
                                <ul className="list-disc pl-4 text-sm space-y-1 text-[#1E2A4A]">
                                  {m.topics.map((t, ti) => (
                                    <li key={t.id ?? ti}>{t.title}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {Array.isArray(m.projects) &&
                              m.projects.length > 0 && (
                                <div>
                                  <h5 className="text-xs font-semibold uppercase text-[#5B6C8F] mb-2">
                                    Proyecto de la Semana
                                  </h5>
                                  {m.projects.map((p, pi) => (
                                    <div
                                      key={p.project?.id ?? pi}
                                      className="mt-2 first:mt-0"
                                    >
                                      <p className="text-sm text-[#2B3A64]">
                                        {p.project.summary}
                                      </p>
                                      {p.project?.estimatedHours && (
                                        <p className="mt-1 text-xs text-[#5B6C8F]">
                                          ~ {p.project.estimatedHours} h
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <Dashed>Sin módulos/temario para mostrar.</Dashed>
                    )}
                  </section>

                  <section className="mb-2">
                    <SectionTitle>Roles y Salarios Potenciales</SectionTitle>
                    {Array.isArray(adapted.salary) &&
                    adapted.salary.length > 0 ? (
                      <div className="space-y-4">
                        {adapted.salary.map((s, i) => (
                          <Card key={i} title={s.role}>
                            <p className="text-lg font-semibold text-[#15306D]">
                              {s.min} - {s.max}{" "}
                              <span className="text-sm font-normal text-[#5B6C8F]">
                                {s.currency} / {s.period}
                              </span>
                            </p>
                            {s.region && (
                              <p className="text-xs text-[#5B6C8F]">
                                {s.region}
                              </p>
                            )}
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#5B6C8F]">
                        Sin información salarial.
                      </p>
                    )}
                  </section>
                </div>
              </Body>
              <Footer>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl border border-[#C5D6FF] text-[#0F5BFF] hover:bg-[#E6EEFF] transition"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={onExport}
                  className="h-10 px-4 rounded-xl bg-[#0F5BFF] text-white font-semibold hover:bg-[#0C4DDB] transition"
                >
                  Exportar
                </button>
              </Footer>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
