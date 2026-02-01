import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Bell,
  Download,
  Edit,
  Phone,
  Calendar,
  Check,
  X,
  Info
} from "lucide-react";
import { authService } from "@/data/mockAuth";
import { useState } from "react";

const StudentDashboard = () => {
  const currentUser = authService.getCurrentUser();
  const [showNotifications, setShowNotifications] = useState(false);

  // Données enrichies de la candidature
  const candidature = {
    id: "CAND-2025-001",
    ticketNumber: "TKT-2025-0847",
    status: "pending", // pending, reviewing, validated, rejected
    createdAt: "2025-01-15",
    school: "Institut Supérieur de Management",
    class: "Master 1 Marketing",
    documents: [
      { name: "Diplôme Baccalauréat", status: "uploaded", uploadedAt: "2025-01-15" },
      { name: "Bulletin de notes", status: "uploaded", uploadedAt: "2025-01-15" },
      { name: "Lettre de motivation", status: "pending", uploadedAt: null }
    ],
    // Timeline de progression
    timeline: [
      { step: "Soumise", completed: true, date: "2025-01-15", description: "Candidature reçue" },
      { step: "En cours d'examen", completed: true, date: "2025-01-20", description: "Dossier en cours de révision" },
      { step: "Décision", completed: false, date: null, description: "Décision finale en attente" }
    ],
    // Historique des activités
    history: [
      { date: "2025-01-20 14:30", action: "Votre dossier est passé en revue", type: "info" },
      { date: "2025-01-18 10:15", action: "Document validé par l'administration", type: "success" },
      { date: "2025-01-15 16:45", action: "Candidature soumise avec succès", type: "success" }
    ],
    // Notifications
    notifications: [
      { id: 1, message: "Votre dossier est en cours d'examen", date: "2025-01-20", read: false },
      { id: 2, message: "Document manquant requis", date: "2025-01-18", read: true }
    ]
  };

  // Couleurs selon la charte graphique
  const getStatusColors = (status: string) => {
    switch(status) {
      case "pending":
        return { 
          bg: "bg-orange-50", 
          text: "text-orange-700", 
          border: "border-orange-200",
          badge: "bg-orange-100 text-orange-800 border-orange-300",
          label: "En attente",
          icon: Clock,
          color: "#f39320"
        };
      case "reviewing":
        return { 
          bg: "bg-amber-50", 
          text: "text-amber-700", 
          border: "border-amber-200",
          badge: "bg-amber-100 text-amber-800 border-amber-300",
          label: "En examen",
          icon: Clock,
          color: "#bc721e"
        };
      case "validated":
        return { 
          bg: "bg-green-50", 
          text: "text-green-700", 
          border: "border-green-200",
          badge: "bg-green-100 text-green-800 border-green-300",
          label: "Validée",
          icon: CheckCircle,
          color: "#22c55e"
        };
      case "rejected":
        return { 
          bg: "bg-red-50", 
          text: "text-red-700", 
          border: "border-red-200",
          badge: "bg-red-100 text-red-800 border-red-300",
          label: "Rejetée",
          icon: AlertCircle,
          color: "#ef4444"
        };
      default:
        return { 
          bg: "bg-gray-50", 
          text: "text-gray-700", 
          border: "border-gray-200",
          badge: "bg-gray-100 text-gray-800 border-gray-300",
          label: "Inconnu",
          icon: Info,
          color: "#6b7280"
        };
    }
  };

  const status = getStatusColors(candidature.status);
  const StatusIcon = status.icon;
  const unreadNotifications = candidature.notifications.filter(n => !n.read).length;

  const getHistoryIcon = (type: string) => {
    switch(type) {
      case "success": return CheckCircle;
      case "error": return X;
      default: return Info;
    }
  };

  const getHistoryColor = (type: string) => {
    switch(type) {
      case "success": return "text-green-600 bg-green-100";
      case "error": return "text-red-600 bg-red-100";
      default: return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec notifications */}
      <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-6 border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenue, {currentUser?.firstName}!
            </h1>
            <p className="text-gray-700">
              Suivez l'évolution de votre candidature en temps réel
            </p>
          </div>
          
          {/* Bouton notifications */}
          <div className="relative">
            <Button
              variant="outline"
              className="relative border-orange-300 text-orange-700 hover:bg-orange-50"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            
            {/* Dropdown notifications */}
            {showNotifications && (
              <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  {candidature.notifications.map(notif => (
                    <div key={notif.id} className={`p-3 rounded-lg mb-2 ${notif.read ? 'bg-gray-50' : 'bg-orange-50'}`}>
                      <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Carte principale avec statut et ticket */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Ma Candidature
            </div>
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              Ticket: {candidature.ticketNumber}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Statut avec couleur marquée */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Statut actuel</span>
              <div className={`${status.badge} px-6 py-3 rounded-full border text-sm font-bold flex items-center gap-2 shadow-sm`}>
                <StatusIcon className="h-5 w-5" />
                {status.label}
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Numéro de candidature</p>
                <p className="font-bold text-gray-900">{candidature.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date de soumission</p>
                <p className="font-bold text-gray-900">{candidature.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">École demandée</p>
                <p className="font-bold text-gray-900">{candidature.school}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Classe demandée</p>
                <p className="font-bold text-gray-900">{candidature.class}</p>
              </div>
            </div>

            {/* Bouton modifier (si en attente) */}
            {candidature.status === "pending" && (
              <div className="pt-4 border-t border-gray-200">
                <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier mes informations
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline de progression */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Timeline de progression
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative">
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300"></div>
            {candidature.timeline.map((step, index) => (
              <div key={index} className="relative flex items-center mb-8 last:mb-0">
                <div className={`w-8 h-8 rounded-full border-2 z-10 flex items-center justify-center ${
                  step.completed 
                    ? 'bg-orange-500 border-orange-500' 
                    : 'bg-white border-gray-300'
                }`}>
                  {step.completed ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  )}
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.step}
                    </h4>
                    {step.date && (
                      <span className="text-sm text-gray-500">{step.date}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historique de la candidature */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <CardTitle>Historique de la candidature</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {candidature.history.map((item, index) => {
              const HistoryIcon = getHistoryIcon(item.type);
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${getHistoryColor(item.type)}`}>
                    <HistoryIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <CardTitle>Documents de ma candidature</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {candidature.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <div>
                    <span className="font-medium text-gray-900">{doc.name}</span>
                    {doc.uploadedAt && (
                      <p className="text-xs text-gray-500">Uploadé le {doc.uploadedAt}</p>
                    )}
                  </div>
                </div>
                {doc.status === "uploaded" ? (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    ✓ Téléchargé
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                    ⏳ En attente
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Téléchargement de la décision */}
      {(candidature.status === "validated" || candidature.status === "rejected") && (
        <Card className="border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
            <CardTitle>Décision de candidature</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {candidature.status === "validated" ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">🎉 Félicitations !</h4>
                  <p className="text-green-700 mb-4">Votre candidature a été acceptée. Téléchargez votre lettre d'admission ci-dessous.</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger la lettre d'admission (PDF)
                  </Button>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Dossier non retenu</h4>
                  <p className="text-red-700 mb-2">Nous regrettons de vous informer que votre candidature n'a pas été retenue.</p>
                  <p className="text-sm text-red-600"><strong>Motif :</strong> Dossier incomplet - pièces justificatives manquantes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Download className="h-4 w-4 mr-2" />
              Télécharger le document manquant
            </Button>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
              <Phone className="h-4 w-4 mr-2" />
              Contacter le support ({candidature.ticketNumber})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Box avec numéro de ticket */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
        <p className="text-sm text-orange-900">
          <strong>💡 Numéro de ticket support :</strong> {candidature.ticketNumber} - 
          Référez-vous à ce numéro pour toute communication avec le support.
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
