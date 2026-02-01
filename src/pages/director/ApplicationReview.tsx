import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Download,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { authService } from "@/data/mockAuth";
import { emailService } from "@/services/emailService";
import { exportService } from "@/services/exportService";
import {
  getStoredApplications,
  directorValidateApplication,
  directorRejectApplication,
  clearDirectorInboxForApplication,
  addNotification,
  type Application,
} from "@/data/applicationsRepository";
import { getSchoolById, getClassById } from "@/data/mockData";

export default function ApplicationReview() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [application, setApplication] = useState<Application | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const action = searchParams.get('action'); // 'validate' ou 'reject'
  
  console.log('ApplicationReview - ID:', id, 'Action:', action, 'User:', currentUser?.role);

  useEffect(() => {
    const applications = getStoredApplications();
    console.log('Applications found:', applications.length, 'Looking for ID:', id);
    const found = applications.find((app) => app.id === id);
    console.log('Found application:', found);
    if (found) {
      setApplication(found);
      
      // Exécuter l'action rapide si présente dans l'URL
      if (action === 'validate' && found.status === 'to_validate') {
        setTimeout(() => {
          handleQuickValidate();
        }, 500);
      } else if (action === 'reject' && found.status === 'to_validate') {
        setTimeout(() => {
          setShowRejectDialog(true);
        }, 500);
      }
    } else {
      toast({
        title: "Erreur",
        description: `Candidature non trouvée avec l'ID: ${id}`,
        variant: "destructive",
      });
      navigate("/director/dashboard");
    }
  }, [id, navigate, action]);

  if (!application) {
    console.log('ApplicationReview - No application found, showing loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bourbon mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  const handleQuickValidate = async () => {
    if (!application || !currentUser?.id) return;
    
    setLoading(true);
    try {
      directorValidateApplication(application.id, currentUser.id);
      clearDirectorInboxForApplication(application.id);
      
      // Notifier le candidat (interne)
      addNotification({
        userId: application.id,
        type: 'success',
        title: 'Candidature validée',
        message: 'Félicitations ! Votre candidature a été validée par le directeur.',
      });

      // Envoyer email automatique
      const school = getSchoolById(application.schoolId);
      const classItem = getClassById(application.classId);
      const emailTemplate = emailService.templates.validation(
        application.firstName,
        application.lastName,
        school?.name || 'ISM',
        classItem?.name || ''
      );
      
      await emailService.sendEmail({
        to: application.email,
        subject: emailTemplate.subject,
        body: emailTemplate.body,
        isHtml: emailTemplate.isHtml
      });

      // Générer export Excel automatique pour cette classe
      exportService.generateExcelForClass(application.classId);

      toast({
        title: "Candidature validée",
        description: `La candidature a été validée, le candidat a été notifié par email et l'export Excel a été généré.`,
      });

      navigate("/director/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!currentUser?.id) return;
    
    setLoading(true);
    try {
      directorValidateApplication(application.id, currentUser.id);
      clearDirectorInboxForApplication(application.id);
      
      // Notifier le candidat (interne)
      addNotification({
        userId: application.id,
        type: 'success',
        title: 'Candidature validée',
        message: 'Félicitations ! Votre candidature a été validée par le directeur.',
      });

      // Envoyer email automatique
      const school = getSchoolById(application.schoolId);
      const classItem = getClassById(application.classId);
      const emailTemplate = emailService.templates.validation(
        application.firstName,
        application.lastName,
        school?.name || 'ISM',
        classItem?.name || ''
      );
      
      const emailResult = await emailService.sendEmail({
        to: application.email,
        subject: emailTemplate.subject,
        body: emailTemplate.body,
        isHtml: emailTemplate.isHtml
      });

      // Générer export Excel automatique pour cette classe
      exportService.generateExcelForClass(application.classId);

      toast({
        title: "Candidature validée",
        description: `La candidature a été validée, le candidat a été notifié par email et l'export Excel a été généré.`,
      });

      navigate("/director/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Motif requis",
        description: "Veuillez saisir un motif de rejet",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser?.id) return;
    
    setLoading(true);
    try {
      directorRejectApplication(application.id, currentUser.id, rejectionReason);
      clearDirectorInboxForApplication(application.id);
      
      // Notifier le candidat (interne)
      addNotification({
        userId: application.id,
        type: 'error',
        title: 'Candidature rejetée',
        message: `Votre candidature a été rejetée. Motif : ${rejectionReason}`,
      });

      // Envoyer email automatique
      const school = getSchoolById(application.schoolId);
      const emailTemplate = emailService.templates.rejet(
        application.firstName,
        application.lastName,
        school?.name || 'ISM',
        rejectionReason
      );
      
      await emailService.sendEmail({
        to: application.email,
        subject: emailTemplate.subject,
        body: emailTemplate.body,
        isHtml: emailTemplate.isHtml
      });

      toast({
        title: "Candidature rejetée",
        description: "La candidature a été rejetée et le candidat a été notifié par email.",
      });

      setShowRejectDialog(false);
      navigate("/director/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const school = getSchoolById(application.schoolId);
  const classInfo = getClassById(application.classId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/director/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dossier de {application.firstName} {application.lastName}
          </h1>
          <p className="text-gray-600">
            Examen de la candidature • {getStatusBadge(application.status)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom complet</label>
                  <p className="font-medium">
                    {application.firstName} {application.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {application.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {application.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                  <p className="font-medium">{application.dateOfBirth.toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Lieu de naissance</label>
                  <p className="font-medium">{application.address || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Sexe</label>
                  <p className="font-medium">{application.gender === 'male' ? 'Masculin' : 'Féminin'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scolarité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Scolarité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">École</label>
                  <p className="font-medium">{school?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Classe</label>
                  <p className="font-medium">{classInfo?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dernier diplôme</label>
                  <p className="font-medium">Baccalauréat</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Année d'obtention</label>
                  <p className="font-medium">2025</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents fournis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        PDF • Téléchargé le {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.status === 'to_validate' && (
                <>
                  <Button
                    onClick={handleValidate}
                    disabled={loading}
                    className="w-full bg-ochre hover:bg-rope"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Valider la candidature
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={loading}
                    className="w-full border-walnut text-walnut hover:bg-walnut hover:text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeter la candidature
                  </Button>
                </>
              )}
              
              {application.status === 'validated' && (
                <div className="text-center p-4 bg-ochre/10 rounded-lg">
                  <CheckCircle className="h-12 w-12 text-ochre mx-auto mb-2" />
                  <p className="font-medium text-ochre">Candidature validée</p>
                  <p className="text-sm text-ochre/70">Le candidat a été notifié</p>
                </div>
              )}
              
              {application.status === 'rejected' && (
                <div className="text-center p-4 bg-walnut/10 rounded-lg">
                  <XCircle className="h-12 w-12 text-walnut mx-auto mb-2" />
                  <p className="font-medium text-walnut">Candidature rejetée</p>
                  <p className="text-sm text-walnut/70">Le candidat a été notifié</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations supplémentaires */}
          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">ID de candidature</label>
                <p className="font-mono text-sm">{application.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date de soumission</label>
                <p className="text-sm">{new Date(application.createdAt).toLocaleString('fr-FR')}</p>
              </div>
              {application.validatedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Validé par</label>
                  <p className="text-sm">ID: {application.validatedBy}</p>
                </div>
              )}
              {application.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Motif de rejet</label>
                  <p className="text-sm text-red-600">{application.rejectionReason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de rejet */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la candidature</DialogTitle>
            <DialogDescription>
              Veuillez saisir le motif du rejet. Cette information sera communiquée au candidat.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                Cette action est irréversible et notifiera immédiatement le candidat.
              </p>
            </div>
            <Textarea
              placeholder="Motif du rejet..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={loading}
              >
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
