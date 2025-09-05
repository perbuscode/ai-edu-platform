// src/components/dashboard/sections/Progress.jsx
import React from "react";

export default function Progress({ summary = "Aquí verás estadísticas detalladas de tu progreso académico." }) {
  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Mi Progreso</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-gray-600">
        {summary}
      </div>
    </div>
  );
}

