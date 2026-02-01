import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, GraduationCap, CheckCircle2, FileText, AlertCircle } from "lucide-react";

interface NewApplicationFormProps {
  onSubmitted: (data: any) => void;
}

export function NewApplicationForm({ onSubmitted }: NewApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    school: "",
    class: "",
    documents: {
      diploma: null,
      transcript: null,
      motivation: null,
      birthCertificate: null,
      idCard: null
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (docType: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file
      }
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.school || !formData.class) {
      setIsSubmitting(false);
      return;
    }

    // Simulation d'une création de dossier
    const newEntry = {
      id: `CAND-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ticketNumber: `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000).toString().padStart(4, '0')}`,
      status: "pending",
      createdAt: new Date().toLocaleDateString(),
      school: formData.school,
      class: formData.class,
      student: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      documents: formData.documents,
      // Initialiser les documents avec statut "pending"
      requiredDocuments: {
        diploma: { status: 'pending', fileName: null },
        transcript: { status: 'pending', fileName: null },
        motivation: { status: 'pending', fileName: null },
        birthCertificate: { status: 'pending', fileName: null },
        idCard: { status: 'pending', fileName: null }
      }
    };

    setTimeout(() => {
      onSubmitted(newEntry);
      setIsSubmitting(false);
      
      // Réinitialiser le formulaire
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        school: "",
        class: "",
        documents: {
          diploma: null,
          transcript: null,
          motivation: null,
          birthCertificate: null,
          idCard: null
        }
      });
    }, 2000);
  };

  const requiredDocuments = [
    { id: 'diploma', name: 'Diplôme Baccalauréat', description: 'Obligatoire pour toute candidature' },
    { id: 'transcript', name: 'Bulletin de notes', description: 'Relevé des 3 dernières années' },
    { id: 'motivation', name: 'Lettre de motivation', description: 'Explique votre projet professionnel' },
    { id: 'birthCertificate', name: 'Acte de naissance', description: 'Copie certifiée conforme' },
    { id: 'idCard', name: 'Carte d\'identité nationale', description: 'En cours de validité' }
  ];

  const getDocumentStatus = (docId: string) => {
    const doc = formData.documents[docId as keyof typeof formData.documents];
    return doc ? 'uploaded' : 'pending';
  };

  const getDocumentIcon = (status: string) => {
    return status === 'uploaded' ? CheckCircle2 : AlertCircle;
  };

  const getDocumentColor = (status: string) => {
    return status === 'uploaded' ? 'text-green-600' : 'text-orange-600';
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Informations personnelles */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50/50">
          <CardTitle className="flex items-center gap-2 text-orange-800 text-lg">
            <GraduationCap className="h-5 w-5" />
            Informations Personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Prénom *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Votre prénom"
                className="w-full p-2.5 border rounded-lg focus:ring-2 ring-orange-200 outline-none transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nom *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Votre nom"
                className="w-full p-2.5 border rounded-lg focus:ring-2 ring-orange-200 outline-none transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full p-2.5 border rounded-lg focus:ring-2 ring-orange-200 outline-none transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Téléphone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+221 XX XXX XX XX"
                className="w-full p-2.5 border rounded-lg focus:ring-2 ring-orange-200 outline-none transition"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations académiques */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50/50">
          <CardTitle className="flex items-center gap-2 text-orange-800 text-lg">
            <GraduationCap className="h-5 w-5" />
            Informations Académiques
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">École souhaitée *</label>
              <select 
                className="w-full p-2.5 border rounded-lg focus:ring-2 ring-orange-200 outline-none transition"
                value={formData.school}
                onChange={(e) => handleInputChange('school', e.target.value)}
                required
              >
                <option value="">Sélectionnez une école</option>
                <option value="ISM Dakar">ISM Dakar</option>
                <option value="École Supérieure Polytechnique">École Supérieure Polytechnique</option>
                <option value="Institut des Sciences Juridiques">Institut des Sciences Juridiques</option>
                <option value="École des Arts et Métiers">École des Arts et Métiers</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Classe/Filière *</label>
              <select 
                className="w-full p-2.5 border rounded-lg focus:ring-2 ring-orange-200 outline-none transition"
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                required
              >
                <option value="">Sélectionnez une école d'abord</option>
                {formData.school === 'ISM Dakar' && (
                  <>
                    <option value="L1 Management">L1 Management</option>
                    <option value="L2 Management">L2 Management</option>
                    <option value="Master 1 Marketing">Master 1 Marketing</option>
                    <option value="Master 2 Finance">Master 2 Finance</option>
                    <option value="MBA 1">MBA 1</option>
                    <option value="MBA 2">MBA 2</option>
                  </>
                )}
                {formData.school === 'École Supérieure Polytechnique' && (
                  <>
                    <option value="Ingénieur 1 Informatique">Ingénieur 1 Informatique</option>
                    <option value="Ingénieur 2 Génie Civil">Ingénieur 2 Génie Civil</option>
                    <option value="Master 1 Data Science">Master 1 Data Science</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents requis */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50/50">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            Documents requis *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Instructions importantes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tous les documents sont obligatoires pour traiter votre candidature</li>
              <li>• Formats acceptés : PDF, JPG, PNG (maximum 5MB par fichier)</li>
              <li>• Les documents doivent être clairs et lisibles</li>
              <li>• Vous pourrez modifier ou remplacer les documents si nécessaire</li>
            </ul>
          </div>
          
          {requiredDocuments.map((doc) => {
            const status = getDocumentStatus(doc.id);
            const Icon = getDocumentIcon(status);
            const color = getDocumentColor(status);
            
            return (
              <div key={doc.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-5 w-5 ${color}`} />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.description}</p>
                      </div>
                    </div>
                    <Badge className={`${
                      status === 'uploaded' ? 'bg-green-100 text-green-800 border-green-300' : 
                      'bg-orange-100 text-orange-800 border-orange-300'
                    } text-xs`}>
                      {status === 'uploaded' ? 'Téléversé' : 'En attente'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-orange-400 cursor-pointer transition">
                      <Upload className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formData.documents[doc.id as keyof typeof formData.documents] ? 
                          formData.documents[doc.id as keyof typeof formData.documents].name : 
                          'Choisir un fichier'
                        }
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleFileUpload(doc.id, file);
                        }}
                        className="hidden"
                      />
                    </label>
                    {formData.documents[doc.id as keyof typeof formData.documents] && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            documents: {
                              ...prev.documents,
                              [doc.id]: null
                            }
                          }));
                        }}
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-bold shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-2"></div>
              Envoi en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Soumettre ma candidature
            </span>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-12 text-lg font-bold"
          onClick={() => {
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              school: "",
              class: "",
              documents: {
                diploma: null,
                transcript: null,
                motivation: null,
                birthCertificate: null,
                idCard: null
              }
            });
          }}
        >
          Réinitialiser
        </Button>
      </div>

      {/* Message de confirmation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Prêt à soumettre !</h4>
            <p className="text-sm text-green-700 mt-1">
              Vérifiez que toutes les informations sont correctes avant de soumettre votre candidature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}