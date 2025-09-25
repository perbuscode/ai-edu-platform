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
    objective: "Construir una medida Year-To-Date (YTD) que respete el contexto de filtro del reporte.",
    scenario: "Tu equipo de BI necesita comparar las ventas acumuladas del anio actual con el anio anterior para decidir el presupuesto del siguiente trimestre.",
    dataset: [
      "Tabla `Ventas` con columnas Fecha, Categoria y VentasNetas.",
      "Tabla `Calendario` marcada como tabla de fechas y relacionada con Ventas.Fecha."
    ],
    tasks: [
      "Crea una medida `Ventas YTD` usando TOTALYTD y aseguralo con CALCULATE.",
      "Construye una medida `Ventas YTD LY` aplicando SAMEPERIODLASTYEAR.",
      "Disena una visual de lineas con ambas medidas y agrega un slicer por Categoria.",
      "Agrega una tarjeta que muestre la variacion porcentual entre ambos acumulados."
    ],
    deliverable: "Publica o comparte un PBIX con las medidas, visuales y conclusiones en notas.",
    reflection: [
      "Que filtros deberias revisar antes de presentar la comparacion a tu lider?",
      "Como validarias que las medidas devuelven la cifra esperada?"
    ],
    resources: [
      { label: "Documentacion TOTALYTD", url: "https://learn.microsoft.com/power-bi/" },
      { label: "Patrones de time-intelligence", url: "https://daxpatterns.com/time-patterns/" }
    ],
    rubric: {
      intro: "Evalua tu entrega con la siguiente rubrica de ejemplo.",
      criteria: [
        {
          dimension: "Medida DAX",
          basic: "La medida entrega errores o ignora el filtro del calendario.",
          proficient: "La medida calcula el acumulado anual y responde a slicers principales.",
          advanced: "Incluye manejo de contextos especiales (por ejemplo, filtros de Categoria) y validacion de totales."
        },
        {
          dimension: "Visualizacion",
          basic: "La visual no compara correctamente los acumulados.",
          proficient: "Se muestran las tendencias de ambos acumulados con etiquetas claras.",
          advanced: "Incluye anotaciones o marcadores que explican hallazgos clave."
        },
        {
          dimension: "Storytelling",
          basic: "No se explica el insight encontrado.",
          proficient: "Se resumen hallazgos y se sugiere una accion.",
          advanced: "Se conectan hallazgos con impacto de negocio y proximos pasos."
        }
      ]
    }
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
    objective: "Preparar una tabla de ventas limpia y consistente lista para el modelo.",
    scenario: "Recibiste un CSV con ventas historicas que contiene filas duplicadas, nulos y columnas sin estandarizar.",
    dataset: [
      "Archivo `ventas_raw.csv` con columnas Fecha, Categoria, Producto, VentasNetas y Canal.",
      "Catalogo `canales.xlsx` con la descripcion estandar de cada canal."
    ],
    tasks: [
      "Importa ambos archivos a Power Query y establece las relaciones necesarias.",
      "Elimina duplicados basandote en Fecha, Producto y Canal.",
      "Normaliza los nombres de categoria y canal en mayusculas tipo Sentencia.",
      "Crea una columna condicional que clasifique la venta como Directa o Indirecta.",
      "Carga solo las columnas necesarias al modelo (Fecha, Producto, Categoria, CanalEstandar, VentasNetas, TipoVenta)."
    ],
    deliverable: "Genera una tabla final en Power Query o un archivo exportado con los datos limpios y documenta los pasos aplicados.",
    reflection: [
      "Que reglas de negocio confirmarias antes de automatizar esta transformacion?",
      "Como manejarias nuevos valores de canal en el futuro?"
    ],
    resources: [
      { label: "Aprende mas sobre Power Query", url: "https://learn.microsoft.com/power-query/" },
      { label: "Guia de limpieza de datos", url: "https://www.sqlbi.com/articles/" }
    ],
    rubric: {
      intro: "Usa esta rubrica de referencia al revisar tu transformacion.",
      criteria: [
        {
          dimension: "Calidad de datos",
          basic: "Persisten duplicados o nulos sin tratamiento.",
          proficient: "Se eliminan duplicados y se gestionan nulos basicos.",
          advanced: "Incluye validaciones adicionales (por ejemplo, rangos de fechas o totales revisados)."
        },
        {
          dimension: "Transformaciones",
          basic: "Solo se realizan pasos parciales o manuales.",
          proficient: "Todos los pasos pedidos se documentan en Power Query.",
          advanced: "Se agregan parametros o funciones reutilizables para automatizar el flujo."
        },
        {
          dimension: "Documentacion",
          basic: "No se describe el proceso aplicado.",
          proficient: "Se listan los pasos aplicados y los resultados logrados.",
          advanced: "Se agregan notas de riesgos de datos y sugerencias para futuras ingestas."
        }
      ]
    }
  },
  {
    id: "storytelling-dashboard",
    title: "Storytelling con dashboard ejecutivo",
    description: "Disena un mockup de dashboard que comunique hallazgos clave a la gerencia.",
    duration: "30 min",
    impact: "Impacto alto",
    chips: ["30 min", "Impacto alto"],
    chipStyles: ["bg-sky-100 text-sky-800", "bg-emerald-100 text-emerald-800"],
    skillPoints: 140,
    objective: "Construir un tablero claro con narrativa visual que proponga acciones concretas.",
    scenario: "Debes preparar una version ejecutiva del tablero de ventas para presentarlo en el comite mensual.",
    dataset: [
      "Datos agregados de ventas por region, categoria y canal.",
      "Notas cualitativas del equipo comercial sobre riesgos y oportunidades."
    ],
    tasks: [
      "Define 3 insight clave que debe ver la gerencia y redacta el mensaje principal de cada uno.",
      "Propone la composicion del dashboard (layout de tarjetas, graficos y contexto) en un boceto o wireframe.",
      "Establece un call to action para cada insight y describe que decision habilita.",
      "Incluye una diapositiva de seguimiento con proximos pasos y responsables."
    ],
    deliverable: "Sube un mockup (imagen o PDF) con notas de presentacion para cada insight.",
    reflection: [
      "Que canales de comunicacion usarias para validar el mensaje antes del comite?",
      "Como medirias que la presentacion genero acciones concretas?"
    ],
    resources: [
      { label: "Guia de storytelling en BI", url: "https://www.storytellingwithdata.com/" },
      { label: "Plantillas de dashboards ejecutivos", url: "https://www.figma.com/community" }
    ],
    rubric: {
      intro: "Checklist para validar que el dashboard cuenta una historia clara.",
      criteria: [
        {
          dimension: "Claridad",
          basic: "La narrativa es confusa o carece de titulo claro.",
          proficient: "Los mensajes clave se entienden y conectan con los datos mostrados.",
          advanced: "Incluye jerarquia visual y copys accionables que guian la discusion."
        },
        {
          dimension: "Impacto",
          basic: "No se proponen acciones a partir de los hallazgos.",
          proficient: "Se sugiere al menos una accion por insight.",
          advanced: "Se vinculan acciones con metricas de seguimiento y responsables."
        },
        {
          dimension: "Diseno",
          basic: "El layout esta saturado o sin consistencia.",
          proficient: "Se usa un layout balanceado con coherencia visual.",
          advanced: "Se refuerza el mensaje con anotaciones, colores y foco en la audiencia ejecutiva."
        }
      ]
    }
  }
];

export function getMissionById(id) {
  return MISSIONS.find((mission) => mission.id === id);
}



