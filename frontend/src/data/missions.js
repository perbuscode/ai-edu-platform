export const MISSIONS = [
  {
    id: "dax-ytd",
    title: "DAX YTD + contexto de filtro",
    description: "Micro-proyecto para reforzar time-intelligence.",
    duration: "25 min",
    impact: "Impacto alto",
    chips: ["25 min", "Impacto alto"],
    chipStyles: ["bg-sky-100 text-sky-800", "bg-emerald-100 text-emerald-800"],
    skillPoints: 120,
    objective:
      "Construir una medida Year-To-Date (YTD) que respete el contexto de filtro del reporte.",
    scenario:
      "Tu equipo de BI necesita comparar las ventas acumuladas del año actual con el año anterior para decidir el presupuesto del siguiente trimestre.",
    dataset: [
      "Tabla `Ventas` con columnas Fecha, Categoría y VentasNetas.",
      "Tabla `Calendario` marcada como tabla de fechas y relacionada con Ventas.Fecha.",
    ],
    tasks: [
      "Crea una medida `Ventas YTD` usando TOTALYTD y asegúralo con CALCULATE.",
      "Construye una medida `Ventas YTD LY` aplicando SAMEPERIODLASTYEAR.",
      "Diseña una visual de líneas con ambas medidas y agrega un slicer por Categoría.",
      "Agrega una tarjeta que muestre la variación porcentual entre ambos acumulados.",
    ],
    deliverable:
      "Publica o comparte un PBIX con las medidas, visuales y conclusiones en notas.",
    reflection: [
      "¿Qué filtros deberías revisar antes de presentar la comparación a tu líder?",
      "¿Cómo validarías que las medidas devuelven la cifra esperada?",
    ],
    resources: [
      {
        label: "Documentación TOTALYTD",
        url: "https://learn.microsoft.com/power-bi/",
      },
      {
        label: "Patrones de time-intelligence",
        url: "https://daxpatterns.com/time-patterns/",
      },
    ],
    rubric: {
      intro: "Evalúa tu entrega con la siguiente rúbrica de ejemplo.",
      criteria: [
        {
          dimension: "Medida DAX",
          basic: "La medida entrega errores o ignora el filtro del calendario.",
          proficient:
            "La medida calcula el acumulado anual y responde a slicers principales.",
          advanced:
            "Incluye manejo de contextos especiales (por ejemplo, filtros de Categoría) y validación de totales.",
        },
        {
          dimension: "Visualización",
          basic: "La visual no compara correctamente los acumulados.",
          proficient:
            "Se muestran las tendencias de ambos acumulados con etiquetas claras.",
          advanced:
            "Incluye anotaciones o marcadores que explican hallazgos clave.",
        },
        {
          dimension: "Storytelling",
          basic: "No se explica el insight encontrado.",
          proficient: "Se resumen hallazgos y se sugiere una acción.",
          advanced:
            "Se conectan hallazgos con impacto de negocio y próximos pasos.",
        },
      ],
    },
  },
  {
    id: "etl-limpieza",
    title: "Limpieza de datos (ETL)",
    description: "Transforma y normaliza un dataset real.",
    duration: "20 min",
    impact: "Impacto medio",
    chips: ["20 min", "Impacto medio"],
    chipStyles: ["bg-sky-100 text-sky-800", "bg-emerald-100 text-emerald-800"],
    skillPoints: 100,
    objective:
      "Preparar una tabla de ventas limpia y consistente lista para el modelo.",
    scenario:
      "Recibiste un CSV con ventas históricas que contiene filas duplicadas, nulos y columnas sin estandarizar.",
    dataset: [
      "Archivo `ventas_raw.csv` con columnas Fecha, Categoría, Producto, VentasNetas y Canal.",
      "Catálogo `canales.xlsx` con la descripción estándar de cada canal.",
    ],
    tasks: [
      "Importa ambos archivos a Power Query y establece las relaciones necesarias.",
      "Elimina duplicados basándote en Fecha, Producto y Canal.",
      "Normaliza los nombres de categoría y canal en mayúsculas tipo Sentencia.",
      "Crea una columna condicional que clasifique la venta como Directa o Indirecta.",
      "Carga solo las columnas necesarias al modelo (Fecha, Producto, Categoría, CanalEstandar, VentasNetas, TipoVenta).",
    ],
    deliverable:
      "Genera una tabla final en Power Query o un archivo exportado con los datos limpios y documenta los pasos aplicados.",
    reflection: [
      "¿Qué reglas de negocio confirmarías antes de automatizar esta transformación?",
      "¿Cómo manejarías nuevos valores de canal en el futuro?",
    ],
    resources: [
      {
        label: "Aprende más sobre Power Query",
        url: "https://learn.microsoft.com/power-query/",
      },
      {
        label: "Guía de limpieza de datos",
        url: "https://www.sqlbi.com/articles/",
      },
    ],
    rubric: {
      intro: "Usa esta rúbrica de referencia al revisar tu transformación.",
      criteria: [
        {
          dimension: "Calidad de datos",
          basic: "Persisten duplicados o nulos sin tratamiento.",
          proficient: "Se eliminan duplicados y se gestionan nulos basicos.",
          advanced:
            "Incluye validaciones adicionales (por ejemplo, rangos de fechas o totales revisados).",
        },
        {
          dimension: "Transformación",
          basic: "Solo se realizan pasos parciales o manuales.",
          proficient: "Todos los pasos pedidos se documentan en Power Query.",
          advanced:
            "Se agregan parámetros o funciones reutilizables para automatizar el flujo.",
        },
        {
          dimension: "Documentación",
          basic: "No se describe el proceso aplicado.",
          proficient:
            "Se listan los pasos aplicados y los resultados logrados.",
          advanced:
            "Se agregan notas de riesgos de datos y sugerencias para futuras ingestas.",
        },
      ],
    },
  },
  {
    id: "storytelling-dashboard",
    title: "Storytelling con dashboard ejecutivo",
    description:
      "Diseña un mockup de dashboard que comunique hallazgos clave a la gerencia.",
    duration: "30 min",
    impact: "Impacto alto",
    chips: ["30 min", "Impacto alto"],
    chipStyles: ["bg-sky-100 text-sky-800", "bg-emerald-100 text-emerald-800"],
    skillPoints: 140,
    objective:
      "Construir un tablero claro con narrativa visual que proponga acciones concretas.",
    scenario:
      "Debes preparar una versión ejecutiva del tablero de ventas para presentarlo en el comité mensual.",
    dataset: [
      "Datos agregados de ventas por región, categoría y canal.",
      "Notas cualitativas del equipo comercial sobre riesgos y oportunidades.",
    ],
    tasks: [
      "Define 3 insights clave que debe ver la gerencia y redacta el mensaje principal de cada uno.",
      "Propone la composición del dashboard (layout de tarjetas, gráficos y contexto) en un boceto o wireframe.",
      "Establece un call to action para cada insight y describe qué decisión habilita.",
      "Incluye una diapositiva de seguimiento con próximos pasos y responsables.",
    ],
    deliverable:
      "Sube un mockup (imagen o PDF) con notas de presentacion para cada insight.",
    reflection: [
      "¿Qué canales de comunicación usarías para validar el mensaje antes del comité?",
      "¿Cómo medirías que la presentación generó acciones concretas?",
    ],
    resources: [
      {
        label: "Guía de storytelling en BI",
        url: "https://www.storytellingwithdata.com/",
      },
      {
        label: "Plantillas de dashboards ejecutivos",
        url: "https://www.figma.com/community",
      },
    ],
    rubric: {
      intro:
        "Usa este checklist para validar que el dashboard cuenta una historia clara.",
      criteria: [
        {
          dimension: "Claridad",
          basic: "La narrativa es confusa o carece de título claro.",
          proficient:
            "Los mensajes clave se entienden y conectan con los datos mostrados.",
          advanced:
            "Incluye jerarquía visual y textos accionables que guían la discusión.",
        },
        {
          dimension: "Impacto",
          basic: "No se proponen acciones a partir de los hallazgos.",
          proficient: "Se sugiere al menos una acción por insight.",
          advanced:
            "Se vinculan acciones con métricas de seguimiento y responsables.",
        },
        {
          dimension: "Diseño",
          basic: "El layout esta saturado o sin consistencia.",
          proficient: "Se usa un layout balanceado con coherencia visual.",
          advanced:
            "Se refuerza el mensaje con anotaciones, colores y foco en la audiencia ejecutiva.",
        },
      ],
    },
  },
];

export function getMissionById(id) {
  return MISSIONS.find((mission) => mission.id === id);
}
