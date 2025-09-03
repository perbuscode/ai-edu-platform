import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col gap-3">
        {/* Texto de derechos */}
        <p className="text-sm">
          © 2025 AI Edu Platform. Todos los derechos reservados. <br />
          <a href="#terminos" className="hover:underline">Términos</a> |{" "}
          <a href="#privacidad" className="hover:underline">Privacidad</a>
        </p>

        {/* Redes sociales alineadas a la izquierda */}
        <div className="flex gap-5 text-lg">
          <a href="#" aria-label="Facebook" className="hover:text-white"><FaFacebook /></a>
          <a href="#" aria-label="Twitter" className="hover:text-white"><FaTwitter /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white"><FaLinkedin /></a>
          <a href="#" aria-label="YouTube" className="hover:text-white"><FaYoutube /></a>
          <a href="#" aria-label="TikTok" className="hover:text-white"><FaTiktok /></a>
        </div>
      </div>
    </footer>
  );
}
