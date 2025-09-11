// src/components/Topbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu";

export default function Topbar({ leftOffsetClass = 'left-64' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className={`fixed ${leftOffsetClass} right-0 top-0 h-16 bg-slate-900/60 border-b border-white/10 backdrop-blur z-30 flex items-center transition-[left] duration-300 ease-in-out`}>
      <div className="max-w-7xl mx-auto w-full px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-base md:text-lg font-semibold">Dashboard del estudiante</h1>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <UserMenu
              user={user}
              avatarSize={28}
              items={[
                { type: 'link', to: '/profile?tab=settings', label: 'Configuración' },
                { type: 'button', label: 'Cerrar sesión', onClick: handleLogout },
              ]}
            />
          )}
        </div>
      </div>
    </header>
  );
}

