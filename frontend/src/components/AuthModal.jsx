// src/components/AuthModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import { useNavigate } from "react-router-dom";

const TABS = {
  login: "Iniciar sesión",
  register: "Registrarse",
  reset: "Recuperar contraseña",
};

export default function AuthModal({ open, onClose, defaultTab = "login" }) {
  const [tab, setTab] = useState(defaultTab);
  useEffect(() => setTab(defaultTab), [defaultTab]);

  const { error, login, register, loginWithGoogle, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Focus al abrir
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => firstFieldRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open, tab]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        // Evita cerrar durante operación en curso
        if (!submitting) onClose?.();
      }
      if (e.key === "Tab") {
        // Focus trap simple
        const focusable = dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const nodes = Array.from(focusable);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, submitting]);

  if (!open) return null;

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current && !submitting) onClose?.();
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={onOverlayClick}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm grid place-items-center p-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 id="auth-modal-title" className="text-slate-900 font-semibold">Acceso</h2>
          <button onClick={() => { if (!submitting) onClose?.(); }} className="text-slate-600 hover:text-slate-900 disabled:opacity-50" aria-label="Cerrar" disabled={submitting}>
            ×
          </button>
        </header>
        <nav className="px-3 pt-3">
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
            {Object.entries(TABS).map(([key, label]) => (
              <button
                key={key}
                className={(key === tab ? "bg-white text-slate-900" : "text-slate-600 hover:text-slate-900") + " rounded-md px-3 py-2 text-sm font-medium"}
                onClick={() => setTab(key)}
                aria-pressed={key === tab}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        <section className="px-5 py-4">
          {tab === "login" && (
            <LoginForm
              firstFieldRef={firstFieldRef}
              submitting={submitting}
              setSubmitting={setSubmitting}
              onSuccess={() => {
                toast.success("Sesión iniciada");
                onClose?.();
                navigate("/dashboard");
              }}
              errorFromContext={error}
              onLogin={login}
              onLoginWithGoogle={async () => {
                try {
                  setSubmitting(true);
                  await loginWithGoogle();
                  toast.success("Sesión iniciada con Google");
                  onClose?.();
                  navigate("/dashboard");
                } catch (e) {
                  toast.error(e.message);
                } finally {
                  setSubmitting(false);
                }
              }}
            />
          )}

          {tab === "register" && (
            <RegisterForm
              firstFieldRef={firstFieldRef}
              submitting={submitting}
              setSubmitting={setSubmitting}
              onSuccess={() => {
                toast.success("¡Registro exitoso! Bienvenido/a");
                onClose?.();
                navigate("/dashboard");
              }}
              errorFromContext={error}
              onRegister={register}
            />
          )}

          {tab === "reset" && (
            <ResetForm
              firstFieldRef={firstFieldRef}
              submitting={submitting}
              setSubmitting={setSubmitting}
              onSuccess={() => {
                toast.info("Te enviamos un enlace para restablecer tu contraseña");
                onClose?.();
              }}
              errorFromContext={error}
              onReset={resetPassword}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function isValidEmail(v) {
  return /\S+@\S+\.\S+/.test(v);
}
function isStrongPassword(v) {
  return v.length >= 8 && /\d/.test(v);
}

function Field({ label, id, type = "text", value, onChange, required, placeholder, autoComplete, invalid, inputRef }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}{required && <span className="text-rose-600"> *</span>}</label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        className={[
          "w-full rounded-lg border px-3 py-2 outline-none",
          "bg-white text-slate-900 placeholder-slate-500",
          "focus:ring-2",
          invalid ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-sky-500 focus:border-sky-500",
        ].join(" ")}
      />
    </div>
  );
}

function FormFooter({ submitting, submitLabel, onGoogle, showGoogle }) {
  return (
    <div className="mt-4 space-y-3">
      <button
        type="submit"
        aria-busy={submitting || undefined}
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 disabled:opacity-60"
      >
        {submitting && <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" aria-hidden="true" />} {submitLabel}
      </button>
      {showGoogle && (
        <button
          type="button"
          onClick={onGoogle}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white text-slate-900 px-4 py-2 border border-slate-300 hover:bg-slate-50"
        >
          <GoogleIcon /> Continuar con Google
        </button>
      )}
    </div>
  );
}

function LoginForm({ firstFieldRef, submitting, setSubmitting, onSuccess, errorFromContext, onLogin, onLoginWithGoogle }) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!isValidEmail(email)) e.email = "Correo inválido";
    if (!isStrongPassword(password)) e.password = "Mín. 8 caracteres y 1 número";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await onLogin({ email, password });
      onSuccess?.();
    } catch (err) {
      toast.error(errorFromContext || err.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <Field label="Email" id="login-email" type="email" value={email} onChange={setEmail} required placeholder="tucorreo@ejemplo.com" autoComplete="email" invalid={!!errors.email} inputRef={firstFieldRef} />
      <Field label="Contraseña" id="login-password" type="password" value={password} onChange={setPassword} required placeholder="••••••••" autoComplete="current-password" invalid={!!errors.password} />
      {errorFromContext && <p className="text-rose-600 text-sm" role="alert">{errorFromContext}</p>}
      <FormFooter submitting={submitting} submitLabel="Iniciar sesión" onGoogle={onLoginWithGoogle} showGoogle />
    </form>
  );
}

function RegisterForm({ firstFieldRef, submitting, setSubmitting, onSuccess, errorFromContext, onRegister }) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Tu nombre es obligatorio";
    if (!isValidEmail(email)) e.email = "Correo inválido";
    if (!isStrongPassword(password)) e.password = "Mín. 8 caracteres y 1 número";
    if (confirm !== password) e.confirm = "Las contraseñas no coinciden";
    if (!terms) e.terms = "Debes aceptar los términos";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await onRegister({ name, email, password, photoURL: photoURL || undefined });
      onSuccess?.();
    } catch (err) {
      toast.error(errorFromContext || err.message || "Error al registrarse");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <Field label="Nombre completo" id="reg-name" value={name} onChange={setName} required placeholder="Tu nombre y apellidos" autoComplete="name" invalid={!!errors.name} inputRef={firstFieldRef} />
      <Field label="Email" id="reg-email" type="email" value={email} onChange={setEmail} required placeholder="tucorreo@ejemplo.com" autoComplete="email" invalid={!!errors.email} />
      <Field label="Contraseña" id="reg-password" type="password" value={password} onChange={setPassword} required placeholder="••••••••" autoComplete="new-password" invalid={!!errors.password} />
      <Field label="Confirmar contraseña" id="reg-confirm" type="password" value={confirm} onChange={setConfirm} required placeholder="••••••••" autoComplete="new-password" invalid={!!errors.confirm} />
      <Field label="URL de foto (opcional)" id="reg-photo" type="url" value={photoURL} onChange={setPhotoURL} placeholder="https://..." autoComplete="photo" />

      <div className="flex items-start gap-2">
        <input id="reg-terms" type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} aria-invalid={!!errors.terms || undefined} className="mt-1" />
        <label htmlFor="reg-terms" className="text-sm text-slate-700">
          Acepto los <a href="#" className="text-sky-600 hover:underline">Términos</a> y la <a href="#" className="text-sky-600 hover:underline">Política de Privacidad</a>.
        </label>
      </div>
      {(errors.terms || errorFromContext) && (
        <p className="text-rose-600 text-sm" role="alert">{errors.terms || errorFromContext}</p>
      )}
      <FormFooter submitting={submitting} submitLabel="Crear cuenta" showGoogle={false} />
    </form>
  );
}

