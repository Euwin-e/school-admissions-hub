import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  XCircle,
  Search,
  AlertTriangle,
} from "lucide-react";
import { authService } from "@/data/mockAuth";
import { getStoredApplications, type Application } from "@/data/applicationsRepository";
import { getSchoolById, getClassById } from "@/data/mockData";

export default function RejectedList() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setApplications(getStoredApplications());
  }, []);

  // Filtrer les applications rejetées pour le directeur de l'école
  const filteredApplications = applications.filter(app => {
    const matchesSearch = `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const isRejected = app.status === 'rejected';
    const directorSchoolFilter = currentUser?.role === 'director' && currentUser.schoolId
      ? app.schoolId === currentUser.schoolId
      : true;
    return matchesSearch && isRejected && directorSchoolFilter;
  });

  const handleViewApplication = (appId: string) => {
    navigate(`/director/application/${appId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Candidatures rejetées</h1>
        <p className="text-gray-600">
          {filteredApplications.length} candidature{filteredApplications.length > 1 ? 's' : ''} rejetée{filteredApplications.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Liste des candidatures rejetées
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
          </div>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune candidature rejetée
              </h3>
              <p className="text-gray-500">
                Les candidatures que vous rejeterez apparaîtront ici.
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
                        <h3 className="text-lg font-semibold">
                          {application.firstName} {application.lastName}
                        </h3>
                        <Badge className="bg-walnut">Rejetée</Badge>
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
                            <span className="font-medium">Rejeté le:</span>{' '}
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
                            <span className="font-medium">Rejeté par:</span> Directeur (ID: {application.validatedBy})
                          </div>
                        )}
                      </div>

                      {application.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">Motif du rejet:</span>
                          </div>
                          <p className="text-sm text-red-700">{application.rejectionReason}</p>
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
