import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, X, Eye } from "lucide-react";

interface Application {
  id: string;
  student: string;
  email: string;
  school: string;
  class: string;
  date: string;
  priority: string;
  documents: number;
}

const CandidaturesToProcess = () => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const applications: Application[] = [
    {
      id: "CAND-001",
      student: "Jean Dupont",
      email: "jean.dupont@example.com",
      school: "École Polytechnique",
      class: "Première Année",
      date: "2025-01-20",
      priority: "high",
      documents: 3,
    },
    {
      id: "CAND-002",
      student: "Marie Martin",
      email: "marie.martin@example.com",
      school: "HEC Paris",
      class: "MBA",
      date: "2025-01-20",
      priority: "normal",
      documents: 4,
    },
    {
      id: "CAND-003",
      student: "Pierre Bernard",
      email: "pierre.bernard@example.com",
      school: "ESSEC",
      class: "Grande École",
      date: "2025-01-19",
      priority: "normal",
      documents: 2,
    },
    {
      id: "CAND-004",
      student: "Sophie Laurent",
      email: "sophie.laurent@example.com",
      school: "ENA",
      class: "Formation continue",
      date: "2025-01-19",
      priority: "low",
      documents: 3,
    },
    {
      id: "CAND-005",
      student: "Thomas Robert",
      email: "thomas.robert@example.com",
      school: "Sciences Po",
      class: "Master",
      date: "2025-01-18",
      priority: "high",
      documents: 4,
    },
  ];

  const filteredApplications = applications.filter(app =>
    app.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleValidate = () => {
    alert(`Candidature ${selectedApp?.id} validée !`);
    setSelectedApp(null);
  };

  const handleReject = () => {
    alert(`Candidature ${selectedApp?.id} rejetée !`);
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures à traiter</h1>
        <p className="text-gray-600">Examinez et validez les candidatures reçues</p>
      </div>

      {/* Search */}
      <div className="relative">
        <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Rechercher par nom, email ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 border-amber-200 focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <Card className="border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
              <CardTitle className="flex items-center justify-between">
                <span>Candidatures ({filteredApplications.length})</span>
                <Clock className="h-5 w-5 text-amber-600" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      selectedApp?.id === app.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 bg-gray-50 hover:border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{app.student}</p>
                        <p className="text-xs text-gray-500 mt-1">{app.id}</p>
                      </div>
                      <Badge className={getPriorityColor(app.priority)}>
                        {app.priority === "high"
                          ? "Urgent"
                          : app.priority === "normal"
                          ? "Normal"
                          : "Faible"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📍 {app.school}</span>
                      <span>📅 {app.date}</span>
                      <span>📄 {app.documents} documents</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune candidature trouvée</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        {selectedApp ? (
          <div className="space-y-4">
            <Card className="border-amber-200 sticky top-6">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                <CardTitle className="text-lg">{selectedApp.student}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Candidature Info */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">ID Candidature</p>
                  <p className="font-semibold text-gray-900">{selectedApp.id}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="font-semibold text-gray-900 break-all">{selectedApp.email}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">École demandée</p>
                  <p className="font-semibold text-gray-900">{selectedApp.school}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Classe demandée</p>
                  <p className="font-semibold text-gray-900">{selectedApp.class}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date de soumission</p>
                  <p className="font-semibold text-gray-900">{selectedApp.date}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Documents ({selectedApp.documents})</p>
                  <div className="space-y-2">
                    {["Diplôme", "Notes", "Lettre motivation"].slice(0, selectedApp.documents).map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleValidate}
                  >
                    ✓ Valider
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    onClick={handleReject}
                  >
                    ✗ Rejeter
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-600 hover:bg-amber-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-amber-200 bg-amber-50 flex items-center justify-center h-64 sticky top-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-amber-300 mx-auto mb-2" />
              <p className="text-gray-600">Sélectionnez une candidature pour voir les détails</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CandidaturesToProcess;
