// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import { useToast } from "../components/Toast";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { loadUserProfile, saveUserProfile } from "../services/userProfile";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const name = user?.displayName || user?.email || "Usuario";
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = useMemo(
    () => (searchParams.get("tab") === "settings" ? "settings" : "profile"),
    [searchParams]
  );
  const [tab, setTab] = useState(initialTab);
  const toast = useToast();

  // Edición de perfil
  const [nameInput, setNameInput] = useState(user?.displayName || "");
  const [savingName, setSavingName] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Datos de perfil adicionales
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profile, setProfile] = useState({
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    phone: "",
    birthDate: "",
    gender: "",
    documentId: "",
    occupation: "",
    website: "",
    bio: "",
  });

  useEffect(() => {
    // Keep URL in sync when tab changes
    const next = new URLSearchParams(window.location.search);
    if (tab === "settings") next.set("tab", "settings");
    else next.delete("tab");
    setSearchParams(next, { replace: true });
  }, [tab, setSearchParams]);

  useEffect(() => {
    setNameInput(user?.displayName || "");
  }, [user?.displayName]);

  // Cargar datos adicionales del perfil desde Firestore
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!user?.uid) {
        setProfileLoading(false);
        return;
      }
      try {
        setProfileLoading(true);
        const data = await loadUserProfile(user.uid);
        if (!cancelled && data) {
          setProfile((p) => ({
            ...p,
            address: data.address || "",
            country: data.country || "",
            state: data.state || "",
            city: data.city || "",
            zip: data.zip || "",
            phone: data.phone || "",
            birthDate: data.birthDate || "",
            gender: data.gender || "",
            documentId: data.documentId || "",
            occupation: data.occupation || "",
            website: data.website || "",
            bio: data.bio || "",
          }));
        }
      } catch (e) {
        // Ignorar errores de carga para no bloquear la UI
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  function TabButton({ id, children }) {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        aria-selected={active}
        className={`px-3 py-2 text-sm rounded-lg border ${active ? "bg-sky-600 text-white border-sky-600 shadow" : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"} transition-colors`}
      >
        {children}
      </button>
    );
  }

  async function handleSaveName(e) {
    e?.preventDefault?.();
    if (!nameInput || !nameInput.trim())
      return toast.error("El nombre no puede estar vacío");
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
      const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
      const path = `avatars/${user.uid}.${ext}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file, { contentType: file.type || "image/jpeg" });
      const url = await getDownloadURL(ref);
      await updateUserProfile({ photoURL: url });
      toast.success("Foto actualizada");
      setFile(null);
      setPreview("");
    } catch (e) {
      toast.error(e.message || "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* En settings ocultamos sidebar: topbar a ancho completo */}
      <Topbar leftOffsetClass="left-0" showLogo />
      <div className="pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
            Perfil
          </h1>

          <div className="mb-4 flex items-center gap-2">
            <TabButton id="profile">Perfil</TabButton>
            <TabButton id="settings">Configuraciones</TabButton>
          </div>

          {tab === "profile" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-slate-900">
              <div className="flex items-center gap-4">
                <Avatar
                  displayName={user?.displayName}
                  email={user?.email}
                  photoURL={user?.photoURL}
                  size={56}
                />
                <div>
                  <p className="text-gray-900 font-medium">{name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-white">
                  <p className="text-slate-700 font-medium">
                    Nombre para mostrar
                  </p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {user?.displayName || "—"}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-white">
                  <p className="text-slate-700 font-medium">Foto</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    {user?.photoURL ? "Cargada" : "No definida"}
                  </p>
                </div>
              </div>
              {/* Formulario de datos personales */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  Datos personales
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Completa tu informacion para una experiencia mas
                  personalizada.
                </p>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!user?.uid)
                      return toast.error("Inicia sesión para guardar cambios");
                    try {
                      setProfileSaving(true);
                      await saveUserProfile(user.uid, profile);
                      toast.success("Datos guardados");
                    } catch (e) {
                      toast.error(
                        e?.message || "No se pudieron guardar los datos"
                      );
                    } finally {
                      setProfileSaving(false);
                    }
                  }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="address"
                    >
                      Direccion
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, address: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Calle 123, apto..."
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="country"
                    >
                      Pais
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={profile.country}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, country: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Colombia, Mexico..."
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="state"
                    >
                      Estado/Provincia
                    </label>
                    <input
                      id="state"
                      type="text"
                      value={profile.state}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, state: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="city"
                    >
                      Ciudad
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={profile.city}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, city: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="zip"
                    >
                      Codigo postal
                    </label>
                    <input
                      id="zip"
                      type="text"
                      value={profile.zip}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, zip: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="phone"
                    >
                      Telefono
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="+57 300 000 0000"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="birthDate"
                    >
                      Fecha de nacimiento
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      value={profile.birthDate}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, birthDate: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="gender"
                    >
                      Genero
                    </label>
                    <select
                      id="gender"
                      value={profile.gender}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, gender: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                      <option value="">Selecciona</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decirlo">
                        Prefiero no decirlo
                      </option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="documentId"
                    >
                      Documento
                    </label>
                    <input
                      id="documentId"
                      type="text"
                      value={profile.documentId}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          documentId: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="DNI / CC / Pasaporte"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="occupation"
                    >
                      Ocupacion
                    </label>
                    <input
                      id="occupation"
                      type="text"
                      value={profile.occupation}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          occupation: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Estudiante, Analista..."
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="website"
                    >
                      Sitio web
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={profile.website}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, website: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm text-slate-700 font-medium mb-1"
                      htmlFor="bio"
                    >
                      Biografia
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, bio: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Cuentanos un poco sobre ti"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={profileSaving || profileLoading}
                      className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm disabled:opacity-60"
                    >
                      {profileSaving ? "Guardando..." : "Guardar datos"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-slate-900">
              <h2 className="text-lg font-semibold text-gray-900">
                Configuraciones
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Ajusta tus preferencias de cuenta.
              </p>
              <div className="mt-4 grid gap-4 text-sm">
                <form
                  onSubmit={handleSaveName}
                  className="p-4 rounded-lg border border-dashed border-gray-300 bg-white"
                >
                  <label
                    htmlFor="displayName"
                    className="block text-slate-700 font-medium mb-1"
                  >
                    Nombre para mostrar
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="displayName"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Tu nombre"
                    />
                    <button
                      type="submit"
                      disabled={savingName}
                      className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm disabled:opacity-60"
                    >
                      {savingName ? "Guardando…" : "Guardar"}
                    </button>
                  </div>
                </form>

                <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-white">
                  <p className="text-slate-700 mb-2">Foto de perfil</p>
                  <div className="flex items-center gap-4">
                    <Avatar
                      displayName={user?.displayName}
                      email={user?.email}
                      photoURL={preview || user?.photoURL}
                      size={56}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="text-sm"
                    />
                    <button
                      onClick={handleUploadPhoto}
                      disabled={!file || uploading}
                      className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm disabled:opacity-60"
                    >
                      {uploading ? "Subiendo…" : "Subir y guardar"}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-white">
                  <p className="text-slate-700">Notificaciones</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    Próximamente
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-white">
                  <p className="text-slate-700">Privacidad</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    Próximamente
                  </p>
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
    return (
      <img
        src={photoURL}
        alt={displayName || email || "Foto de perfil"}
        className="rounded-full"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      aria-hidden
      className="rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-100 grid place-items-center font-semibold"
      style={{ width: size, height: size }}
    >
      {initial}
    </div>
  );
}
