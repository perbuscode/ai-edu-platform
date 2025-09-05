// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import "../firebase";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const AuthContext = createContext(null);

function mapAuthError(error) {
  const code = error?.code || "auth/unknown";
  const map = {
    "auth/email-already-in-use": "Este correo ya está registrado.",
    "auth/invalid-email": "Correo inválido.",
    "auth/user-not-found": "Correo o contraseña incorrectos.",
    "auth/wrong-password": "Correo o contraseña incorrectos.",
    "auth/weak-password": "La contraseña debe tener al menos 8 caracteres.",
    "auth/popup-closed-by-user": "Ventana cerrada antes de completar.",
    "auth/popup-blocked": "El navegador bloqueó el popup. Intenta nuevamente.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
    "auth/network-request-failed": "Problema de red. Verifica tu conexión.",
    "auth/internal-error": "Ocurrió un error interno. Intenta nuevamente.",
  };
  return map[code] || "Ocurrió un error. Intenta nuevamente.";
}

export function AuthProvider({ children }) {
  const auth = useMemo(() => getAuth(), []);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((e) => {
      console.debug("[Auth] setPersistence fallo", e?.code || e);
    });
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      console.debug("[Auth] onAuthStateChanged →", fbUser ? { uid: fbUser.uid, email: fbUser.email } : null);
      setUser(fbUser);
      setLoading(false);
    });
    return () => unsub();
  }, [auth]);

  async function register({ name, email, password, photoURL }) {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name || photoURL) {
        await updateProfile(cred.user, { displayName: name || "", photoURL: photoURL || null });
      }
      console.debug("[Auth] register OK", cred.user?.uid);
      return cred.user;
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      console.debug("[Auth] register ERROR", e?.code || e, msg);
      throw new Error(msg);
    }
  }

  async function login({ email, password }) {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.debug("[Auth] login OK", cred.user?.uid);
      return cred.user;
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      console.debug("[Auth] login ERROR", e?.code || e, msg);
      throw new Error(msg);
    }
  }

  async function loginWithGoogle() {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const cred = await signInWithPopup(auth, provider);
      console.debug("[Auth] loginWithGoogle OK", cred.user?.uid);
      return cred.user;
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      console.debug("[Auth] loginWithGoogle ERROR", e?.code || e, msg);
      throw new Error(msg);
    }
  }

  async function resetPassword(email) {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      console.debug("[Auth] resetPassword OK", email);
      return true;
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      console.debug("[Auth] resetPassword ERROR", e?.code || e, msg);
      throw new Error(msg);
    }
  }

  async function logout() {
    setError(null);
    try {
      await signOut(auth);
      console.debug("[Auth] logout OK");
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      console.debug("[Auth] logout ERROR", e?.code || e, msg);
      throw new Error(msg);
    }
  }

  const value = { user, loading, error, register, login, loginWithGoogle, resetPassword, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
