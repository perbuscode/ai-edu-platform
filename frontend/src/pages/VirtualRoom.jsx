// src/pages/VirtualRoom.jsx
import React from "react";
import DashboardLayout from "../app/DashboardLayout";
import useActiveSection from "../app/useActiveSection";
import { LuVideo, LuMic, LuScreenShare, LuUsers, LuPhoneOff } from "react-icons/lu";

export default function VirtualRoom() {
  const { activeId } = useActiveSection();
  const links = [
    { href: "#intro", label: "Inicio" },
    { href: "#cursos", label: "Mis cursos" },
    { href: "#mapa", label: "Mapa & Misiones" },
    { href: "#empleo", label: "Empleabilidad" },
  ];
  return (
    <DashboardLayout links={links} activeId={activeId} onLinkClick={() => {}}>
      <section className="bg-white rounded-xl shadow-xl border border-slate-200 text-slate-900 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200">
          <div>
            <h3 className="text-lg font-semibold">Salón Virtual (beta)</h3>
            <p className="text-sm text-slate-600">Espacio inmersivo para tutorías o copilotaje de proyectos.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-500">Sala:</span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono">AIEdu-1234</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          {/* Stage */}
          <div className="lg:col-span-3 bg-slate-950/95 text-slate-50 min-h-[55vh] grid">
            <div className="m-4 rounded-xl bg-slate-900/80 border border-white/10 grid place-items-center">
              <div className="text-center p-8">
                <div className="text-slate-400 text-sm">Escenario</div>
                <div className="mt-2 text-2xl font-semibold">Video/Screen aquí</div>
                <p className="mt-1 text-slate-400 text-sm">(Placeholder de integración)</p>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-center gap-3">
              <RoomButton icon={<LuMic size={16} />} label="Mic" />
              <RoomButton icon={<LuVideo size={16} />} label="Video" />
              <RoomButton icon={<LuScreenShare size={16} />} label="Compartir" />
              <RoomButton icon={<LuUsers size={16} />} label="Participantes" />
              <RoomButton icon={<LuPhoneOff size={16} />} label="Salir" danger />
            </div>
          </div>

          {/* Side panel */}
          <aside className="lg:col-span-1 border-l border-slate-200 bg-white min-h-[55vh] flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 font-medium">Notas compartidas</div>
            <div className="p-3 flex-1 overflow-auto text-sm">
              <p className="text-slate-600">• Objetivo de la sesión</p>
              <p className="text-slate-600">• Acciones acordadas</p>
              <p className="text-slate-600">• Próximos pasos</p>
            </div>
            <div className="px-3 py-3 border-t border-slate-200 flex gap-2">
              <input className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-300 outline-none" placeholder="Escribe una nota…" />
              <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm">Añadir</button>
            </div>
          </aside>
        </div>
      </section>
    </DashboardLayout>
  );
}

function RoomButton({ icon, label, danger }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${danger ? 'bg-red-600 text-white border-red-700 hover:bg-red-500' : 'bg-white/10 text-white border-white/15 hover:bg-white/15'}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

