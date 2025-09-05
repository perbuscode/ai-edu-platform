// src/firebase.js
// Inicializa Firebase App. Completa los valores de firebaseConfig con tus credenciales
// de Firebase Console (Project settings → General → Your apps).
// Opcional: usa variables de entorno (CRA: REACT_APP_*, Vite: VITE_*).

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// CRA usa variables de entorno con prefijo REACT_APP_
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDd7UUF_-MamhPwTa6YCSGxs-C87rxoNpc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "ai-edu-project-4e9b9.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "ai-edu-project-4e9b9",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "ai-edu-project-4e9b9.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "812726253621",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:812726253621:web:fe83d1c67a6758931c997c",
};

// Evita reinicializar si ya existe
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Opcional: fuerza idioma del Auth a dispositivo/navegador
try {
  const auth = getAuth(app);
  auth.useDeviceLanguage(); // español si el navegador está en es-*
} catch (e) {
  // no-op
}
