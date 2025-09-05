// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// Asegura inicialización de Firebase App (src/firebase.js debe existir y llamar initializeApp)
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
  };
  return map[code] || "Ocurrió un error. Intenta nuevamente.";
}

export function AuthProvider({ children }) {
  const auth = useMemo(() => getAuth(), []);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
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
        await updateProfile(cred.user, {
          displayName: name || cred.user.displayName || "",
          photoURL: photoURL || cred.user.photoURL || null,
        });
      }
      // onAuthStateChanged actualizará user
      return cred.user;
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      throw new Error(msg);
    }
  }

  async function login({ email, password }) {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      throw new Error(msg);
    }
  }

  async function loginWithGoogle() {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const cred = await signInWithPopup(auth, provider);
      return cred.user;
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      throw new Error(msg);
    }
  }

  async function resetPassword(email) {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      throw new Error(msg);
    }
  }

  async function logout() {
    setError(null);
    try {
      await signOut(auth);
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      throw new Error(msg);
    }
  }

  const value = {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

