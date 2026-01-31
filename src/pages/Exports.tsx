import { useState } from 'react';
import { FileSpreadsheet, Download, FolderOpen, FileDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  mockSchools, 
  mockClasses, 
  mockApplications,
  getClassesBySchool,
  getValidatedApplicationsByClass,
  getSchoolById
} from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export default function Exports() {
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const { toast } = useToast();

  const generateExcelForClass = (classId: string) => {
    const classItem = mockClasses.find(c => c.id === classId);
    const school = classItem ? getSchoolById(classItem.schoolId) : null;
    const students = getValidatedApplicationsByClass(classId);

    if (students.length === 0) {
      toast({
        title: "Aucun étudiant",
        description: "Aucun étudiant admis dans cette classe.",
        variant: "destructive",
      });
      return;
    }

    const data = students.map((student, index) => ({
      'N°': index + 1,
      'Matricule': student.matricule,
      'Nom': student.lastName,
      'Prénom': student.firstName,
      'Sexe': student.gender === 'male' ? 'M' : 'F',
      'Date de naissance': format(student.dateOfBirth, 'dd/MM/yyyy'),
      'Email': student.email,
      'Téléphone': student.phone,
      'École': school?.name || '',
      'Classe': classItem?.name || '',
      'Statut': 'Validé',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, classItem?.name || 'Liste');
    
    // Generate filename
    const filename = `${school?.code}_${classItem?.code}_${format(new Date(), 'yyyyMMdd')}.xlsx`;
    XLSX.writeFile(wb, filename);

    toast({
      title: "Export réussi",
      description: `Fichier ${filename} téléchargé avec succès.`,
    });
  };

  const generateExcelForSchool = (schoolId: string) => {
    const school = getSchoolById(schoolId);
    const classes = getClassesBySchool(schoolId);
    
    const wb = XLSX.utils.book_new();
    let hasData = false;

    classes.forEach(cls => {
      const students = getValidatedApplicationsByClass(cls.id);
      if (students.length > 0) {
        hasData = true;
        const data = students.map((student, index) => ({
          'N°': index + 1,
          'Matricule': student.matricule,
          'Nom': student.lastName,
          'Prénom': student.firstName,
          'Sexe': student.gender === 'male' ? 'M' : 'F',
          'Date de naissance': format(student.dateOfBirth, 'dd/MM/yyyy'),
          'Email': student.email,
          'Téléphone': student.phone,
          'Statut': 'Validé',
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, cls.code);
      }
    });

    if (!hasData) {
      toast({
        title: "Aucune donnée",
        description: "Aucun étudiant admis dans cette école.",
        variant: "destructive",
      });
      return;
    }

    const filename = `${school?.code}_${format(new Date(), 'yyyyMMdd')}.xlsx`;
    XLSX.writeFile(wb, filename);

    toast({
      title: "Export réussi",
      description: `Fichier ${filename} téléchargé avec ${classes.length} onglets.`,
    });
  };

  const generateAllExports = () => {
    mockSchools.forEach(school => {
      const classes = getClassesBySchool(school.id);
      const hasStudents = classes.some(cls => 
        getValidatedApplicationsByClass(cls.id).length > 0
      );
      if (hasStudents) {
        generateExcelForSchool(school.id);
      }
    });
  };

  const filteredSchools = selectedSchool === 'all' 
    ? mockSchools 
    : mockSchools.filter(s => s.id === selectedSchool);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Export Excel" 
        subtitle="Générez les fichiers Excel par école et par classe"
        actions={
          <Button onClick={generateAllExports} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter tout
          </Button>
        }
      />

      {/* Info Card */}
      <div className="card-elevated flex items-start gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Génération automatique des fichiers</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Les fichiers Excel sont générés automatiquement avec l'arborescence suivante:
          </p>
          <div className="mt-3 rounded-lg bg-muted/50 p-4 font-mono text-sm">
            <div className="flex items-center gap-2 text-primary">
              <FolderOpen className="h-4 w-4" />
              École_A/
            </div>
            <div className="ml-6 mt-1 flex items-center gap-2 text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              Classe_1.xlsx
            </div>
            <div className="ml-6 mt-1 flex items-center gap-2 text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              Classe_2.xlsx
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Filtrer par école:</span>
        <Select value={selectedSchool} onValueChange={setSelectedSchool}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Toutes les écoles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les écoles</SelectItem>
            {mockSchools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Schools and Classes */}
      <Accordion type="multiple" className="space-y-4">
        {filteredSchools.map((school) => {
          const classes = getClassesBySchool(school.id);
          const totalStudents = classes.reduce((acc, cls) => 
            acc + getValidatedApplicationsByClass(cls.id).length, 0
          );

          return (
            <AccordionItem 
              key={school.id} 
              value={school.id}
              className="card-elevated overflow-hidden border-none"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:bg-muted/30">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                      {school.code}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{school.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {classes.length} classes • {totalStudents} étudiants admis
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      generateExcelForSchool(school.id);
                    }}
                  >
                    <FileDown className="h-4 w-4" />
                    Exporter l'école
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="mt-2 space-y-3">
                  {classes.map((cls) => {
                    const students = getValidatedApplicationsByClass(cls.id);
                    return (
                      <div 
                        key={cls.id}
                        className="flex items-center justify-between rounded-lg bg-muted/30 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{cls.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {students.length} étudiant(s) admis
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {students.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-success">
                              <CheckCircle className="h-3 w-3" />
                              Prêt
                            </span>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={students.length === 0}
                            onClick={() => generateExcelForClass(cls.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
