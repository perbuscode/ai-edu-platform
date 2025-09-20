# Edvance

Plataforma educativa basada en IA que permite a los usuarios solicitar cursos personalizados, con clases generadas automáticamente, tutor virtual, evaluación y certificación final.

## MVP Actual (alcance)

- Endpoint `POST /plan` (Node.js + OpenAI) que genera un plan de estudio en JSON y lo guarda en Firestore si hay usuario autenticado.
- Componente de planificación en el frontend conectado al backend (UI en español, toasts para errores).
- Persistencia de progreso de lecciones en Firestore (pasos completados y notas), con respaldo en localStorage.
- Descarga de certificado básico en PDF cuando el plan/clase alcanza 100% de progreso.
- Tests básicos de integración en backend (Jest + Supertest).

## Estructura del Proyecto

- `frontend/`: Aplicación web (React + CRA)
- `backend/`: API y orquestación de IA (OpenAI, Firestore Admin)
- `data/`: Prompts, ejemplos y contenidos generados
- `docs/`: Documentación técnica y de negocio

## Configuración y ejecución (local)

1) Backend (API de planes)

- Entrar a `backend/` y copiar `.env.example` a `.env`.
- Establecer `OPENAI_API_KEY`. Si no la configuras, el backend usa un plan simulado (modo mock).
- Opcional Firestore: define `GOOGLE_APPLICATION_CREDENTIALS` con la ruta al JSON de service account o `FIREBASE_SERVICE_ACCOUNT` (contenido JSON) para guardar planes bajo `users/{uid}/plans`.
- Instalar y ejecutar:
  - `npm i`
  - `npm start` (por defecto puerto 5050)
- Tests: `npm test` (usa mock automáticamente)

2) Frontend (React)

- Entrar a `frontend/` y crear/editar `.env.local` con:
  - `REACT_APP_API_BASE_URL=http://localhost:5050`
- Instalar y ejecutar:
  - `npm i`
  - `npm start`

## Funcionalidades clave

- Planificación: `ChatPlanner` recopila objetivo, experiencia y tiempo, llama a `POST /plan` y muestra el plan (abre modal con el plan recibido).
- Persistencia de progreso: `StudyPlan` y `LessonNotes` guardan en Firestore (si hay usuario) y localStorage como respaldo.
- Certificado: cuando `StudyPlan` llega a 100%, botón para descargar certificado PDF (jsPDF) en español.

## Notas

- UI en español (guardar archivos en UTF‑8 para evitar problemas de codificación).
- En despliegues sin backend, puedes dejar sin `OPENAI_API_KEY` o activar `MOCK_PLAN=1` para planes simulados.

## Autor
GitHub: [perbuscode](https://github.com/perbuscode)
