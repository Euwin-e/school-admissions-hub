import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Youtube, Instagram, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* Top Section with Map and Info */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-4 py-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Left - Map Info */}
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">Dakar</h3>
            <p className="text-sm mb-1">22 Rue 1</p>
            <p className="text-sm mb-4">Dakar</p>
            <button className="text-amber-400 hover:text-amber-300 font-semibold underline text-sm">
              Voir le plan d'accès
            </button>
          </div>

          {/* Right - Social Media Icons */}
          <div className="flex justify-center gap-4">
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
          {/* P.D.A.U Info */}
          <div>
            <h3 className="text-amber-600 font-bold mb-3">P.D.A.U</h3>
            <p className="text-gray-400 text-sm">
              Plateforme moderne de digitalisation des admissions universitaires.
            </p>
          </div>

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
          <p>
            © 2026 P.D.A.U - Hackathon Campus Baobab - Tous droits réservés
          </p>
          <p className="mt-2">
            ISM, ÉTABLISSEMENT D'ENSEIGNEMENT SUPÉRIEUR PRIVÉ © 2024 - GALILEO GLOBAL EDUCATION - MENTIONS LÉGALES
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