function ResetForm({ firstFieldRef, submitting, setSubmitting, onSuccess, errorFromContext, onReset }) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!isValidEmail(email)) e.email = "Correo inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await onReset(email);
      onSuccess?.();
    } catch (err) {
      toast.error(errorFromContext || err.message || "No se pudo enviar el correo de recuperación");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <Field label="Email" id="reset-email" type="email" value={email} onChange={setEmail} required placeholder="tucorreo@ejemplo.com" autoComplete="email" invalid={!!errors.email} inputRef={firstFieldRef} />
      {errorFromContext && <p className="text-rose-600 text-sm" role="alert">{errorFromContext}</p>}
      <FormFooter submitting={submitting} submitLabel="Enviar instrucciones" showGoogle={false} />
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.602 32.243 29.197 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.64 6.053 29.084 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.816C14.292 16.108 18.74 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.64 6.053 29.084 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.132 0 9.63-1.947 13.107-5.129l-6.062-4.995C29.018 35.255 26.641 36 24 36c-5.176 0-9.567-3.736-10.965-8.734l-6.54 5.036C9.792 39.556 16.338 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.357 3.243-4.443 5.799-8.099 6.876l.006-.004 6.062 4.995C31.018 39.255 36 36 36 24c0-1.341-.138-2.651-.389-3.917z"/>
    </svg>
  );
}
