import React, { useState } from "react";
import { FaHome, FaBook, FaEnvelope, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <aside className={`bg-blue-700 text-white h-full p-4 transition-all ${open ? "w-60" : "w-16"}`}>
      <button onClick={() => setOpen(!open)} className="mb-6">
        <FaBars />
      </button>
      <nav className="space-y-4">
        <a href="#inicio" className="flex items-center space-x-2 hover:text-blue-200">
          <FaHome />
          {open && <span>Inicio</span>}
        </a>
        <a href="#cursos" className="flex items-center space-x-2 hover:text-blue-200">
          <FaBook />
          {open && <span>Cursos</span>}
        </a>
        <a href="#contacto" className="flex items-center space-x-2 hover:text-blue-200">
          <FaEnvelope />
          {open && <span>Contacto</span>}
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
