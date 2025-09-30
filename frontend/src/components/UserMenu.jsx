// src/components/UserMenu.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function UserMenu({
  user,
  items = [],
  avatarSize = 28,
  showName = true,
}) {
  const [open, setOpen] = useState(false);
  if (!user) return null;
  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (window.__avatarClose) clearTimeout(window.__avatarClose);
        setOpen(true);
      }}
      onMouseLeave={() => {
        if (window.__avatarClose) clearTimeout(window.__avatarClose);
        window.__avatarClose = setTimeout(() => setOpen(false), 250);
      }}
    >
      <button
        type="button"
        className="flex items-center gap-2 text-slate-200 hover:text-white"
        aria-expanded={open || undefined}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar
          displayName={user.displayName}
          email={user.email}
          photoURL={user.photoURL}
          size={avatarSize}
        />
        {showName && (
          <span className="hidden lg:inline text-sm">
            {user.displayName || user.email}
          </span>
        )}
      </button>
      <div
        role="menu"
        className={`absolute right-0 mt-2 w-48 rounded-lg bg-white shadow border border-slate-200 py-1 origin-top-right transform transition duration-200 ease-out ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
        aria-hidden={open ? undefined : true}
      >
        {items.map((it, idx) => {
          if (it.type === "link") {
            return (
              <Link
                key={idx}
                to={it.to}
                onClick={it.onClick}
                className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {it.label}
              </Link>
            );
          }
          return (
            <button
              key={idx}
              onClick={it.onClick}
              className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Avatar({ displayName, email, photoURL, size = 28 }) {
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
      className="rounded-full bg-slate-200 text-slate-700 grid place-items-center font-semibold"
      style={{ width: size, height: size }}
    >
      {initial}
    </div>
  );
}
