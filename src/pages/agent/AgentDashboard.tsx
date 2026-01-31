import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, CheckCircle, Clock, Search, Filter } from "lucide-react";

const AgentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Données fictives pour le dashboard de l'agent
  const stats = [
    { label: "Candidatures en attente", value: "12", icon: Clock, color: "text-orange-600" },
    { label: "Validées ce mois", value: "28", icon: CheckCircle, color: "text-green-600" },
    { label: "À examiner", value: "8", icon: FileText, color: "text-blue-600" },
  ];

  const recentApplications = [
    { id: "CAND-001", student: "Jean Dupont", school: "École Polytechnique", date: "2025-01-20", priority: "high" },
    { id: "CAND-002", student: "Marie Martin", school: "HEC Paris", date: "2025-01-20", priority: "normal" },
    { id: "CAND-003", student: "Pierre Bernard", school: "ESSEC", date: "2025-01-19", priority: "normal" },
    { id: "CAND-004", student: "Sophie Laurent", school: "ENA", date: "2025-01-19", priority: "low" },
  ];

  const filteredApplications = recentApplications.filter(app =>
    app.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "high":
        return { bg: "bg-red-100", text: "text-red-700", label: "Urgent" };
      case "normal":
        return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Normal" };
      case "low":
        return { bg: "bg-gray-100", text: "text-gray-700", label: "Faible" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", label: "Inconnu" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 p-6 border border-amber-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tableau de bord Agent
        </h1>
        <p className="text-gray-700">
          Gérez les candidatures et suivez votre productivité
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <Card key={idx} className="border-amber-200 hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Candidatures à traiter */}
      <Card className="border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-600" />
              Candidatures récentes à traiter
            </span>
            <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-100">
              <Filter className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-500"
            />
          </div>

          {/* Applications List */}
          <div className="space-y-2">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => {
                const priorityBadge = getPriorityBadge(app.priority);
                return (
                  <div
                    key={app.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">{app.student}</span>
                        <span className={`text-xs font-semibold ${priorityBadge.bg} ${priorityBadge.text} px-2 py-1 rounded`}>
                          {priorityBadge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📍 {app.school}</span>
                        <span>📅 {app.date}</span>
                      </div>
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700 opacity-0 group-hover:opacity-100 transition ml-4">
                      Examiner
                    </Button>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4">Aucune candidature trouvée</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button className="bg-amber-600 hover:bg-amber-700 h-12 justify-start">
              ✓ Voir toutes les candidatures
            </Button>
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 h-12 justify-start">
              📊 Générer un rapport
            </Button>
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 h-12 justify-start">
              ⚙️ Configuration
            </Button>
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 h-12 justify-start">
              📧 Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDashboard;
