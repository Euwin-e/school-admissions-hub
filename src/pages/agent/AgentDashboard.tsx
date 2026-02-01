import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter,
  Eye,
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  CheckSquare,
  Send,
  X,
  Info,
  Timer,
  FileWarning
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/data/mockAuth";
import {
  getStoredApplications,
  getApplicationDocumentIssues,
  markApplicationToValidate,
} from "@/data/applicationsRepository";
import { getSchoolById, getClassById } from "@/data/mockData";
import type { Application } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const AgentDashboard = () => {
  const currentUser = authService.getCurrentUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<"view" | "review" | null>(null);
  const [quickActionDialog, setQuickActionDialog] = useState<"incomplete" | "planning" | null>(null);
  const [filters, setFilters] = useState({
    school: "",
    class: "",
    status: "",
    dateRange: ""
  });

  useEffect(() => {
    setApplications(getStoredApplications());
  }, []);

  // Données enrichies pour le dashboard de l'agent
  const stats = [
    { label: "Candidatures en attente", value: "12", icon: Clock, color: "text-orange-600", change: "+2 aujourd'hui" },
    { label: "Validées ce mois", value: "28", icon: CheckCircle, color: "text-green-600", change: "+15%" },
    { label: "Dossiers urgents", value: "5", icon: AlertTriangle, color: "text-red-600", change: "À traiter aujourd'hui" },
    { label: "Temps moyen traitement", value: "3.2j", icon: Timer, color: "text-blue-600", change: "-0.5j vs mois dernier" }
  ];

  const getApplicationDisplay = (app: Application) => {
    const school = getSchoolById(app.schoolId);
    const classItem = getClassById(app.classId);
    const issues = getApplicationDocumentIssues(app);

    return {
      id: app.id,
      student: `${app.firstName} ${app.lastName}`,
      email: app.email,
      school: school?.name ?? app.schoolId,
      class: classItem?.name ?? app.classId,
      date: typeof app.createdAt === 'string' ? app.createdAt : app.createdAt.toISOString().split('T')[0],
      priority: issues.missing.length > 0 ? 'high' : 'normal',
      status: app.status,
      incompleteDocuments: issues.missing.length > 0 || issues.nonConforming.length > 0,
      missingDocuments: [...issues.missing, ...issues.nonConforming],
      processingTime: 0,
      internalComments: '',
      quickView: {
        phone: app.phone,
        address: app.address,
        averageGrade: ''
      }
    };
  };

  const displayApplications = applications.map(getApplicationDisplay);

  const selectedApp = selectedAppId
    ? applications.find((a) => a.id === selectedAppId) ?? null
    : null;

  // Filtrage des candidatures
  const filteredApplications = displayApplications.filter(app => {
    const matchesSearch = app.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = !filters.school || app.school === filters.school;
    const matchesClass = !filters.class || app.class === filters.class;
    const matchesStatus = !filters.status || app.status === filters.status;
    const matchesDate = !filters.dateRange || app.date.includes(filters.dateRange);
    
    return matchesSearch && matchesSchool && matchesClass && matchesStatus && matchesDate;
  });

  // Écoles uniques pour le filtre
  const uniqueSchools = [...new Set(displayApplications.map(app => app.school))];
  const uniqueClasses = [...new Set(displayApplications.map(app => app.class))];

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "high":
        return { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", label: "Urgent" };
      case "normal":
        return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300", label: "Normal" };
      case "low":
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300", label: "Faible" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300", label: "Inconnu" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", label: "En attente" };
      case "to_validate":
        return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "À valider" };
      case "validated":
        return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Validé" };
      case "rejected":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Rejeté" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", label: "Inconnu" };
    }
  };

  const handleSelectApplication = (appId: string) => {
    setSelectedApplications(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (action !== 'to_validate') {
      return;
    }

    selectedApplications.forEach((id) => {
      markApplicationToValidate(id, currentUser?.id);
    });

    setApplications(getStoredApplications());
    setSelectedApplications([]);
  };

  const openViewDialog = (appId: string) => {
    setSelectedAppId(appId);
    setActiveDialog('view');
  };

  const openReviewDialog = (appId: string) => {
    setSelectedAppId(appId);
    setActiveDialog('review');
  };

  const closeDialogs = () => {
    setActiveDialog(null);
  };

  const closeQuickActionDialog = () => {
    setQuickActionDialog(null);
  };

  const handleMarkSelectedToValidate = () => {
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
    closeDialogs();
  };

  const handleGenerateReport = () => {
    const header = ["Matricule", "Nom", "Email", "École", "Classe", "Statut"];
    const rows = applications.map((app) => [
      app.matricule,
      `${app.firstName} ${app.lastName}`,
      app.email,
      getSchoolById(app.schoolId)?.name ?? app.schoolId,
      getClassById(app.classId)?.name ?? app.classId,
      app.status,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rapport-candidatures.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Rapport généré",
      description: "Le fichier CSV a été téléchargé.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header avec alerte charge de travail */}
      <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-6 border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tableau de bord Agent
            </h1>
            <p className="text-gray-700">
              Gérez les candidatures et suivez votre productivité
            </p>
          </div>
          <div className="text-right">
            <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-2">
              <p className="text-red-800 font-semibold">⚠️ Charge de travail</p>
              <p className="text-red-700 text-sm">Vous avez 5 dossiers urgents aujourd'hui</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <Card key={idx} className="border-orange-200 hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Candidatures à traiter avec filtres avancés */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Candidatures à traiter ({filteredApplications.length})
            </span>
            <div className="flex items-center gap-2">
              {selectedApplications.length > 0 && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                  {selectedApplications.length} sélectionnée(s)
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-600 hover:bg-orange-100"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filtres
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filtres avancés */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">École</label>
                  <Select value={filters.school} onValueChange={(value) => setFilters(prev => ({...prev, school: value}))}>
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Toutes les écoles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les écoles</SelectItem>
                      {uniqueSchools.map(school => (
                        <SelectItem key={school} value={school}>{school}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
                  <Select value={filters.class} onValueChange={(value) => setFilters(prev => ({...prev, class: value}))}>
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Toutes les classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les classes</SelectItem>
                      {uniqueClasses.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="to_validate">À valider</SelectItem>
                      <SelectItem value="validated">Validé</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <Input
                    type="date"
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value}))}
                    className="border-orange-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, email ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-500"
            />
          </div>

          {/* Actions groupées */}
          {selectedApplications.length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-800">
                  {selectedApplications.length} candidature(s) sélectionnée(s)
                </span>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    onClick={() => handleBulkAction('to_validate')}
                  >
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Marquer "À valider"
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleBulkAction('to_validate')}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Transmettre au directeur
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Applications List avec aperçu rapide */}
          <div className="space-y-2">
            {/* Header du tableau */}
            <div className="grid grid-cols-12 gap-2 p-3 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
              <div className="col-span-1 flex items-center">
                <Checkbox 
                  checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </div>
              <div className="col-span-3">Candidat</div>
              <div className="col-span-2">École/Classe</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-2">Documents</div>
              <div className="col-span-2">Actions</div>
            </div>

            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => {
                const priorityBadge = getPriorityBadge(app.priority);
                const statusBadge = getStatusBadge(app.status);
                const isSelected = selectedApplications.includes(app.id);
                
                return (
                  <div
                    key={app.id}
                    className={`grid grid-cols-12 gap-2 p-4 rounded-lg border transition-all ${
                      isSelected 
                        ? 'bg-orange-50 border-orange-300' 
                        : 'bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="col-span-1 flex items-center">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => handleSelectApplication(app.id)}
                      />
                    </div>

                    {/* Candidat */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{app.student}</span>
                        <span className={`text-xs font-semibold ${priorityBadge.bg} ${priorityBadge.text} px-2 py-1 rounded`}>
                          {priorityBadge.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{app.email}</p>
                      <p className="text-xs text-gray-400">⏱ {app.processingTime}j de traitement</p>
                    </div>

                    {/* École/Classe */}
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-900">{app.school}</p>
                      <p className="text-xs text-gray-500">{app.class}</p>
                      <p className="text-xs text-gray-400">📅 {app.date}</p>
                    </div>

                    {/* Statut */}
                    <div className="col-span-2">
                      <div className={`${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} px-3 py-1 rounded-full border text-xs font-semibold mb-2 inline-block`}>
                        {statusBadge.label}
                      </div>
                      {app.incompleteDocuments && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <FileWarning className="h-3 w-3" />
                          Incomplet
                        </div>
                      )}
                    </div>

                    {/* Documents */}
                    <div className="col-span-2">
                      {app.incompleteDocuments ? (
                        <div className="text-xs">
                          <div className="flex items-center gap-1 text-red-600 mb-1">
                            <X className="h-3 w-3" />
                            {app.missingDocuments.length} manquant(s)
                          </div>
                          <div className="text-gray-500">
                            {app.missingDocuments.slice(0, 2).join(', ')}
                            {app.missingDocuments.length > 2 && '...'}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Complet
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                          onClick={() => openViewDialog(app.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => openReviewDialog(app.id)}
                        >
                          Examiner
                        </Button>
                      </div>
                      
                      {/* Commentaire interne */}
                      {app.internalComments && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                          <MessageSquare className="h-3 w-3 inline mr-1" />
                          {app.internalComments}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune candidature trouvée</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={activeDialog === 'view'} onOpenChange={(open) => !open && closeDialogs()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
            <DialogDescription>
              {selectedApp ? `${selectedApp.matricule} — ${selectedApp.firstName} ${selectedApp.lastName}` : ''}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium break-all">{selectedApp.email}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Téléphone</div>
                  <div className="text-sm font-medium">{selectedApp.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">École</div>
                  <div className="text-sm font-medium">{getSchoolById(selectedApp.schoolId)?.name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Classe</div>
                  <div className="text-sm font-medium">{getClassById(selectedApp.classId)?.name}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Documents</div>
                {selectedApp.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedApp.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">{doc.type}</div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <a href={doc.url} target="_blank" rel="noreferrer">
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Aucun document fourni.</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'review'} onOpenChange={(open) => !open && closeDialogs()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Examen du dossier</DialogTitle>
            <DialogDescription>
              {selectedApp ? `${selectedApp.matricule} — ${selectedApp.firstName} ${selectedApp.lastName}` : ''}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              {(() => {
                const issues = getApplicationDocumentIssues(selectedApp);
                const isOk = issues.missing.length === 0 && issues.nonConforming.length === 0;
                return (
                  <div className="space-y-3">
                    {isOk ? (
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Dossier complet et conforme. Vous pouvez transmettre au directeur.
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm text-red-700">
                        <div className="font-medium">Problèmes détectés</div>
                        {issues.missing.length > 0 && (
                          <div>Manquants : {issues.missing.join(', ')}</div>
                        )}
                        {issues.nonConforming.length > 0 && (
                          <div>Non conformes : {issues.nonConforming.join(', ')}</div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={handleMarkSelectedToValidate}
                        disabled={!isOk}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Transmettre au directeur (À valider)
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              className="bg-orange-600 hover:bg-orange-700 h-12 justify-start"
              onClick={() => navigate('/agent-dashboard/candidatures')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Voir toutes les candidatures
            </Button>
            <Button
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50 h-12 justify-start"
              onClick={handleGenerateReport}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Générer un rapport
            </Button>
            <Button
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50 h-12 justify-start"
              onClick={() => setQuickActionDialog('incomplete')}
            >
              <Users className="h-4 w-4 mr-2" />
              Candidatures incomplètes
            </Button>
            <Button
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50 h-12 justify-start"
              onClick={() => setQuickActionDialog('planning')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Planning des traitements
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={quickActionDialog === 'incomplete'} onOpenChange={(open) => !open && closeQuickActionDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidatures incomplètes</DialogTitle>
            <DialogDescription>Liste des dossiers à compléter.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {displayApplications.filter((app) => app.incompleteDocuments).length > 0 ? (
              displayApplications
                .filter((app) => app.incompleteDocuments)
                .map((app) => (
                  <div key={app.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{app.student}</div>
                        <div className="text-xs text-muted-foreground">{app.school} • {app.class}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => openReviewDialog(app.id)}>
                        Examiner
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-red-700">
                      {app.missingDocuments.slice(0, 3).join(', ')}
                      {app.missingDocuments.length > 3 && '...'}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-sm text-muted-foreground">Aucun dossier incomplet.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={quickActionDialog === 'planning'} onOpenChange={(open) => !open && closeQuickActionDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Planning des traitements</DialogTitle>
            <DialogDescription>Résumé rapide du flux de traitement.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Dossiers en attente</span>
              <span className="font-medium">
                {displayApplications.filter((app) => app.status === 'pending').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dossiers incomplets</span>
              <span className="font-medium">
                {displayApplications.filter((app) => app.incompleteDocuments).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dossiers prêts à valider</span>
              <span className="font-medium">
                {displayApplications.filter((app) => app.status === 'to_validate').length}
              </span>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => navigate('/agent-dashboard/candidatures')}>
              Ouvrir la file de traitement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentDashboard;
