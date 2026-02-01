import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Youtube, Instagram, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Footer = () => {
  const navigate = useNavigate();
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* Top Section with Map and Info */}
      <div className="relative h-64 md:h-80">
        {/* Embedded Google Map as background */}
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.google.com/maps?q=Dakar,Senegal&z=13&output=embed"
          title="ISM Dakar - Plan"
          loading="lazy"
          aria-hidden="false"
        />

        {/* subtle overlay to improve contrast */}
        <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>

        <div className="relative max-w-7xl mx-auto h-full flex items-center justify-between px-4">
          {/* Left - Map Info (overlay box) */}
          <div className="bg-teal-900/90 text-white p-6 rounded-md w-full md:w-1/3 shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Dakar</h3>
            <p className="text-sm mb-1">22 Rue 1</p>
            <p className="text-sm mb-4">Dakar</p>
            <button onClick={() => setIsMapOpen(true)} className="text-amber-400 hover:text-amber-300 font-semibold underline text-sm">
              Voir le plan d'accès
            </button> 
          </div>

          {/* Right - Social Media Icons */}
          <div className="flex gap-4 ml-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-3 text-teal-700 hover:bg-amber-500 hover:text-white transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-3 text-teal-700 hover:bg-amber-500 hover:text-white transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-3 text-teal-700 hover:bg-amber-500 hover:text-white transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-3 text-teal-700 hover:bg-amber-500 hover:text-white transition"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-3 text-teal-700 hover:bg-amber-500 hover:text-white transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* ISM Logo and Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="border-2 border-amber-500 p-2 rounded">
                <div className="w-8 h-8 border border-amber-500 flex items-center justify-center text-amber-500 font-bold text-sm">
                  ISM
                </div>
              </div>
              <h3 className="text-amber-600 font-bold text-lg">P.D.A.U</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plateforme moderne de digitalisation des admissions universitaires.
            </p>
          </div>

          {/* Nos Écoles */}
          <div>
            <h3 className="text-amber-600 font-bold mb-6 text-lg">NOS ÉCOLES</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-amber-400 transition"
                >
                  ÉCOLE DE DROIT
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-amber-400 transition"
                >
                  ÉCOLE D'INGÉNIEURS
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-amber-400 transition"
                >
                  ÉCOLE DE MANAGEMENT
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-amber-400 transition"
                >
                  MADIBA LEADERSHIP INSTITUTE
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-amber-400 transition"
                >
                  ISM DIGITAL CAMPUS
                </button>
              </li>
            </ul>
          </div>

          {/* Links and CTA */}
          <div>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 text-base"
              >
                BROCHURE
              </Button>
              <Button
                onClick={() => navigate("/inscription")}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 text-base"
              >
                DOSSIER DE CANDIDATURE
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Contact and Quick Links */}
        <div className="grid md:grid-cols-3 gap-12 mb-8">
  
          {/* Quick Links */}
          <div>
            <h3 className="text-amber-600 font-bold mb-3">Liens Rapides</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-amber-400 transition"
                >
                  Inscription Étudiant
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/connexion")}
                  className="hover:text-amber-400 transition"
                >
                  Espace Connexion
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-amber-600 font-bold mb-3">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                ISM, Dakar, Sénégal
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <a
                  href="mailto:contact@pdau.sn"
                  className="hover:text-amber-400 transition"
                >
                  contact@pdau.sn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
          <p className="mt-2">
            ISM, ÉTABLISSEMENT D'ENSEIGNEMENT SUPÉRIEUR PRIVÉ © 2024 - GALILEO GLOBAL EDUCATION - MENTIONS LÉGALES
          </p>
        </div>
      </div>

      {/* Map Dialog */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="w-full max-w-6xl h-[80vh] p-0">
          <DialogHeader>
            <DialogTitle>Plan d'accès — ISM Dakar</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[calc(100%-56px)]">
            <iframe
              title="Plan d'accès - ISM Dakar"
              src="https://www.google.com/maps?q=ISM,Dakar,Senegal&z=16&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
