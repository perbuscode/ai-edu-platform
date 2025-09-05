// src/components/dashboard/Topbar.jsx
import React from "react";

export default function Topbar({ title = "Bienvenido de vuelta", subtitle = "Continúa tu aprendizaje donde lo dejaste", actions }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle ? <p className="text-gray-600 mt-1">{subtitle}</p> : null}
        </div>
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      </div>
    </header>
  );
}
