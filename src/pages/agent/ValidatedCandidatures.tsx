import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Search, Calendar, Download } from "lucide-react";

interface ValidatedApplication {
  id: string;
  student: string;
  email: string;
  school: string;
  class: string;
  validatedDate: string;
  validatedBy: string;
  status: "enrolled" | "accepted" | "pending";
}

const ValidatedCandidatures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const validatedApplications: ValidatedApplication[] = [
    {
      id: "CAND-2024-001",
      student: "Alice Johnson",
      email: "alice.johnson@example.com",
      school: "École Polytechnique",
      class: "Première Année",
      validatedDate: "2024-12-15",
      validatedBy: "Agent Smith",
      status: "enrolled",
    },
    {
      id: "CAND-2024-002",
      student: "Bob Wilson",
      email: "bob.wilson@example.com",
      school: "HEC Paris",
      class: "MBA",
      validatedDate: "2024-12-10",
      validatedBy: "Agent Johnson",
      status: "enrolled",
    },
    {
      id: "CAND-2024-003",
      student: "Catherine Brown",
      email: "catherine.brown@example.com",
      school: "ESSEC",
      class: "Grande École",
      validatedDate: "2024-12-08",
      validatedBy: "Agent Smith",
      status: "accepted",
    },
    {
      id: "CAND-2024-004",
      student: "David Davis",
      email: "david.davis@example.com",
      school: "ENA",
      class: "Formation continue",
      validatedDate: "2024-12-05",
      validatedBy: "Agent Williams",
      status: "accepted",
    },
    {
      id: "CAND-2024-005",
      student: "Emma Wilson",
      email: "emma.wilson@example.com",
      school: "Sciences Po",
      class: "Master",
      validatedDate: "2024-12-01",
      validatedBy: "Agent Taylor",
      status: "pending",
    },
  ];

  const filteredApplications = validatedApplications.filter((app) => {
    const matchesSearch =
      app.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enrolled":
        return {
          className: "bg-green-100 text-green-800",
          label: "✓ Inscrit",
          icon: CheckCircle,
        };
      case "accepted":
        return {
          className: "bg-blue-100 text-blue-800",
          label: "✓ Accepté",
          icon: CheckCircle,
        };
      case "pending":
        return {
          className: "bg-yellow-100 text-yellow-800",
          label: "⏳ Inscription en cours",
          icon: CheckCircle,
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800",
          label: "Inconnu",
          icon: CheckCircle,
        };
    }
  };

  const stats = [
    { label: "Total validées", value: validatedApplications.length, color: "text-green-600" },
    { label: "Inscrits", value: validatedApplications.filter(a => a.status === "enrolled").length, color: "text-green-600" },
    { label: "Acceptés", value: validatedApplications.filter(a => a.status === "accepted").length, color: "text-blue-600" },
    { label: "En cours d'inscription", value: validatedApplications.filter(a => a.status === "pending").length, color: "text-yellow-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures validées</h1>
        <p className="text-gray-600">Suivi des candidatures acceptées et inscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-amber-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="border-amber-200">
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, email ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-amber-200 focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              className={filterStatus === "all" ? "bg-amber-600" : "border-amber-300 text-amber-600"}
              onClick={() => setFilterStatus("all")}
            >
              Tous
            </Button>
            <Button
              variant={filterStatus === "enrolled" ? "default" : "outline"}
              className={filterStatus === "enrolled" ? "bg-green-600" : "border-green-300 text-green-600"}
              onClick={() => setFilterStatus("enrolled")}
            >
              Inscrits
            </Button>
            <Button
              variant={filterStatus === "accepted" ? "default" : "outline"}
              className={filterStatus === "accepted" ? "bg-blue-600" : "border-blue-300 text-blue-600"}
              onClick={() => setFilterStatus("accepted")}
            >
              Acceptés
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              className={filterStatus === "pending" ? "bg-yellow-600" : "border-yellow-300 text-yellow-600"}
              onClick={() => setFilterStatus("pending")}
            >
              En cours
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card className="border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <CardTitle className="flex items-center justify-between">
            <span>Candidatures validées ({filteredApplications.length})</span>
            <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-100">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => {
                const statusBadge = getStatusBadge(app.status);
                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <p className="font-semibold text-gray-900">{app.student}</p>
                          <Badge className={statusBadge.className}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 ml-8">{app.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 ml-8 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">École</p>
                        <p className="font-semibold text-gray-900">{app.school}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Classe</p>
                        <p className="font-semibold text-gray-900">{app.class}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Date validation</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span className="font-semibold text-gray-900">{app.validatedDate}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Validé par</p>
                        <p className="font-semibold text-gray-900">{app.validatedBy}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune candidature trouvée</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidatedCandidatures;
