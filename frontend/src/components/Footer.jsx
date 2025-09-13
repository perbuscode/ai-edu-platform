// src/components/Footer.jsx
import React from "react";
import { SiYoutube, SiTiktok, SiFacebook, SiLinkedin, SiInstagram, SiX } from "react-icons/si";

export default function Footer({ onOpenExample }) {
  return (
    <footer id="contacto" className="bg-slate-900 border-t border-white/10 mt-[18px] scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm">
            <p className="text-slate-300">
              Edvance impulsando el aprendizaje con inteligencia artificial.
            </p>
            <p className="text-slate-400 mt-1">&copy; 2025 AI EdTech. Todos los derechos reservados.</p>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            {/* Orden alfabético: Facebook, Instagram, LinkedIn, TikTok, X, YouTube */}
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook (abre en una pestaña nueva)"
              title="Facebook"
              className="hover:text-white"
            >
              <SiFacebook size={20} aria-hidden />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (abre en una pestaña nueva)"
              title="Instagram"
              className="hover:text-white"
            >
              <SiInstagram size={20} aria-hidden />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (abre en una pestaña nueva)"
              title="LinkedIn"
              className="hover:text-white"
            >
              <SiLinkedin size={20} aria-hidden />
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok (abre en una pestaña nueva)"
              title="TikTok"
              className="hover:text-white"
            >
              <SiTiktok size={20} aria-hidden />
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (abre en una pestaña nueva)"
              title="X"
              className="hover:text-white"
            >
              <SiX size={20} aria-hidden />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube (abre en una pestaña nueva)"
              title="YouTube"
              className="hover:text-white"
            >
              <SiYoutube size={20} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
