// src/data/courses.mock.js

const svg = (title, scheme) =>
  encodeURI(`data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='800' height='480' viewBox='0 0 800 480'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${scheme[0]}'/>
        <stop offset='100%' stop-color='${scheme[1]}'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(%23g)'/>
    <g fill='white' fill-opacity='0.2'>
      <circle cx='120' cy='120' r='80'/><circle cx='220' cy='180' r='50'/><circle cx='170' cy='240' r='70'/><circle cx='650' cy='80' r='60'/><circle cx='700' cy='160' r='40'/>
    </g>
    <g transform='translate(80,340)'><rect x='0' y='0' width='360' height='18' rx='9' fill='white' fill-opacity='0.6' /><rect x='0' y='28' width='420' height='12' rx='6' fill='white' fill-opacity='0.35' /><rect x='0' y='48' width='280' height='12' rx='6' fill='white' fill-opacity='0.3' /></g>
    <text x='560' y='420' text-anchor='end' font-size='34' font-family='Inter,Arial' fill='white' fill-opacity='0.9' font-weight='700'>${title}</text>
  </svg>`);

export const featuredCourses = [
  {
    id: "ai",
    title: "Introducción a la IA",
    description: "Fundamentos de IA y aplicaciones reales.",
    img: "/images/course-ai.png",
    placeholder: svg("Introducción a la IA", ["#0ea5e9", "#7c3aed"]),
  },
  {
    id: "code",
    title: "Aprender a programar",
    description: "Domina lenguajes y bases de desarrollo.",
    img: "/images/course-code.jpg",
    placeholder: svg("Aprender a programar", ["#10b981", "#2563eb"]),
  },
  {
    id: "lang",
    title: "Cursos de idiomas",
    description: "Mejora tu inglés u otro idioma para negocios.",
    img: "/images/course-lang.jpg",
    placeholder: svg("Cursos de idiomas", ["#f59e0b", "#ef4444"]),
  },
];
