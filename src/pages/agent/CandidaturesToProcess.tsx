import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, X, Eye } from "lucide-react";
import { authService } from "@/data/mockAuth";
import { getSchoolById, getClassById } from "@/data/mockData";
import type { Application } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getStoredApplications,
  getApplicationDocumentIssues,
  markApplicationToValidate,
  markApplicationIncomplete,
} from "@/data/applicationsRepository";
import { useToast } from "@/hooks/use-toast";

const CandidaturesToProcess = () => {
  const currentUser = authService.getCurrentUser();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [showIncompleteDialog, setShowIncompleteDialog] = useState(false);
  const [missingDocumentInput, setMissingDocumentInput] = useState("");

  useEffect(() => {
    setApplications(getStoredApplications());
  }, []);

  const displayApplications = applications
    .filter((a) => a.status === 'pending')
    .map((app) => {
      const school = getSchoolById(app.schoolId);
      const classItem = getClassById(app.classId);
      const issues = getApplicationDocumentIssues(app);
      return {
        app,
        student: `${app.firstName} ${app.lastName}`,
        email: app.email,
        school: school?.name ?? app.schoolId,
        className: classItem?.name ?? app.classId,
        date: typeof app.createdAt === 'string' ? app.createdAt : app.createdAt.toISOString().split('T')[0],
        priority: issues.missing.length > 0 || issues.nonConforming.length > 0 ? 'high' : 'normal',
        issues,
      };
    });

  const filteredApplications = displayApplications.filter((item) =>
    item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.app.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedApp = selectedAppId
    ? applications.find((a) => a.id === selectedAppId) ?? null
    : null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleMarkToValidate = () => {
    if (!selectedApp) return;

    const result = markApplicationToValidate(selectedApp.id, currentUser?.id);
    if (!result.ok) {
      toast({
        title: "Dossier incomplet ou non conforme",
        description: "Impossible de transmettre au directeur tant que tous les documents ne sont pas conformes.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Dossier transmis",
      description: `La candidature ${selectedApp.matricule} est maintenant "À valider" et a été transmise au directeur.`,
    });

    setApplications(getStoredApplications());
    setSelectedAppId(null);
  };

  const handleMarkIncomplete = () => {
    if (!selectedApp) return;

    const result = markApplicationIncomplete(selectedApp.id, missingDocumentInput, currentUser?.id);
    if (!result.ok) {
      toast({
        title: "Document manquant requis",
        description: "Veuillez indiquer le document manquant.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Dossier marqué incomplet",
      description: `Le candidat a été notifié pour fournir : ${missingDocumentInput.trim()}`,
    });

    setApplications(getStoredApplications());
    setShowIncompleteDialog(false);
    setMissingDocumentInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures à traiter</h1>
        <p className="text-gray-600">Examinez et validez les candidatures reçues</p>
      </div>

      {/* Search */}
      <div className="relative">
        <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Rechercher par nom, email ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 border-amber-200 focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <Card className="border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
              <CardTitle className="flex items-center justify-between">
                <span>Candidatures ({filteredApplications.length})</span>
                <Clock className="h-5 w-5 text-amber-600" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {filteredApplications.length > 0 ? (
                filteredApplications.map(({ app, student, email, school, className, date, priority, issues }) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      selectedApp?.id === app.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 bg-gray-50 hover:border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{student}</p>
                        <p className="text-xs text-gray-500 mt-1">{app.matricule}</p>
                      </div>
                      <Badge className={getPriorityColor(priority)}>
                        {priority === "high"
                          ? "Urgent"
                          : priority === "normal"
                          ? "Normal"
                          : "Faible"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📍 {school}</span>
                      <span>📅 {date}</span>
                      <span>📄 {app.documents.length} documents</span>
                    </div>
                    {(issues.missing.length > 0 || issues.nonConforming.length > 0) && (
                      <div className="mt-2 text-xs text-red-700">
                        {issues.missing.length > 0 && (
                          <span>{issues.missing.length} document(s) manquant(s)</span>
                        )}
                        {issues.missing.length > 0 && issues.nonConforming.length > 0 && <span> • </span>}
                        {issues.nonConforming.length > 0 && (
                          <span>{issues.nonConforming.length} non conforme(s)</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune candidature trouvée</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        {selectedApp ? (
          <div className="space-y-4">
            <Card className="border-amber-200 sticky top-6">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                <CardTitle className="text-lg">{selectedApp.firstName} {selectedApp.lastName}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Candidature Info */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">ID Candidature</p>
                  <p className="font-semibold text-gray-900">{selectedApp.matricule}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="font-semibold text-gray-900 break-all">{selectedApp.email}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">École demandée</p>
                  <p className="font-semibold text-gray-900">{getSchoolById(selectedApp.schoolId)?.name}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Classe demandée</p>
                  <p className="font-semibold text-gray-900">{getClassById(selectedApp.classId)?.name}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date de soumission</p>
                  <p className="font-semibold text-gray-900">
                    {typeof selectedApp.createdAt === 'string'
                      ? selectedApp.createdAt
                      : selectedApp.createdAt.toISOString().split('T')[0]}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Documents ({selectedApp.documents.length})</p>
                  <div className="space-y-2">
                    {selectedApp.documents.length > 0 ? (
                      selectedApp.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {doc.name}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <X className="h-4 w-4 text-red-600" />
                        Aucun document fourni
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Vérification</p>
                  {(() => {
                    const issues = getApplicationDocumentIssues(selectedApp);
                    if (issues.missing.length === 0 && issues.nonConforming.length === 0) {
                      return (
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          Dossier complet et conforme
                        </div>
                      );
                    }
                    return (
                      <div className="text-sm text-red-700 space-y-1">
                        {issues.missing.length > 0 && (
                          <div>Manquants : {issues.missing.join(', ')}</div>
                        )}
                        {issues.nonConforming.length > 0 && (
                          <div>Non conformes : {issues.nonConforming.join(', ')}</div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleMarkToValidate}
                  >
                    ✓ Marquer "À valider"
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setMissingDocumentInput(selectedApp.agentMissingDocument ?? "");
                      setShowIncompleteDialog(true);
                    }}
                  >
                    ✗ Dossier incomplet
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-600 hover:bg-amber-50"
                    onClick={() => setShowDocumentsDialog(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-amber-200 bg-amber-50 flex items-center justify-center h-64 sticky top-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-amber-300 mx-auto mb-2" />
              <p className="text-gray-600">Sélectionnez une candidature pour voir les détails</p>
            </div>
          </Card>
        )}
      </div>

      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Documents du dossier</DialogTitle>
            <DialogDescription>
              {selectedApp ? `${selectedApp.matricule} — ${selectedApp.firstName} ${selectedApp.lastName}` : ''}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-3">
              {selectedApp.documents.length > 0 ? (
                selectedApp.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.type}</div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={doc.url} target="_blank" rel="noreferrer">
                        Télécharger
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">Aucun document n'a été fourni.</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showIncompleteDialog} onOpenChange={setShowIncompleteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Dossier incomplet</DialogTitle>
            <DialogDescription>
              {selectedApp ? `Indiquez le document manquant pour ${selectedApp.matricule}.` : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium">Document manquant</div>
              <Input
                value={missingDocumentInput}
                onChange={(e) => setMissingDocumentInput(e.target.value)}
                placeholder="Ex: Relevé de notes"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowIncompleteDialog(false);
                  setMissingDocumentInput("");
                }}
              >
                Annuler
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleMarkIncomplete}>
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidaturesToProcess;
