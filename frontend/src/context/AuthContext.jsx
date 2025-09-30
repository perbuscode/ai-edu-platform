// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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

/**
 * Envuelve una operación de autenticación para manejar el estado de error y el logging.
 * @param {() => Promise<any>} asyncFn La función asíncrona a ejecutar.
 * @param {string} debugKey Una clave para identificar la operación en los logs.
 */
async function authOperation(asyncFn, debugKey, setError) {
  setError(null);
  try {
    const result = await asyncFn();
    console.debug(`[Auth] ${debugKey} OK`, result?.user?.uid || result);
    return result;
  } catch (e) {
    const msg = mapAuthError(e);
    setError(msg);
    console.debug(`[Auth] ${debugKey} ERROR`, e?.code || e, msg);
    throw new Error(msg);
  }
}

export function AuthProvider({ children }) {
  const auth = useMemo(() => getAuth(), []);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function cloneUser(u) {
    if (!u) return u;
    return Object.assign(Object.create(Object.getPrototypeOf(u)), u);
  }

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((e) => {
      console.debug("[Auth] setPersistence fallo", e?.code || e);
    });
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      console.debug(
        "[Auth] onAuthStateChanged →",
        fbUser ? { uid: fbUser.uid, email: fbUser.email } : null
      );
      setUser(fbUser);
      setLoading(false);
    });
    return () => unsub();
  }, [auth]);

  async function register({ name, email, password, photoURL }) {
    return authOperation(
      async () => {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (name || photoURL) {
          await updateProfile(cred.user, {
            displayName: name || "",
            photoURL: photoURL || null,
          });
        }
        return cred.user;
      },
      "register",
      setError
    );
  }

  async function login({ email, password }) {
    return authOperation(
      () => signInWithEmailAndPassword(auth, email, password),
      "login",
      setError
    );
  }

  async function loginWithGoogle() {
    return authOperation(
      async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        return await signInWithPopup(auth, provider);
      },
      "loginWithGoogle",
      setError
    );
  }

  async function resetPassword(email) {
    return authOperation(
      () => sendPasswordResetEmail(auth, email),
      "resetPassword",
      setError
    );
  }

  async function logout() {
    return authOperation(() => signOut(auth), "logout", setError);
  }

  async function updateUserProfile(fields) {
    setError(null);
    try {
      const u = auth.currentUser;
      if (!u) throw new Error("No hay usuario autenticado");
      await updateProfile(u, fields);
      try {
        await u.reload();
      } catch (_error) {
        // noop
      }
      setUser(cloneUser(auth.currentUser));
      console.debug("[Auth] updateUserProfile OK", Object.keys(fields));
      return auth.currentUser;
    } catch (e) {
      const msg = mapAuthError(e);
      setError(msg);
      console.debug("[Auth] updateUserProfile ERROR", e?.code || e, msg);
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
    updateUserProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
