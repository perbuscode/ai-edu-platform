# Changelog

## 2025-09-13 — Landing polish, Blog como sección, accesibilidad y branding

- Footer
  - Redes sociales reordenadas arriba y copyright abajo.
  - Uso de `&copy; 2025 AI EdTech. Todos los derechos reservados.` para compatibilidad.
- FAQ
  - `frontend/src/components/FAQ.jsx`: refactor a `details/summary` accesibles con transición suave; corrección de tildes y signos (español).
  - `frontend/src/pages/Faqs.jsx`: acordeón accesible con animación (altura/opacidad), flecha rotatoria y textos normalizados en español.
- Chat Planner (Genera tu plan)
  - La ilustración no se recorta (object-contain) y se integra al fondo sin bordes extra.
  - Recorte aplicado solo al contenedor del chat (clipPath inferior) para acabado limpio.
  - Altura del chat sincronizada dinámicamente con la altura visible de la imagen mediante `ref` y `resize`.
  - Ajustes de espaciado con secciones adyacentes (footer y blog) para ritmo visual consistente.
- Blog como sección del landing
  - Nuevo `frontend/src/components/BlogSection.jsx` y añadido bajo `ChatPlanner` en `App.js`.
  - Ruta `/blog` retirada del router; navegación desde navbar apunta a `#blog`.
- Navbar
  - Nuevo enlace “Historias” tras “Cursos” (desktop y móvil) y ancla `id="historias"` en `Testimonials`.
  - Reubicación del botón “¿Dudas?”: ahora aparece tras “Registrarse” o después del avatar si hay sesión.
  - Reemplazo del avatar del proyecto por el logo `public/images/logo-edvance.png` y aumento de tamaño (h-9/md:h-10).
  - Texto de marca actualizado a “Educación de avanzada”.

## v0.3.0 — MVP Plan + Progreso + Certificado (Unreleased)

- Backend: `POST /plan` con OpenAI (modo simulado si falta `OPENAI_API_KEY`).
- Guardado de plan en Firestore cuando hay usuario autenticado.
- Frontend: `ChatPlanner` ahora consume el endpoint real y muestra notificaciones en español.
- Persistencia: `StudyPlan` y `LessonNotes` guardan progreso y notas en Firestore (con fallback local).
- Certificados: generación de PDF (jsPDF) cuando el progreso alcanza 100%.
- Documentación actualizada (README) y test básico de integración del endpoint.

## v0.2.0 – Planner API + Firestore (Unreleased)

- Backend Node (Express) con endpoint `POST /api/plan`.
  - Usa OpenAI si hay `OPENAI_API_KEY`, con fallback a generador local determinístico.
  - CORS configurable por `CORS_ORIGIN`. Healthcheck en `/health`.
- Frontend: `ChatPlanner` ahora llama al backend, maneja carga/errores
  y abre el modal con el plan generado.
- Persistencia: si el usuario está autenticado, guarda el plan en
  `users/{uid}/plans/{planId}` en Firestore (con entrada y metadatos).
- Modal de Plan: acepta `plan` dinámico; conserva ejemplo por defecto.
- DX: `frontend/package.json` añade `proxy` a `http://localhost:4000` para dev.
- Docs: guía de backend y variables de entorno (`backend/README.md`).

## v0.1.0 – Polished MVP with Tailwind, conversational planner, and modal integration

- Tailwind + PostCSS configured; global styles set.
- Hero refined (exact copy, responsive centering, improved CTAs with animated fill).
- ValueSection cards redesigned (compact, professional, animated hover).
- Courses with image fallbacks and CTA that pre-fills chat and scrolls to planner.
- Testimonials with generic illustrative avatars and left-aligned title.
- ChatPlanner upgraded to conversational multi-step flow with auto-scroll and auto-generate plan on last answer; opens example plan modal automatically.
- FAQ floating widget styled with secondary blue and high z-index.
- Reusable Modal; PlanExampleModal with structured blocks and rubric.
- Footer actions refined; responsive alignment and animated CTA.
- Netlify `_redirects` ensured for SPA.

Tag: `v0.1.0`
