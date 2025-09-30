// src/data/testimonials.mock.js

const genericAvatar = encodeURI(`data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='%230ea5e9'/>
        <stop offset='100%' stop-color='%237c3aed'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' rx='48' fill='url(%23g)'/>
    <g fill='white' opacity='0.9' transform='translate(20,20)'>
      <circle cx='28' cy='20' r='12'/>
      <path d='M8 48c0-11 9-20 20-20s20 9 20 20v4H8v-4z'/>
    </g>
  </svg>`);

export const testimonials = [
  {
    id: "ana-gonzalez",
    text: "Conseguí mi primer rol de BI mostrando dashboards de alto impacto en entrevistas.",
    author: "Ana González",
    country: "🇨🇴 Colombia",
    course: "Analista de Datos (Power BI)",
    avatar: genericAvatar,
  },
  {
    id: "carlos-medina",
    text: "Pasé de dudar a construir y lanzar microproyectos cada semana.",
    author: "Carlos Medina",
    country: "🇲🇽 México",
    course: "Aprender a programar",
    avatar: genericAvatar,
  },
  {
    id: "laura-perez",
    text: "Me sentí acompañada y evaluada con criterios claros hasta lograr mi objetivo.",
    author: "Laura Pérez",
    country: "🇪🇸 España",
    course: "Cursos de idiomas",
    avatar: genericAvatar,
  },
];
