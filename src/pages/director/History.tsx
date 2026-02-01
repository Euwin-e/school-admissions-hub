import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Eye,
  FileText,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { authService } from "@/data/mockAuth";
import { getStoredApplications, type Application } from "@/data/applicationsRepository";
import { getSchoolById, getClassById } from "@/data/mockData";

export default function History() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setApplications(getStoredApplications());
  }, []);

  // Filtrer les applications pour le directeur de l'école
  const filteredApplications = applications.filter(app => {
    const matchesSearch = `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const directorSchoolFilter = currentUser?.role === 'director' && currentUser.schoolId
      ? app.schoolId === currentUser.schoolId
      : true;
    return matchesSearch && matchesStatus && directorSchoolFilter;
  });

  const handleViewApplication = (appId: string) => {
    navigate(`/director/application/${appId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'to_validate':
        return <Badge className="bg-bourbon">À valider</Badge>;
      case 'validated':
        return <Badge className="bg-ochre">Validée</Badge>;
      case 'rejected':
        return <Badge className="bg-walnut">Rejetée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'to_validate':
        return <Clock className="h-4 w-4" />;
      case 'validated':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Statistiques
  const stats = {
    total: filteredApplications.length,
    toValidate: filteredApplications.filter(a => a.status === 'to_validate').length,
    validated: filteredApplications.filter(a => a.status === 'validated').length,
    rejected: filteredApplications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Historique des décisions</h1>
        <p className="text-gray-600">
          Historique complet de toutes les candidatures traitées
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-bourbon" />
              <div>
                <p className="text-sm text-gray-500">À valider</p>
                <p className="text-xl font-bold text-bourbon">{stats.toValidate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-ochre" />
              <div>
                <p className="text-sm text-gray-500">Validées</p>
                <p className="text-xl font-bold text-ochre">{stats.validated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-walnut" />
              <div>
                <p className="text-sm text-gray-500">Rejetées</p>
                <p className="text-xl font-bold text-walnut">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des candidatures
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un candidat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune candidature trouvée
              </h3>
              <p className="text-gray-500">
                Aucune candidature ne correspond à vos critères de recherche.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(application.status)}
                        <h3 className="text-lg font-semibold">
                          {application.firstName} {application.lastName}
                        </h3>
                        {getStatusBadge(application.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {application.email}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Téléphone:</span> {application.phone}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">École:</span> {getSchoolById(application.schoolId)?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Classe:</span> {getClassById(application.classId)?.name || application.classId}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 space-y-1">
                        <div>
                          <span className="font-medium">Soumis le:</span>{' '}
                          {new Date(application.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        {application.validatedAt && (
                          <div>
                            <span className="font-medium">
                              {application.status === 'validated' ? 'Validé le:' : 'Rejeté le:'}
                            </span>{' '}
                            {new Date(application.validatedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        )}
                        {application.validatedBy && (
                          <div>
                            <span className="font-medium">
                              {application.status === 'validated' ? 'Validé par:' : 'Rejeté par:'}
                            </span> Directeur (ID: {application.validatedBy})
                          </div>
                        )}
                      </div>

                      {application.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Motif:</span> {application.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(application.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir le dossier
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
