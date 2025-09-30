const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMetrics = async () => {
  await delay();
  return {
    streak: 3,
    hours: 2.5,
    lessons: 7,
    projects: 2,
  };
};

export const getCourses = async () => {
  await delay();
  return [
    {
      id: "frontend",
      title: "Desarrollo Web Frontend",
      description: "HTML, CSS, React y patrones.",
      progress: 68,
    },
    {
      id: "powerbi",
      title: "Master Power BI",
      description: "ETL, modelado, DAX y storytelling.",
      progress: 25,
    },
  ];
};

export const getSkillsMap = async () => {
  await delay();
  return {
    levels: [
      {
        id: "dax",
        name: "DAX",
        levelText: "Nivel 3/5",
        percent: "60%",
        badge: {
          label: "Subiendo",
          bg: "bg-emerald-100",
          text: "text-emerald-800",
        },
      },
      {
        id: "etl",
        name: "ETL / Power Query",
        levelText: "Nivel 2/5",
        percent: "40%",
        badge: { label: "Estable", bg: "bg-slate-100", text: "text-slate-800" },
      },
      {
        id: "modelado",
        name: "Modelado",
        levelText: "Nivel 2/5",
        percent: "35%",
        badge: {
          label: "Subiendo",
          bg: "bg-emerald-100",
          text: "text-emerald-800",
        },
      },
      {
        id: "storytelling",
        name: "Storytelling",
        levelText: "Nivel 3/5",
        percent: "60%",
        badge: { label: "Bajando", bg: "bg-amber-100", text: "text-amber-800" },
      },
      {
        id: "sql",
        name: "SQL",
        levelText: "Nivel 2/5",
        percent: "40%",
        badge: { label: "Estable", bg: "bg-slate-100", text: "text-slate-800" },
      },
      {
        id: "ingles",
        name: "Inglés B2",
        levelText: "Nivel 2/5",
        percent: "40%",
        badge: { label: "Estable", bg: "bg-slate-100", text: "text-slate-800" },
      },
    ],
  };
};
