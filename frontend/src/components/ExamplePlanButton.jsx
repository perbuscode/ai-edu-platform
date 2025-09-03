import React from "react";

export default function ExamplePlanButton({ variant = "dark", onClick }) {
  const baseClasses =
    "px-5 py-2 rounded-lg font-medium transition border";

  const styles =
    variant === "dark"
      ? "text-white border-white/40 hover:bg-white/10"
      : "text-slate-800 border-slate-400 hover:bg-slate-100";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${styles}`}
    >
      Ver plan de ejemplo
    </button>
  );
}
