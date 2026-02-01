import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ISMLogo } from "@/components/ISMLogo";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/data/mockAuth";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { fadeUp, stagger, pop } from "@/lib/animation";

const Connexion = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (email && password) {
      setLoading(true);
      // Simuler un délai réseau
      setTimeout(() => {
        const user = authService.login(email, password);
        
        if (user) {
          // Connexion réussie - redirection basée sur le rôle
          setLoading(false);
          
          // Redirection selon le rôle de l'utilisateur
          if (user.role === "student") {
            navigate("/student-dashboard");
          } else if (user.role === "agent") {
            navigate("/agent-dashboard");
          } else if (user.role === "director") {
            navigate("/director");
          } else if (user.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          // Connexion échouée
          setLoading(false);
          setError("Email ou mot de passe incorrect");
          setPassword("");
        }
      }, 1500);
    } else {
      setError("Veuillez remplir tous les champs");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <ISMLogo className="w-10 h-10" />
            <div>
              <h1 className="text-sm font-bold text-gray-900">ISM</h1>
              <p className="text-xs text-amber-600 font-semibold">P.D.A.U</p>
            </div>
          </button>
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-amber-600 font-medium transition"
            >
              Accueil
            </button>
            <button
              onClick={() => navigate("/inscription")}
              className="text-gray-600 hover:text-amber-600 font-medium transition"
            >
              Inscription
            </button>
            <a href="#" className="text-amber-600 font-medium">
              Connexion
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Title Section */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h1 variants={fadeUp} className="text-5xl md:text-5xl font-black text-gray-900 mb-4">
              Espace de <span className="text-amber-600">Connexion</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-gray-600">
               Connectez-vous à votre espace personnel
            </motion.p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Illustration */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl transform -rotate-6 opacity-30 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-amber-200 to-orange-200 rounded-3xl transform rotate-6 opacity-20 animate-pulse delay-75"></div>

                {/* Illustration Container */}
                <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-12 shadow-xl">
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      {/* Animated circles */}
                      <div className="absolute inset-0 bg-amber-600 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute inset-0 bg-amber-600 rounded-full opacity-40 animate-pulse"></div>
                      <ISMLogo className="w-24 h-24 relative z-10" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                    Bienvenue!
                  </h2>
                  <p className="text-center text-gray-600 text-sm leading-relaxed">
                    Connectez-vous à votre espace P.D.A.U pour accéder à votre tableau de bord personnalisé
                  </p>

                  {/* Decorative Elements */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition transform hover:scale-105">
                      <div className="text-2xl mb-1">📚</div>
                      <p className="text-xs text-gray-600 font-semibold">Candidatures</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition transform hover:scale-105">
                      <div className="text-2xl mb-1">✅</div>
                      <p className="text-xs text-gray-600 font-semibold">Validation</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition transform hover:scale-105">
                      <div className="text-2xl mb-1">📊</div>
                      <p className="text-xs text-gray-600 font-semibold">Rapports</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-8">
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🔐</span>
                  <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
                </motion.div>

              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 p-4">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}
                {/* Submit Button */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold rounded-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block animate-spin">⏳</span>
                      Connexion en cours...
                    </span>
                  ) : (
                    "Se Connecter ➜"
                  )}
                </Button>
              </motion.div>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-600">
                  Comptes de test
                </span>
              </div>
            </div>

            {/* Test Credentials Info */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-blue-900 font-semibold mb-3 text-sm">
                📝 Identifiants de test disponibles :
              </p>
              <ul className="space-y-2 text-xs text-blue-800">
                <li>
                  <strong>Étudiant :</strong> etudiant@example.com / password123
                </li>
                <li>
                  <strong>Agent :</strong> agent@example.com / password123
                </li>
                <li>
                  <strong>Directeur :</strong> directeur@example.com / password123
                </li>
                <li>
                  <strong>Admin :</strong> admin@example.com / password123
                </li>
              </ul>
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600">
                  Première visite ?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Button
              type="button"
              onClick={() => navigate("/inscription")}
              variant="outline"
              className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-50 py-3 text-lg font-semibold rounded-lg transition"
            >
              Créer une candidature
            </Button>
              </form>
            </div>
          </div>

          {/* Role Selection - Mobile Friendly */}
          <div className="md:hidden mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Rôles disponibles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border-2 border-amber-600 text-center hover:shadow-lg transition">
                <div className="text-3xl mb-2">👨‍🎓</div>
                <h4 className="font-bold text-gray-900">Étudiant</h4>
                <p className="text-xs text-gray-600">Accès à votre candidature</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300 text-center hover:shadow-lg transition">
                <div className="text-3xl mb-2">👨‍💼</div>
                <h4 className="font-bold text-gray-900">Agent</h4>
                <p className="text-xs text-gray-600">Gestion des candidatures</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300 text-center hover:shadow-lg transition">
                <div className="text-3xl mb-2">👔</div>
                <h4 className="font-bold text-gray-900">Directeur</h4>
                <p className="text-xs text-gray-600">Validation des dossiers</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300 text-center hover:shadow-lg transition">
                <div className="text-3xl mb-2">⚙️</div>
                <h4 className="font-bold text-gray-900">Admin</h4>
                <p className="text-xs text-gray-600">Gestion complète</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-75 {
          animation-delay: 0.75s;
        }
      `}</style>
    </div>
  );
};

export default Connexion;
