# Frontend

Este directorio contiene la aplicación web (CRA + Tailwind + React Router + Firebase Auth).

## Estructura

- `/src`: Componentes, páginas, contexto y rutas.
- `/public`: HTML base y archivos estáticos.

## Puesta en marcha

1) Instalar dependencias

- En la raíz del repositorio elimina instalaciones previas si hay conflictos de React.
- En `frontend/` ejecuta: `npm install`

2) Variables de entorno

- Copia `frontend/.env.example` a `.env` o `.env.local` y completa los valores:
  - `REACT_APP_FIREBASE_API_KEY=`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN=`
  - `REACT_APP_FIREBASE_PROJECT_ID=`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET=`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID=`
  - `REACT_APP_FIREBASE_APP_ID=`

3) Configurar Firebase

- En Firebase Console → Authentication → Sign-in method: habilita Email/Password y Google.
- Agrega tu dominio de desarrollo/producción en “Authorized domains”.

4) Ejecutar en local

- Desde `frontend/`: `npm start`

## Autenticación (resumen)

- `src/firebase.js`: inicializa Firebase (usa `REACT_APP_*`).
- `src/context/AuthContext.jsx`: expone `register`, `login`, `loginWithGoogle`, `resetPassword`, `logout` y estado `user`, `loading`, `error`.
- `src/components/AuthModal.jsx`: modal accesible con pestañas Login/Registro/Recuperar, validación y Google Sign-In.
- `src/routes/ProtectedRoute.jsx`: protege `/dashboard`.
- `src/pages/Dashboard.jsx`: base para secciones/widgets.

Flujos UX:
- Tras registro/login/Google: cierra modal y navega a `/dashboard`.
- Reset de contraseña: muestra toast informativo.
- Logout: navega a `/` y muestra toast.

## Accesibilidad

- Modal con `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- Focus al abrir y trap de foco; cerrar con ESC/overlay cuando no hay envío en curso.
- Inputs con `aria-invalid` en error y botones con `aria-busy` durante envíos.

## Solución de problemas

Invalid hook call (BrowserRouter / useRef null):

- Causa típica: dos copias de React o desajuste de versiones entre React y ReactDOM/router.
- Solución:
  1. Detén todos los dev servers.
  2. Borra `node_modules` y `package-lock.json` en la raíz y en `frontend/` si es necesario.
  3. En la raíz: `npm install` (no agregues React aquí).
  4. En `frontend/`: `npm install`.
  5. Arranca solo desde `frontend/`: `npm start`.
- Verifica en consola: debe registrarse una única versión de React (18.2.0).

Credenciales Firebase:

- Si aparece error de configuración, revisa `src/firebase.js` y `.env`.
- Tras cambiar `.env`, reinicia el dev server.

## QA rápida

- Navbar → “Registrarse” → completa formulario → redirige a `/dashboard` y cierra modal.
- Navbar → “Iniciar sesión” (email/contraseña/Google) → redirige a `/dashboard`.
- Recuperar contraseña → muestra toast de confirmación.
- `/dashboard` protegido (si no hay sesión, vuelve a `/`).

