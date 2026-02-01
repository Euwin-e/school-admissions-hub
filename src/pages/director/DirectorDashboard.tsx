import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  FileText,
  Eye,
  Check,
  X
} from "lucide-react";
import { authService } from "@/data/mockAuth";
import { getStoredApplications, type Application } from "@/data/applicationsRepository";
import { getSchoolById, getClassById } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export default function DirectorDashboard() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Ensure applications are initialized
  const applications = getStoredApplications();
  
  const filteredApplications = applications.filter((application) => {
    const directorSchoolFilter = currentUser?.schoolId 
      ? application.schoolId === currentUser.schoolId 
      : true;
    const matchesSearch = `${application.firstName} ${application.lastName} ${application.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || application.status === statusFilter;
    return directorSchoolFilter && matchesSearch && matchesStatus;
  });

  // Statistiques
  const stats = {
    toValidate: filteredApplications.filter(a => a.status === 'to_validate').length,
    validated: filteredApplications.filter(a => a.status === 'validated').length,
    rejected: filteredApplications.filter(a => a.status === 'rejected').length,
    total: filteredApplications.length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'to_validate':
        return <Badge className="bg-bourbon">À valider</Badge>;
      case 'validated':
        return <Badge className="bg-ochre">Validé</Badge>;
      case 'rejected':
        return <Badge className="bg-walnut">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewApplication = (appId: string) => {
    console.log('Viewing application:', appId);
    navigate(`/director/application/${appId}`);
  };

  const handleQuickValidate = (appId: string) => {
    navigate(`/director/application/${appId}?action=validate`);
  };

  const handleQuickReject = (appId: string) => {
    navigate(`/director/application/${appId}?action=reject`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord directeur</h1>
        <p className="text-gray-600">
          Gérez les candidatures pour {currentUser?.schoolId ? getSchoolById(currentUser.schoolId)?.name : 'votre école'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À valider</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bourbon">{stats.toValidate}</div>
            <p className="text-xs text-muted-foreground">
              En attente de votre décision
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ochre">{stats.validated}</div>
            <p className="text-xs text-muted-foreground">
              Candidatures acceptées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-walnut">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              Candidatures refusées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Toutes les candidatures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => navigate('/director/to-validate')}
          className="bg-bourbon hover:bg-metallic-bronze"
        >
          <Users className="mr-2 h-4 w-4" />
          Voir les candidatures à valider ({stats.toValidate})
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/director/validated')}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Candidatures validées ({stats.validated})
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/director/rejected')}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Candidatures rejetées ({stats.rejected})
        </Button>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Candidatures récentes</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Rechercher un candidat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="to_validate">À valider</SelectItem>
                  <SelectItem value="validated">Validées</SelectItem>
                  <SelectItem value="rejected">Rejetées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.slice(0, 10).map((application) => {
              console.log('Dashboard - Application:', application.id, 'Status:', application.status, 'School:', application.schoolId, 'Director School:', currentUser?.schoolId);
              return (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">
                        {application.firstName} {application.lastName}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {application.email} • {getSchoolById(application.schoolId)?.name} • {getClassById(application.classId)?.name || application.classId}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Soumis le {new Date(application.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplication(application.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    {application.status !== 'validated' && application.status !== 'rejected' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleQuickValidate(application.id)}
                          className="bg-ochre hover:bg-rope"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReject(application.id)}
                          className="border-walnut text-walnut hover:bg-walnut hover:text-white"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredApplications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune candidature trouvée
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
