import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Download, Search, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/data/mockAuth';
import { getStoredApplications, type Application } from '@/data/applicationsRepository';
import { getSchoolById, getClassById } from '@/data/mockData';
import { exportService } from '@/services/exportService';
import { useToast } from '@/hooks/use-toast';

export default function ValidatedList() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setApplications(getStoredApplications());
  }, []);

  // Filtrer les applications validées pour le directeur de l'école
  const filteredApplications = applications.filter(app => {
    const matchesSearch = `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const isValidated = app.status === 'validated';
    const directorSchoolFilter = currentUser?.role === 'director' && currentUser.schoolId
      ? app.schoolId === currentUser.schoolId
      : true;
    return matchesSearch && isValidated && directorSchoolFilter;
  });

  const handleViewApplication = (appId: string) => {
    navigate(`/director/application/${appId}`);
  };

  const handleExportClass = (classId: string) => {
    try {
      exportService.generateExcelForClass(classId);
      const classItem = getClassById(classId);
      toast({
        title: "Export réussi",
        description: `Fichier Excel généré pour la classe ${classItem?.name}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le fichier Excel",
        variant: "destructive",
      });
    }
  };

  const handleExportAll = () => {
    try {
      if (currentUser?.schoolId) {
        exportService.generateExcelForSchool(currentUser.schoolId);
        const school = getSchoolById(currentUser.schoolId);
        toast({
          title: "Export réussi",
          description: `Fichier Excel généré pour l'école ${school?.name}`,
        });
      } else {
        exportService.generateExcelForAllSchools();
        toast({
          title: "Export réussi",
          description: "Fichier Excel généré pour toutes les écoles",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le fichier Excel",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Candidatures validées</h1>
        <p className="text-gray-600">
          {filteredApplications.length} candidature{filteredApplications.length > 1 ? 's' : ''} acceptée{filteredApplications.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Liste des candidatures validées
          </CardTitle>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Rechercher une candidature..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button
              onClick={handleExportAll}
              className="bg-ochre hover:bg-rope"
              disabled={filteredApplications.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exporter tout ({filteredApplications.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune candidature validée
              </h3>
              <p className="text-gray-500">
                Les candidatures que vous validerez apparaîtront ici.
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
                        <Badge className="bg-ochre">Validée</Badge>
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
                            <span className="font-medium">Validé le:</span>{' '}
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
                            <span className="font-medium">Validé par:</span> Directeur (ID: {application.validatedBy})
                          </div>
                        )}
                      </div>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportClass(application.classId)}
                        className="border-bourbon text-bourbon hover:bg-bourbon hover:text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter classe
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
