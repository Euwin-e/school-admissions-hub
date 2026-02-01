import { useState, useEffect } from "react";
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

const AgentDashboard = () => {
  const currentUser = authService.getCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    school: "",
    class: "",
    status: "",
    dateRange: ""
  });

  // Données enrichies pour le dashboard de l'agent
  const stats = [
    { label: "Candidatures en attente", value: "12", icon: Clock, color: "text-orange-600", change: "+2 aujourd'hui" },
    { label: "Validées ce mois", value: "28", icon: CheckCircle, color: "text-green-600", change: "+15%" },
    { label: "Dossiers urgents", value: "5", icon: AlertTriangle, color: "text-red-600", change: "À traiter aujourd'hui" },
    { label: "Temps moyen traitement", value: "3.2j", icon: Timer, color: "text-blue-600", change: "-0.5j vs mois dernier" }
  ];

  const applications = [
    {
      id: "CAND-001",
      student: "Jean Dupont",
      email: "jean.dupont@email.com",
      school: "Institut Supérieur de Management",
      class: "Master 1 Marketing",
      date: "2025-01-20",
      priority: "high",
      status: "pending",
      incompleteDocuments: true,
      missingDocuments: ["Lettre de motivation"],
      processingTime: 2,
      internalComments: "Profil excellent, mais documents manquants",
      quickView: {
        phone: "+221 77 123 45 67",
        address: "Dakar, Plateau",
        averageGrade: "15.2/20"
      }
    },
    {
      id: "CAND-002",
      student: "Marie Martin",
      email: "marie.martin@email.com",
      school: "École Supérieure Polytechnique",
      class: "Ingénieur 1 Informatique",
      date: "2025-01-20",
      priority: "normal",
      status: "reviewing",
      incompleteDocuments: false,
      missingDocuments: [],
      processingTime: 1,
      internalComments: "Dossier complet, candidature solide",
      quickView: {
        phone: "+221 76 234 56 78",
        address: "Dakar, Almadies",
        averageGrade: "16.8/20"
      }
    },
    {
      id: "CAND-003",
      student: "Pierre Bernard",
      email: "pierre.bernard@email.com",
      school: "Institut des Sciences Juridiques",
      class: "Licence 3 Droit Privé",
      date: "2025-01-19",
      priority: "normal",
      status: "pending",
      incompleteDocuments: true,
      missingDocuments: ["Relevé de notes", "Attestation de stage"],
      processingTime: 3,
      internalComments: "En attente de documents complémentaires",
      quickView: {
        phone: "+221 78 345 67 89",
        address: "Thiès, Centre",
        averageGrade: "13.5/20"
      }
    },
    {
      id: "CAND-004",
      student: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      school: "École des Arts et Métiers",
      class: "Design Graphique 1",
      date: "2025-01-19",
      priority: "low",
      status: "pending",
      incompleteDocuments: false,
      missingDocuments: [],
      processingTime: 1,
      internalComments: "Portfolio impressionnant",
      quickView: {
        phone: "+221 77 456 78 90",
        address: "Saint-Louis",
        averageGrade: "14.7/20"
      }
    },
    {
      id: "CAND-005",
      student: "Alassane Ba",
      email: "alassane.ba@email.com",
      school: "Institut Supérieur de Management",
      class: "MBA 1",
      date: "2025-01-18",
      priority: "high",
      status: "pending",
      incompleteDocuments: true,
      missingDocuments: ["Diplôme Bac", "Lettre de recommandation"],
      processingTime: 4,
      internalComments: "Urgent - deadline proche",
      quickView: {
        phone: "+221 76 567 89 01",
        address: "Dakar, Fann",
        averageGrade: "12.8/20"
      }
    }
  ];

  // Filtrage des candidatures
  const filteredApplications = applications.filter(app => {
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
  const uniqueSchools = [...new Set(applications.map(app => app.school))];
  const uniqueClasses = [...new Set(applications.map(app => app.class))];

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
      case "reviewing":
        return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "En examen" };
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
    console.log(`Action ${action} sur ${selectedApplications.length} candidatures`);
    // Implémenter l'action groupée ici
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
                      <SelectItem value="reviewing">En examen</SelectItem>
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
                    onClick={() => handleBulkAction('complete')}
                  >
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Marquer comme complet
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleBulkAction('transmit')}
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
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-orange-600 hover:bg-orange-700"
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

      {/* Quick Actions */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button className="bg-orange-600 hover:bg-orange-700 h-12 justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Voir toutes les candidatures
            </Button>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 h-12 justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Générer un rapport
            </Button>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 h-12 justify-start">
              <Users className="h-4 w-4 mr-2" />
              Candidatures incomplètes
            </Button>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 h-12 justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Planning des traitements
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDashboard;
