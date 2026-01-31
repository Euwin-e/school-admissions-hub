import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { authService } from "@/data/mockAuth";

const StudentDashboard = () => {
  const currentUser = authService.getCurrentUser();

  // Données fictives de la candidature de l'étudiant
  const candidature = {
    id: "CAND-2025-001",
    status: "pending",
    createdAt: "2025-01-15",
    documents: [
      { name: "Diplôme Bac", status: "uploaded" },
      { name: "Bulletin de notes", status: "uploaded" },
      { name: "Lettre de motivation", status: "pending" }
    ],
    school: "École Polytechnique",
    class: "Première Année",
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", label: "En attente" };
      case "validated":
        return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Validée" };
      case "rejected":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Rejetée" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", label: "Inconnu" };
    }
  };

  const status = getStatusBadge(candidature.status);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 p-6 border border-amber-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenue, {currentUser?.firstName}!
        </h1>
        <p className="text-gray-700">
          Consultez le statut de votre candidature et suivez votre progression
        </p>
      </div>

      {/* Candidature Status */}
      <Card className="border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600" />
            Ma Candidature
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Statut</span>
              <div className={`${status.bg} ${status.text} ${status.border} px-4 py-2 rounded-full border text-sm font-semibold flex items-center gap-2`}>
                {candidature.status === "pending" && <Clock className="h-4 w-4" />}
                {candidature.status === "validated" && <CheckCircle className="h-4 w-4" />}
                {candidature.status === "rejected" && <AlertCircle className="h-4 w-4" />}
                {status.label}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Numéro de candidature</p>
                <p className="font-semibold text-gray-900">{candidature.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date de soumission</p>
                <p className="font-semibold text-gray-900">{candidature.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">École demandée</p>
                <p className="font-semibold text-gray-900">{candidature.school}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Classe demandée</p>
                <p className="font-semibold text-gray-900">{candidature.class}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <CardTitle>Documents de ma candidature</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {candidature.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-amber-300 transition">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-gray-900">{doc.name}</span>
                </div>
                {doc.status === "uploaded" ? (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    ✓ Téléchargé
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    ⏳ En attente
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Télécharger le document manquant
            </Button>
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
              Contacter le support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-blue-900">
          <strong>💡 Info :</strong> Votre candidature a été reçue. Vous recevrez une notification dès que notre équipe aura examiné votre dossier.
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
