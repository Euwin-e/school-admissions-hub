import React from "react";
import { Calendar, Monitor, Info, Award } from "lucide-react";
import { motion } from "framer-motion";

export const CharterStrip = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-teal-800 to-teal-700 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">Préparez votre rentrée en <span className="font-bold block">Licence/Bachelor</span></h4>
              <p className="text-sm opacity-90 mt-1">Les inscriptions sont ouvertes !</p>
              <a className="text-sm underline mt-2 inline-block" href="#">&gt;&gt;Plus d'informations</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-md">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">Préparez votre rentrée en <span className="font-bold block">Master/MBA</span></h4>
              <p className="text-sm opacity-90 mt-1">Les inscriptions sont ouvertes !</p>
              <a className="text-sm underline mt-2 inline-block" href="#">&gt;&gt;Plus d'information</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-md">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">Besoin d'information ?</h4>
              <p className="text-sm opacity-90 mt-1">Nous vous recontacterons dans un délai de 48h.</p>
              <a className="text-sm underline mt-2 inline-block" href="#">&gt;&gt;Je contacte l'ISM Dakar</a>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center md:justify-end">
          <div className="flex items-center gap-3 bg-white rounded-md px-4 py-2 text-teal-900 shadow">
            <div className="text-xs uppercase tracking-wide font-bold">100%<br/>Garantie</div>
            <div className="text-sm">continuité pédagogique</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CharterStrip;
