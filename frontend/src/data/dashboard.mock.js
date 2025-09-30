export const mockCurrentCourse = {
  name: "Desarrollo Web Frontend",
  module: "Módulo 3: JavaScript Avanzado",
  progress: 68,
  remaining: "2h 30min restantes",
  lesson: "Lección 8 de 12",
};

export const mockStats = { completed: "3/5", hours: "127h", certificates: "2" };

export const mockUpcoming = [
  { title: "Async/Await", when: "Hoy, 3:00 PM", dot: "bg-blue-500" },
  { title: "APIs REST", when: "Mañana, 10:00 AM", dot: "bg-green-500" },
  { title: "Testing", when: "Viernes, 2:00 PM", dot: "bg-purple-500" },
];

export const mockMaterials = [
  {
    tag: "PDF",
    color: "text-red-600",
    bg: "bg-red-100",
    name: "Guía JavaScript",
    info: "2.3 MB",
  },
  {
    tag: "ZIP",
    color: "text-blue-600",
    bg: "bg-blue-100",
    name: "Ejercicios Prácticos",
    info: "5.7 MB",
  },
  {
    tag: "MP4",
    color: "text-green-600",
    bg: "bg-green-100",
    name: "Video Tutorial",
    info: "45 min",
  },
];

export const mockActivity = [
  {
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    text: 'Completaste la lección "Promesas en JavaScript"',
    time: "Hace 2 horas",
  },
  {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    text: 'Descargaste el material "Ejercicios de Async/Await"',
    time: "Ayer",
  },
  {
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    text: "Obtuviste una calificación de 95% en el quiz",
    time: "Hace 3 días",
  },
];
