// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Linkedin,
  Music4 as TiktokIcon,
  Youtube,
} from "lucide-react";

const socialLinks = [
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    icon: <Youtube size={20} aria-hidden />,
  },
  {
    href: "https://www.tiktok.com/",
    label: "TikTok",
    icon: <TiktokIcon size={20} aria-hidden />,
  },
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    icon: <Facebook size={20} aria-hidden />,
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    icon: <Linkedin size={20} aria-hidden />,
  },
];

const footerLinks = [
  { to: "/terms", label: "Términos y Condiciones" },
  { to: "/privacy", label: "Política de Privacidad" },
  { to: "/contacto", label: "Contacto" },
];

export default function Footer({ className = "" }) {
  return (
    <footer
      className={`${className} py-8 transition-all duration-300 ease-in-out bg-transparent`}
    >
      <div className="max-w-7xl mx-auto px-5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm">
            <p className="text-slate-300">
              Edvance impulsando el aprendizaje con inteligencia artificial.
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (abre en una pestaña nueva)`}
                title={link.label}
                className="hover:text-white"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-400">
          <p>&copy; 2025 AI EdTech. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-white hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
