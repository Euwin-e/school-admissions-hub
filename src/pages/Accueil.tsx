import { Button } from "@/components/ui/button";
import { ISMLogo } from "@/components/ISMLogo";
import { Check, Users, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import CharterStrip from "@/components/CharterStrip";
import { motion } from "framer-motion";
import { fadeUp, stagger, pop } from "@/lib/animation";

const Accueil = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ISMLogo className="w-10 h-10" />
            <div>
              <h1 className="text-sm font-bold text-gray-900">ISM</h1>
              <p className="text-xs text-amber-600 font-semibold">P.D.A.U</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-gray-600 hover:text-amber-600 font-medium">
              Accueil
            </a>
            <button
              onClick={() => navigate("/inscription")}
              className="text-gray-600 hover:text-amber-600 font-medium transition"
            >
              Inscription
            </button>
            <button
              onClick={() => navigate("/connexion")}
              className="text-gray-600 hover:text-amber-600 font-medium transition"
            >
              Connexion
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Hackathon Campus Baobab 2026
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Bienvenue sur <span className="text-amber-600">P.D.A.U</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 mb-8 leading-relaxed">
              La plateforme moderne qui révolutionne les admissions universitaires. 
              Centralisez vos candidatures, validez en toute transparence et gérez 
              automatiquement vos effectifs par école et par classe.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div variants={fadeUp} whileHover={pop.hover} whileTap={pop.tap}>
                <Button
                  onClick={() => navigate("/inscription")}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-6 rounded-lg font-semibold"
                >
                  Postuler Maintenant →
                </Button>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={pop.hover} whileTap={pop.tap}>
                <Button 
                  onClick={() => navigate("/connexion")}
                  variant="outline" 
                  className="border-amber-600 text-amber-600 hover:bg-amber-50 text-lg px-8 py-6 rounded-lg font-semibold"
                >
                  Se Connecter
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-100">
                    <Check className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Candidature simplifiée</h3>
                  <p className="text-gray-600 text-sm">Processus 100% en ligne</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-100">
                    <Check className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Validation rapide</h3>
                  <p className="text-gray-600 text-sm">Suivi en temps réel</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-100">
                    <Download className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Export automatique</h3>
                  <p className="text-gray-600 text-sm">Fichiers Excel prêts</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-100 rounded-lg h-2"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 text-center">
          <div>
            <p className="text-4xl font-black text-amber-600">100%</p>
            <p className="text-gray-600 text-sm mt-2">Digital</p>
          </div>
          <div>
            <p className="text-4xl font-black text-amber-600">0</p>
            <p className="text-gray-600 text-sm mt-2">Papier</p>
          </div>
          <div>
            <p className="text-4xl font-black text-amber-600">∞</p>
            <p className="text-gray-600 text-sm mt-2">Efficacité</p>
          </div>
        </div>
      </section>

      {/* Charter / Info Strip */}
      <CharterStrip />

      {/* Why Choose Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-16">
            Pourquoi choisir <span className="text-amber-600">P.D.A.U</span> ?
          </h2>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeUp} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-purple-100 mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-3">
                Centralisation Totale
              </h3>
              <p className="text-gray-600 text-center">
                Toutes les candidatures en un seul endroit. Fini les emails dispersés.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-green-100 mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-3">
                Validation Intuitive
              </h3>
              <p className="text-gray-600 text-center">
                Interface dédiée pour les directeurs avec historique complet.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-blue-100 mx-auto mb-6">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-3">
                Export Automatique
              </h3>
              <p className="text-gray-600 text-center">
                Génération instantanée de fichiers Excel par école et classe.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Accueil;
