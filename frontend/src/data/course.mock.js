// frontend/src/data/course.mock.js
// Datos mock para la página de Curso

export const mockCourse = {
  id: "course-frontend-basics",
  title: "Desarrollo Web Frontend",
  description:
    "Aprende HTML, CSS y JavaScript con un enfoque práctico. Cada clase incluye video, materiales y un ejercicio guiado.",
  progress: 0,
  currentLesson: {
    id: "lesson-1",
    title: "Introducción y conceptos básicos",
    duration: "45 min",
    steps: [
      { id: "video", label: "Video" },
      { id: "content", label: "Contenido" },
      { id: "exercise", label: "Ejercicio" },
    ],
    outline: [
      "Qué es el desarrollo frontend",
      "Rol de HTML, CSS y JS",
      "Herramientas y flujo de trabajo",
    ],
    exercise:
      "Crea un archivo HTML mínimo con un título y un párrafo. Luego agrega un estilo simple en línea (color y tamaño) y explica qué hiciste.",
  },
};

export default mockCourse;

