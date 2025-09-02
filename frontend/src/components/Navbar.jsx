import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-700">AI Edu Platform</div>
      <div className="space-x-4">
        <button className="text-blue-700 border border-blue-700 px-4 py-2 rounded hover:bg-blue-50">
          Iniciar sesión
        </button>
        <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Registrarse
        </button>
      </div>
    </header>
  );
};

export default Navbar;
