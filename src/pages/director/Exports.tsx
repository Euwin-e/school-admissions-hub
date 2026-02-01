import { useState } from 'react';
import { FileSpreadsheet, Download, School, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authService } from '@/data/mockAuth';
import { exportService } from '@/services/exportService';
import { getStoredApplications } from '@/data/applicationsRepository';
import { getSchoolById, getClassById, getClassesBySchool } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function DirectorExports() {
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();

  const applications = getStoredApplications();
  const validatedApplications = applications.filter(app => app.status === 'validated');

  // Filtrer par école du directeur
  const directorApplications = currentUser?.schoolId 
    ? validatedApplications.filter(app => app.schoolId === currentUser.schoolId)
    : validatedApplications;

  // Obtenir les écoles disponibles
  const availableSchools = currentUser?.schoolId 
    ? [getSchoolById(currentUser.schoolId)].filter(Boolean)
    : Array.from(new Set(directorApplications.map(app => app.schoolId)))
        .map(schoolId => getSchoolById(schoolId))
        .filter(Boolean);

  // Obtenir les classes disponibles pour l'école sélectionnée
  const availableClasses = selectedSchool && selectedSchool !== 'all'
    ? getClassesBySchool(selectedSchool)
    : [];

  // Statistiques
  const stats = {
    totalValidated: directorApplications.length,
    bySchool: availableSchools.reduce((acc, school) => {
      const count = directorApplications.filter(app => app.schoolId === school.id).length;
      acc[school.id] = count;
      return acc;
    }, {} as Record<string, number>),
    byClass: availableClasses.reduce((acc, cls) => {
      const count = directorApplications.filter(app => app.classId === cls.id).length;
      acc[cls.id] = count;
      return acc;
    }, {} as Record<string, number>)
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

  const handleExportSchool = (schoolId: string) => {
    try {
      exportService.generateExcelForSchool(schoolId);
      const school = getSchoolById(schoolId);
      toast({
        title: "Export réussi",
        description: `Fichier Excel généré pour l'école ${school?.name}`,
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
      exportService.generateExcelForAllSchools();
      toast({
        title: "Export réussi",
        description: "Fichier Excel généré pour toutes les écoles",
      });
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
        <h1 className="text-3xl font-bold text-gray-900">Exports des Admissions</h1>
        <p className="text-gray-600">
          Générez des fichiers Excel pour les candidatures validées
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Validées</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ochre">{stats.totalValidated}</div>
            <p className="text-xs text-muted-foreground">
              Candidatures validées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Écoles</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bourbon">{availableSchools.length}</div>
            <p className="text-xs text-muted-foreground">
              Écoles avec des admis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-walnut">{availableClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Classes avec des admis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleExportAll}
              className="bg-ochre hover:bg-rope"
              disabled={stats.totalValidated === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exporter tout
            </Button>
            
            {availableSchools.map(school => (
              <Button
                key={school.id}
                variant="outline"
                onClick={() => handleExportSchool(school.id)}
                disabled={stats.bySchool[school.id] === 0}
                className="border-bourbon text-bourbon hover:bg-bourbon hover:text-white"
              >
                <School className="mr-2 h-4 w-4" />
                {school.name} ({stats.bySchool[school.id]})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export par classe */}
      <Card>
        <CardHeader>
          <CardTitle>Export par classe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtrer:</span>
            </div>
            
            {availableSchools.length > 1 && (
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="École" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les écoles</SelectItem>
                  {availableSchools.map(school => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name} ({stats.bySchool[school.id]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {availableClasses.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} ({stats.byClass[cls.id]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableClasses
              .filter(cls => selectedSchool === 'all' || cls.schoolId === selectedSchool)
              .filter(cls => selectedClass === 'all' || cls.id === selectedClass)
              .map(cls => {
                const studentCount = stats.byClass[cls.id];
                const school = getSchoolById(cls.schoolId);
                
                return (
                  <Card key={cls.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{cls.name}</h3>
                          <p className="text-sm text-gray-600">{school?.name}</p>
                        </div>
                        <Badge className={studentCount > 0 ? "bg-ochre" : "bg-gray-200"}>
                          {studentCount} étudiant{studentCount > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleExportClass(cls.id)}
                        disabled={studentCount === 0}
                        className="w-full"
                        variant={studentCount > 0 ? "default" : "outline"}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {studentCount > 0 ? 'Exporter' : 'Aucun admis'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Informations */}
      <Card>
        <CardHeader>
          <CardTitle>Informations sur les exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Les fichiers Excel sont générés avec toutes les informations des candidats validés</p>
            <p>• Format : N°, Matricule, Nom, Prénom, Sexe, Date de naissance, Email, Téléphone, École, Classe, Statut, Date de validation, Validé par</p>
            <p>• Les fichiers sont nommés automatiquement : CODE_ECOLE_CODE_CLASSE_DATE.xlsx</p>
            <p>• Les exports par école contiennent une feuille par classe</p>
            <p>• L'export complet contient toutes les écoles et classes dans un seul fichier</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
