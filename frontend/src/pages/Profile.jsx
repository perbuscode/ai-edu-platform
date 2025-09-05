// src/pages/Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const name = user?.displayName || user?.email || "Usuario";

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Perfil</h1>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <Avatar displayName={user?.displayName} email={user?.email} photoURL={user?.photoURL} size={56} />
            <div>
              <p className="text-gray-900 dark:text-slate-100 font-medium">{name}</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
              <p className="text-gray-500 dark:text-slate-400">Nombre para mostrar</p>
              <p className="font-medium text-gray-900 dark:text-slate-100">{user?.displayName || "—"}</p>
            </div>
            <div className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
              <p className="text-gray-500 dark:text-slate-400">Foto</p>
              <p className="font-medium text-gray-900 dark:text-slate-100">{user?.photoURL ? "Cargada" : "No definida"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ displayName, email, photoURL, size = 40 }) {
  const initial = (displayName || email || "?").trim().charAt(0).toUpperCase();
  if (photoURL) {
    return <img src={photoURL} alt={displayName || email || "Foto de perfil"} className="rounded-full" style={{ width: size, height: size }} />;
  }
  return (
    <div aria-hidden className="rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-100 grid place-items-center font-semibold" style={{ width: size, height: size }}>
      {initial}
    </div>
  );
}

