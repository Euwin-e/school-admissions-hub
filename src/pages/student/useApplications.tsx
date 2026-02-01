import { useState } from 'react';

interface Document {
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  fileName: string | null;
  uploadedAt: string | null;
}

interface Student {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface TimelineStep {
  step: string;
  completed: boolean;
  date: string | null;
  description: string;
}

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

interface Application {
  id: string;
  ticketNumber: string;
  status: 'pending' | 'reviewing' | 'validated' | 'rejected';
  school: string;
  class: string;
  createdAt: string;
  student: Student;
  documents: Record<string, Document>;
  timeline: TimelineStep[];
  notifications: Notification[];
}

export const useApplications = () => {
  // On récupère les candidatures existantes ou on initialise avec un exemple complet
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('student_apps');
    return saved ? JSON.parse(saved) : [{
      id: "CAND-2025-001",
      ticketNumber: "TKT-2025-0847",
      status: "pending",
      school: "Institut Supérieur de Management",
      class: "Master 1 Marketing",
      createdAt: "2025-01-15",
      student: {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@email.com",
        phone: "+221 77 123 45 67"
      },
      documents: {
        diploma: { status: 'uploaded', fileName: 'bac_scientifique.pdf', uploadedAt: '2025-01-15' },
        transcript: { status: 'uploaded', fileName: 'bulletin_final.pdf', uploadedAt: '2025-01-15' },
        motivation: { status: 'pending', fileName: null, uploadedAt: null },
        birthCertificate: { status: 'pending', fileName: null, uploadedAt: null },
        idCard: { status: 'pending', fileName: null, uploadedAt: null }
      },
      timeline: [
        { step: "Candidature soumise", completed: true, date: "2025-01-15", description: "Candidature reçue et enregistrée" },
        { step: "Documents en vérification", completed: true, date: "2025-01-16", description: "Vérification des documents fournis" },
        { step: "En cours d'examen", completed: false, date: null, description: "Examen du dossier par le comité" },
        { step: "Décision finale", completed: false, date: null, description: "Décision finale en attente" }
      ],
      notifications: [
        { id: 1, message: "Votre dossier est en cours d'examen", date: "2025-01-16", read: false },
        { id: 2, message: "Documents validés par l'administration", date: "2025-01-15", read: true }
      ]
    }];
  });

  const addApplication = (newApp: Application) => {
    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    localStorage.setItem('student_apps', JSON.stringify(updatedApps));
    
    // Simulation de l'envoi d'email
    console.log(`Email envoyé à l'étudiant avec le ticket : ${newApp.ticketNumber}`);
    
    // Notification système
    console.log(`Nouvelle candidature créée: ${newApp.id} - ${newApp.school}`);
  };

  const updateDocument = (applicationId: string, docId: string, documentData: Document) => {
    const updatedApps = applications.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          documents: {
            ...app.documents,
            [docId]: documentData
          }
        };
      }
      return app;
    });
    
    setApplications(updatedApps);
    localStorage.setItem('student_apps', JSON.stringify(updatedApps));
    console.log(`Document ${docId} mis à jour pour la candidature ${applicationId}`);
  };

  const deleteDocument = (applicationId: string, docId: string) => {
    const updatedApps = applications.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          documents: {
            ...app.documents,
            [docId]: { status: 'pending' as const, fileName: null, uploadedAt: null }
          }
        };
      }
      return app;
    });
    
    setApplications(updatedApps);
    localStorage.setItem('student_apps', JSON.stringify(updatedApps));
    console.log(`Document ${docId} supprimé pour la candidature ${applicationId}`);
  };

  const updateApplicationStatus = (applicationId: string, newStatus: Application['status']) => {
    const updatedApps = applications.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus,
          timeline: [
            ...app.timeline,
            {
              step: `Statut mis à jour: ${newStatus}`,
              completed: true,
              date: new Date().toISOString().split('T')[0],
              description: `Votre candidature est maintenant ${newStatus}`
            }
          ]
        };
      }
      return app;
    });
    
    setApplications(updatedApps);
    localStorage.setItem('student_apps', JSON.stringify(updatedApps));
    console.log(`Statut de la candidature ${applicationId} mis à jour: ${newStatus}`);
  };

  const getApplicationById = (applicationId: string): Application | undefined => {
    return applications.find(app => app.id === applicationId);
  };

  const getMissingDocuments = (applicationId: string): string[] => {
    const app = getApplicationById(applicationId);
    if (!app) return [];
    
    return Object.entries(app.documents)
      .filter(([_, doc]) => doc.status === 'pending')
      .map(([docId, _]) => docId);
  };

  const getCompletedDocuments = (applicationId: string): string[] => {
    const app = getApplicationById(applicationId);
    if (!app) return [];
    
    return Object.entries(app.documents)
      .filter(([_, doc]) => doc.status === 'uploaded')
      .map(([docId, _]) => docId);
  };

  return { 
    applications, 
    addApplication, 
    updateDocument, 
    deleteDocument, 
    updateApplicationStatus,
    getApplicationById,
    getMissingDocuments,
    getCompletedDocuments
  };
};