// src/components/dashboard/sections/Materials.jsx
import React from "react";

export default function Materials({
  note = "Aquí encontrarás todos los materiales de estudio, como guías en PDF, ejercicios y recursos adicionales para descargar.",
}) {
  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Materiales de Estudio
      </h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-gray-600">
        {note}
      </div>
    </div>
  );
}
