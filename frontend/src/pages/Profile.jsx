// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import { useToast } from "../components/Toast";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const name = user?.displayName || user?.email || "Usuario";
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = useMemo(() => (searchParams.get('tab') === 'settings' ? 'settings' : 'profile'), [searchParams]);
  const [tab, setTab] = useState(initialTab);
  const toast = useToast();

  // Edición de perfil
  const [nameInput, setNameInput] = useState(user?.displayName || "");
  const [savingName, setSavingName] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Keep URL in sync when tab changes
    const next = new URLSearchParams(window.location.search);
    if (tab === 'settings') next.set('tab', 'settings'); else next.delete('tab');
    setSearchParams(next, { replace: true });
  }, [tab, setSearchParams]);

  useEffect(() => {
    setNameInput(user?.displayName || "");
  }, [user?.displayName]);

  function TabButton({ id, children }) {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        aria-selected={active}
        className={`px-3 py-2 text-sm rounded-lg border ${active ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-700 border-slate-300 hover:bg-slate-50'}`}
      >
        {children}
      </button>
    );
  }

  async function handleSaveName(e) {
    e?.preventDefault?.();
    if (!nameInput || !nameInput.trim()) return toast.error("El nombre no puede estar vacío");
    try {
      setSavingName(true);
      await updateUserProfile({ displayName: nameInput.trim() });
      toast.success("Nombre actualizado");
    } catch (e) {
      toast.error(e.message || "No se pudo actualizar el nombre");
    } finally {
      setSavingName(false);
    }
  }

  function onFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : "");
  }

  async function handleUploadPhoto() {
    if (!file) return toast.error("Selecciona una imagen primero");
    try {
      setUploading(true);
      const storage = getStorage();
      const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
      const path = `avatars/${user.uid}.${ext}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file, { contentType: file.type || 'image/jpeg' });
      const url = await getDownloadURL(ref);
      await updateUserProfile({ photoURL: url });
      toast.success("Foto actualizada");
      setFile(null); setPreview("");
    } catch (e) {
      toast.error(e.message || "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Topbar />
      <div className="pl-64 pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Perfil</h1>

          <div className="mb-4 flex items-center gap-2">
            <TabButton id="profile">Perfil</TabButton>
            <TabButton id="settings">Configuraciones</TabButton>
          </div>

          {tab === 'profile' && (
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
          )}

          {tab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Configuraciones</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Ajusta tus preferencias de cuenta.</p>
              <div className="mt-4 grid gap-4 text-sm">
                <form onSubmit={handleSaveName} className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                  <label htmlFor="displayName" className="block text-gray-500 dark:text-slate-400 mb-1">Nombre para mostrar</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="displayName"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Tu nombre"
                    />
                    <button type="submit" disabled={savingName} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm disabled:opacity-60">
                      {savingName ? 'Guardando…' : 'Guardar'}
                    </button>
                  </div>
                </form>

                <div className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                  <p className="text-gray-500 dark:text-slate-400 mb-2">Foto de perfil</p>
                  <div className="flex items-center gap-4">
                    <Avatar displayName={user?.displayName} email={user?.email} photoURL={preview || user?.photoURL} size={56} />
                    <input type="file" accept="image/*" onChange={onFileChange} className="text-sm" />
                    <button onClick={handleUploadPhoto} disabled={!file || uploading} className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm disabled:opacity-60">
                      {uploading ? 'Subiendo…' : 'Subir y guardar'}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                  <p className="text-gray-500 dark:text-slate-400">Notificaciones</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">Próximamente</p>
                </div>
                <div className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                  <p className="text-gray-500 dark:text-slate-400">Privacidad</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">Próximamente</p>
                </div>
              </div>
            </div>
          )}
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
