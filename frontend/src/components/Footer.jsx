import React from "react";
import { FaFacebook, FaYoutube, FaTiktok, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-6 text-center">
      <div className="mb-2 flex justify-center space-x-6 text-blue-700 text-xl">
        <a href="#"><FaFacebook /></a>
        <a href="#"><FaYoutube /></a>
        <a href="#"><FaTiktok /></a>
        <a href="#"><FaTwitter /></a>
        <a href="#"><FaLinkedin /></a>
      </div>
      <p className="text-sm text-gray-500">© 2025 AI Edu Platform. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
