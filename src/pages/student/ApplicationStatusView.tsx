import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ChevronRight, 
  Plus, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar,
  Eye,
  X,
  FileDown,
  Printer
} from "lucide-react";
import { useState } from "react";
import { useApplications } from "./useApplications";

interface ApplicationStatusViewProps {
  applications: any[];
}

export function ApplicationStatusView({ applications }: ApplicationStatusViewProps) {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  
  const { updateDocument, deleteDocument, getApplicationById } = useApplications();

  // Documents requis pour chaque candidature
  const getRequiredDocuments = (application: any) => [
    { 
      id: 'diploma', 
      name: 'Diplôme Baccalauréat', 
      status: application.documents?.diploma?.status || 'pending',
      fileName: application.documents?.diploma?.fileName || null,
      uploadedAt: application.documents?.diploma?.uploadedAt || null,
      description: 'Obligatoire pour toute candidature'
    },
    { 
      id: 'transcript', 
      name: 'Bulletin de notes', 
      status: application.documents?.transcript?.status || 'pending',
      fileName: application.documents?.transcript?.fileName || null,
      uploadedAt: application.documents?.transcript?.uploadedAt || null,
      description: 'Relevé des 3 dernières années'
    },
    { 
      id: 'motivation', 
      name: 'Lettre de motivation', 
      status: application.documents?.motivation?.status || 'pending',
      fileName: application.documents?.motivation?.fileName || null,
      uploadedAt: application.documents?.motivation?.uploadedAt || null,
      description: 'Explique votre projet professionnel'
    },
    { 
      id: 'birthCertificate', 
      name: 'Acte de naissance', 
      status: application.documents?.birthCertificate?.status || 'pending',
      fileName: application.documents?.birthCertificate?.fileName || null,
      uploadedAt: application.documents?.birthCertificate?.uploadedAt || null,
      description: 'Copie certifiée conforme'
    },
    { 
      id: 'idCard', 
      name: 'Carte d\'identité nationale', 
      status: application.documents?.idCard?.status || 'pending',
      fileName: application.documents?.idCard?.fileName || null,
      uploadedAt: application.documents?.idCard?.uploadedAt || null,
      description: 'En cours de validité'
    }
  ];

  const getStatusColors = (status: string) => {
    switch(status) {
      case 'uploaded':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', label: 'Téléversé' };
      case 'verified':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', label: 'Vérifié' };
      case 'rejected':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', label: 'Rejeté' };
      default:
        return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', label: 'En attente' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'uploaded': return CheckCircle;
      case 'verified': return CheckCircle;
      case 'rejected': return AlertCircle;
      default: return Clock;
    }
  };

  // Logique de téléversement de fichier
  const handleFileUpload = (applicationId: string, docId: string, file: File) => {
    setUploadingFile(file);
    setUploadProgress(0);

    // Simuler le téléversement
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 200);

    setTimeout(() => {
      // Mettre à jour le document via le hook
      const updatedDoc = {
        status: 'uploaded',
        fileName: file.name,
        uploadedAt: new Date().toISOString()
      };
      
      updateDocument(applicationId, docId, updatedDoc);
      
      setUploadingFile(null);
      setUploadProgress(0);
      setShowUploadModal(false);
      
      // Notification de succès
      alert(`Document "${file.name}" téléversé avec succès !`);
    }, 1200);
  };

  // Logique de suppression de document
  const handleDeleteDocument = (applicationId: string, docId: string, docName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${docName}" ?`)) {
      deleteDocument(applicationId, docId);
      alert(`Document "${docName}" supprimé avec succès !`);
    }
  };

  // Logique de visualisation de document
  const handleViewDocument = (document: any) => {
    setViewingDocument(document);
    setShowDocumentModal(true);
  };

  // Logique de modification de document
  const handleEditDocument = (applicationId: string, docId: string) => {
    // Simuler l'ouverture d'un sélecteur de fichier
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (window.confirm(`Voulez-vous remplacer le document par "${file.name}" ?`)) {
          handleFileUpload(applicationId, docId, file);
        }
      }
    };
    input.click();
  };

  // Logique de téléchargement de décision
  const handleDownloadDecision = (application: any) => {
    if (application.status === 'validated') {
      // Simuler le téléchargement
      const decisionContent = `
DÉCISION D'ADMISSION
===================

Candidature: ${application.id}
Ticket: ${application.ticketNumber}
École: ${application.school}
Classe: ${application.class}

STATUT: ADMIS ✅

Date de décision: ${new Date().toLocaleDateString()}
Signature numérique: SIG-${Math.random().toString(36).substr(2, 9).toUpperCase()}
      `;
      
      const blob = new Blob([decisionContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decision_${application.ticketNumber}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      alert('Décision d\'admission téléchargée avec succès !');
    } else if (application.status === 'rejected') {
      alert('Votre candidature n\'a pas été retenue. La décision sera envoyée par email.');
    } else {
      alert('La décision n\'est pas encore disponible. Veuillez patienter.');
    }
  };

  // Logique d'impression du dossier
  const handlePrintApplication = (application: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Dossier de Candidature - ${application.ticketNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>DOSSIER DE CANDIDATURE</h1>
            <h2>${application.school} - ${application.class}</h2>
            <p><strong>Ticket:</strong> ${application.ticketNumber}</p>
            <p><strong>Statut:</strong> ${application.status}</p>
            <hr>
            <h3>Étudiant:</h3>
            <p>${application.student?.firstName || 'N/A'} ${application.student?.lastName || 'N/A'}</p>
            <p>${application.student?.email || 'N/A'}</p>
            <p>${application.student?.phone || 'N/A'}</p>
            <hr>
            <h3>Documents:</h3>
            ${getRequiredDocuments(application).map(doc => 
              `<p>${doc.name}: ${doc.status === 'uploaded' ? '✅ ' + (doc.fileName || 'Téléversé') : '❌ Non fourni'}</p>`
            ).join('')}
            <hr>
            <p><small>Généré le: ${new Date().toLocaleDateString()}</small></p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Logique de voir les détails
  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <FileText className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune candidature</h3>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas encore soumis de candidature. Commencez dès maintenant !
        </p>
        <div className="inline-flex items-center gap-2 text-orange-600 font-medium">
          <Plus className="h-4 w-4" />
          Cliquez sur "Nouvelle Candidature" pour commencer
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec compteur */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mes Dossiers</h2>
        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
          {applications.length} {applications.length === 1 ? 'candidature' : 'candidatures'}
        </Badge>
      </div>
      
      {/* Liste des candidatures */}
      {applications.map((app) => (
        <Card key={app.id} className="hover:border-orange-400 transition-all cursor-pointer group hover:shadow-lg mb-6">
          <CardContent className="p-6">
            {/* Header de la candidature */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full text-orange-600 group-hover:bg-orange-200 transition">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900">{app.class}</p>
                  <p className="text-sm text-gray-500">{app.school}</p>
                  <p className="text-xs text-gray-400">Ticket: {app.ticketNumber}</p>
                  <p className="text-xs text-gray-400">Soumise le {app.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={`
                  ${app.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                    app.status === 'validated' ? 'bg-green-100 text-green-700 border-green-200' : 
                    app.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                    'bg-gray-100 text-gray-700 border-gray-200'} 
                  uppercase text-[10px] font-semibold
                `}>
                  {app.status === 'pending' ? 'En attente' : 
                   app.status === 'validated' ? 'Validée' : 
                   app.status === 'rejected' ? 'Rejetée' : 
                   app.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  onClick={() => handleViewDetails(app)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir détails
                </Button>
              </div>
            </div>

            {/* Timeline de progression simplifiée */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                Progression
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Candidature soumise</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">En examen</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-400">Décision</span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  Documents requis
                </h4>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => {
                    setSelectedApplication(app);
                    setShowUploadModal(true);
                  }}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Ajouter un document
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getRequiredDocuments(app).map((doc) => {
                  const colors = getStatusColors(doc.status);
                  const Icon = getStatusIcon(doc.status);
                  
                  return (
                    <div key={doc.id} className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${colors.text}`} />
                          <span className="font-medium text-sm text-gray-900">{doc.name}</span>
                        </div>
                        <Badge className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}>
                          {colors.label}
                        </Badge>
                      </div>
                      
                      {doc.fileName ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 truncate">{doc.fileName}</span>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-gray-300 text-gray-600 hover:bg-gray-50"
                              onClick={() => handleViewDocument(doc)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-gray-300 text-gray-600 hover:bg-gray-50"
                              onClick={() => handleEditDocument(app.id, doc.id)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteDocument(app.id, doc.id, doc.name)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-orange-600">Non téléversé</span>
                          <Button 
                            size="sm" 
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => {
                              setSelectedApplication(app);
                              setSelectedDocument(doc);
                              setShowUploadModal(true);
                            }}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Téléverser
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                onClick={() => handleDownloadDecision(app)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger la décision
              </Button>
              <Button 
                variant="outline" 
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                onClick={() => handlePrintApplication(app)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimer le dossier
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Modal de téléversement */}
      {showUploadModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Téléverser un document</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedDocument(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {(selectedDocument ? [selectedDocument] : getRequiredDocuments(selectedApplication)).map((doc) => (
                  <div key={doc.id} className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.description}</p>
                        <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
                      </div>
                      <label className="cursor-pointer">
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          <Upload className="h-4 w-4 mr-2" />
                          Choisir un fichier
                        </Button>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                alert('Le fichier ne doit pas dépasser 5MB');
                                return;
                              }
                              handleFileUpload(selectedApplication.id, doc.id, file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              {uploadingFile && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Téléversement de {uploadingFile.name}</span>
                    <span className="text-sm text-orange-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation de document */}
      {showDocumentModal && viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{viewingDocument.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDocumentModal(false);
                    setViewingDocument(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <FileDown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {viewingDocument.fileName ? `Fichier: ${viewingDocument.fileName}` : 'Aucun fichier téléversé'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Téléversé le: {viewingDocument.uploadedAt ? new Date(viewingDocument.uploadedAt).toLocaleDateString() : 'N/A'}
                </p>
                <div className="flex justify-center gap-4">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                    <FileDown className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal des détails de candidature */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Détails de la Candidature</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedApplication(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informations générales */}
              <div className="bg-orange-50 rounded-lg p-6">
                <h4 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations Générales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ID Candidature</p>
                    <p className="font-medium text-gray-900">{selectedApplication.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ticket</p>
                    <p className="font-medium text-gray-900">{selectedApplication.ticketNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">École</p>
                    <p className="font-medium text-gray-900">{selectedApplication.school}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Classe</p>
                    <p className="font-medium text-gray-900">{selectedApplication.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <Badge className={`${
                      selectedApplication.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                      selectedApplication.status === 'validated' ? 'bg-green-100 text-green-700 border-green-200' : 
                      selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {selectedApplication.status === 'pending' ? 'En attente' : 
                       selectedApplication.status === 'validated' ? 'Validée' : 
                       selectedApplication.status === 'rejected' ? 'Rejetée' : 
                       selectedApplication.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de soumission</p>
                    <p className="font-medium text-gray-900">{selectedApplication.createdAt}</p>
                  </div>
                </div>
              </div>

              {/* Informations étudiant */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations Étudiant
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium text-gray-900">
                      {selectedApplication.student?.firstName || 'N/A'} {selectedApplication.student?.lastName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedApplication.student?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium text-gray-900">{selectedApplication.student?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents Fournis
                </h4>
                <div className="space-y-3">
                  {getRequiredDocuments(selectedApplication).map((doc: any) => {
                    const colors = getStatusColors(doc.status);
                    const Icon = getStatusIcon(doc.status);
                    
                    return (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${colors.text}`} />
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.fileName ? doc.fileName : 'Non téléversé'}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}>
                          {colors.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">
                      {getRequiredDocuments(selectedApplication).filter(doc => doc.status === 'uploaded').length}/
                      {getRequiredDocuments(selectedApplication).length}
                    </span> documents téléversés
                  </p>
                </div>
              </div>

              {/* Timeline */}
              {selectedApplication.timeline && (
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline de Progression
                  </h4>
                  <div className="space-y-3">
                    {selectedApplication.timeline.map((step: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-1 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{step.step}</p>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          <p className="text-xs text-gray-500">{step.date || 'En attente'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications */}
              {selectedApplication.notifications && selectedApplication.notifications.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    {selectedApplication.notifications.map((notif: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        notif.read ? 'bg-white border-gray-200' : 'bg-yellow-100 border-yellow-300'
                      }`}>
                        <p className="font-medium text-gray-900">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
                        {!notif.read && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs mt-2">
                            Non lue
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">
                        {selectedApplication.notifications.filter((n: any) => !n.read).length}
                      </span> notifications non lues
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationStatusView;
