import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { getStoredApplications, type Application } from '@/data/applicationsRepository';
import { getSchoolById, getClassById } from '@/data/mockData';

export interface ExportData {
  'N°': number;
  'Matricule': string;
  'Nom': string;
  'Prénom': string;
  'Sexe': string;
  'Date de naissance': string;
  'Email': string;
  'Téléphone': string;
  'École': string;
  'Classe': string;
  'Statut': string;
  'Date de validation': string;
  'Validé par': string;
}

export const exportService = {
  // Générer Excel pour une classe spécifique
  generateExcelForClass: (classId: string): void => {
    const applications = getStoredApplications();
    const classItem = getClassById(classId);
    const school = classItem ? getSchoolById(classItem.schoolId) : null;
    
    // Filtrer les candidatures validées pour cette classe
    const validatedApplications = applications.filter(
      app => app.classId === classId && app.status === 'validated'
    );

    if (validatedApplications.length === 0) {
      console.warn(`Aucune candidature validée pour la classe ${classItem?.name}`);
      return;
    }

    const data: ExportData[] = validatedApplications.map((application, index) => ({
      'N°': index + 1,
      'Matricule': application.matricule || `ADM-${format(new Date(), 'yyyy')}-${String(index + 1).padStart(4, '0')}`,
      'Nom': application.lastName,
      'Prénom': application.firstName,
      'Sexe': application.gender === 'male' ? 'M' : 'F',
      'Date de naissance': format(application.dateOfBirth, 'dd/MM/yyyy'),
      'Email': application.email,
      'Téléphone': application.phone,
      'École': school?.name || '',
      'Classe': classItem?.name || '',
      'Statut': 'Validé',
      'Date de validation': application.validatedAt ? format(application.validatedAt, 'dd/MM/yyyy HH:mm') : '',
      'Validé par': application.validatedBy ? `Directeur (${application.validatedBy})` : ''
    }));

    // Créer le fichier Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, classItem?.name || 'Liste');

    // Définir la largeur des colonnes
    const colWidths = [
      { wch: 5 },  // N°
      { wch: 15 }, // Matricule
      { wch: 20 }, // Nom
      { wch: 20 }, // Prénom
      { wch: 8 },  // Sexe
      { wch: 15 }, // Date de naissance
      { wch: 30 }, // Email
      { wch: 15 }, // Téléphone
      { wch: 20 }, // École
      { wch: 20 }, // Classe
      { wch: 10 }, // Statut
      { wch: 20 }, // Date de validation
      { wch: 15 }  // Validé par
    ];
    ws['!cols'] = colWidths;

    // Générer le nom du fichier
    const filename = `${school?.code || 'ECOLE'}_${classItem?.code || 'CLASSE'}_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;
    
    // Télécharger le fichier
    XLSX.writeFile(wb, filename);
    
    console.log(`✅ Fichier Excel généré: ${filename} (${validatedApplications.length} étudiants)`);
  },

  // Générer Excel pour une école (toutes les classes)
  generateExcelForSchool: (schoolId: string): void => {
    const applications = getStoredApplications();
    const school = getSchoolById(schoolId);
    
    if (!school) {
      console.error(`École non trouvée: ${schoolId}`);
      return;
    }

    // Filtrer les candidatures validées pour cette école
    const validatedApplications = applications.filter(
      app => app.schoolId === schoolId && app.status === 'validated'
    );

    if (validatedApplications.length === 0) {
      console.warn(`Aucune candidature validée pour l'école ${school.name}`);
      return;
    }

    // Grouper par classe
    const classesMap = new Map<string, Application[]>();
    validatedApplications.forEach(app => {
      if (!classesMap.has(app.classId)) {
        classesMap.set(app.classId, []);
      }
      classesMap.get(app.classId)!.push(app);
    });

    const wb = XLSX.utils.book_new();
    let totalStudents = 0;

    // Créer une feuille par classe
    classesMap.forEach((classApplications, classId) => {
      const classItem = getClassById(classId);
      const data: ExportData[] = classApplications.map((application, index) => ({
        'N°': index + 1,
        'Matricule': application.matricule || `ADM-${format(new Date(), 'yyyy')}-${String(index + 1).padStart(4, '0')}`,
        'Nom': application.lastName,
        'Prénom': application.firstName,
        'Sexe': application.gender === 'male' ? 'M' : 'F',
        'Date de naissance': format(application.dateOfBirth, 'dd/MM/yyyy'),
        'Email': application.email,
        'Téléphone': application.phone,
        'École': school.name,
        'Classe': classItem?.name || '',
        'Statut': 'Validé',
        'Date de validation': application.validatedAt ? format(application.validatedAt, 'dd/MM/yyyy HH:mm') : '',
        'Validé par': application.validatedBy ? `Directeur (${application.validatedBy})` : ''
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      
      // Définir la largeur des colonnes
      const colWidths = [
        { wch: 5 },  // N°
        { wch: 15 }, // Matricule
        { wch: 20 }, // Nom
        { wch: 20 }, // Prénom
        { wch: 8 },  // Sexe
        { wch: 15 }, // Date de naissance
        { wch: 30 }, // Email
        { wch: 15 }, // Téléphone
        { wch: 20 }, // École
        { wch: 20 }, // Classe
        { wch: 10 }, // Statut
        { wch: 20 }, // Date de validation
        { wch: 15 }  // Validé par
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, classItem?.name || `Classe_${classId}`);
      totalStudents += classApplications.length;
    });

    // Générer le nom du fichier
    const filename = `${school.code}_TOUS_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;
    
    // Télécharger le fichier
    XLSX.writeFile(wb, filename);
    
    console.log(`✅ Fichier Excel généré: ${filename} (${totalStudents} étudiants, ${classesMap.size} classes)`);
  },

  // Générer Excel pour toutes les écoles
  generateExcelForAllSchools: (): void => {
    const applications = getStoredApplications();
    const validatedApplications = applications.filter(app => app.status === 'validated');

    if (validatedApplications.length === 0) {
      console.warn('Aucune candidature validée trouvée');
      return;
    }

    // Grouper par école puis par classe
    const schoolsMap = new Map<string, Map<string, Application[]>>();
    
    validatedApplications.forEach(app => {
      if (!schoolsMap.has(app.schoolId)) {
        schoolsMap.set(app.schoolId, new Map());
      }
      const schoolClasses = schoolsMap.get(app.schoolId)!;
      if (!schoolClasses.has(app.classId)) {
        schoolClasses.set(app.classId, []);
      }
      schoolClasses.get(app.classId)!.push(app);
    });

    const wb = XLSX.utils.book_new();
    let totalStudents = 0;

    schoolsMap.forEach((classesMap, schoolId) => {
      const school = getSchoolById(schoolId);
      if (!school) return;

      classesMap.forEach((classApplications, classId) => {
        const classItem = getClassById(classId);
        const data: ExportData[] = classApplications.map((application, index) => ({
          'N°': index + 1,
          'Matricule': application.matricule || `ADM-${format(new Date(), 'yyyy')}-${String(index + 1).padStart(4, '0')}`,
          'Nom': application.lastName,
          'Prénom': application.firstName,
          'Sexe': application.gender === 'male' ? 'M' : 'F',
          'Date de naissance': format(application.dateOfBirth, 'dd/MM/yyyy'),
          'Email': application.email,
          'Téléphone': application.phone,
          'École': school.name,
          'Classe': classItem?.name || '',
          'Statut': 'Validé',
          'Date de validation': application.validatedAt ? format(application.validatedAt, 'dd/MM/yyyy HH:mm') : '',
          'Validé par': application.validatedBy ? `Directeur (${application.validatedBy})` : ''
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        
        // Définir la largeur des colonnes
        const colWidths = [
          { wch: 5 },  // N°
          { wch: 15 }, // Matricule
          { wch: 20 }, // Nom
          { wch: 20 }, // Prénom
          { wch: 8 },  // Sexe
          { wch: 15 }, // Date de naissance
          { wch: 30 }, // Email
          { wch: 15 }, // Téléphone
          { wch: 20 }, // École
          { wch: 20 }, // Classe
          { wch: 10 }, // Statut
          { wch: 20 }, // Date de validation
          { wch: 15 }  // Validé par
        ];
        ws['!cols'] = colWidths;

        // Nom de la feuille: "NomEcole_NomClasse"
        const sheetName = `${school.code}_${classItem?.code || 'CLASSE'}`;
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        totalStudents += classApplications.length;
      });
    });

    // Générer le nom du fichier
    const filename = `TOUTES_ECOLES_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`;
    
    // Télécharger le fichier
    XLSX.writeFile(wb, filename);
    
    console.log(`✅ Fichier Excel généré: ${filename} (${totalStudents} étudiants, ${schoolsMap.size} écoles)`);
  }
};
