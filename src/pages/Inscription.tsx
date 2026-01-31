import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ISMLogo } from "@/components/ISMLogo";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Inscription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    nationality: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation simple
    if (
      formData.firstName &&
      formData.lastName &&
      formData.gender &&
      formData.dateOfBirth &&
      formData.email &&
      formData.phone &&
      formData.nationality
    ) {
      setSubmitted(true);
      // Simuler l'envoi
      console.log("Candidature soumise:", formData);
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      nationality: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-amber-600">
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
            <a href="#" className="text-amber-600 font-medium">
              Inscription
            </a>
            <button
              onClick={() => navigate("/connexion")}
              className="text-gray-600 hover:text-amber-600 font-medium transition"
            >
              Connexion
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-5xl font-black text-gray-900 mb-4">
              Formulaire d'<span className="text-amber-600">Inscription</span>
            </h1>
            <p className="text-lg text-gray-600">
              Complétez le formulaire ci-dessous pour soumettre votre candidature
            </p>
          </div>

          {/* Form Card */}
          {!submitted ? (
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section: Informations Personnelles */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Informations Personnelles
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Votre prénom"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sexe <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculin</SelectItem>
                          <SelectItem value="female">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date de Naissance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        placeholder="jj/mm/aaaa"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre.email@exemple.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+221 XX XXX XX XX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nationalité <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      placeholder="Votre nationalité"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-8 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50 py-6 text-lg font-semibold"
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-semibold"
                  >
                    Soumettre ma Candidature
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* Success Message */
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Candidature Soumise!
              </h2>
              <p className="text-gray-600 mb-8">
                Votre candidature a été enregistrée avec succès. Vous recevrez
                une confirmation par email sous peu.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
              >
                Retour à l'Accueil
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Inscription;
