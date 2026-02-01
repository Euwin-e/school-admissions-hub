import { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  GraduationCap,
  TrendingUp,
  Users,
  Settings,
  Shield,
  Download,
  AlertTriangle,
  Calendar,
  BarChart3,
  Activity,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Database,
  FileWarning,
  Bell,
  Filter,
  Search,
  RefreshCw,
  UserCheck,
  UserX,
  AlertCircle,
  CheckSquare,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  getDashboardStats, 
  mockApplications, 
  getSchoolById, 
  getClassById 
} from '@/data/mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [showSystemAlerts, setShowSystemAlerts] = useState(true);

  // Données enrichies pour le dashboard expert
  const stats = getDashboardStats();

  // Configuration des écoles
  const [schoolsConfig, setSchoolsConfig] = useState([
    {
      id: '1',
      name: 'Institut Supérieur de Management',
      isActive: true,
      maxCapacity: 150,
      currentApplications: 45,
      admissionOpen: true,
      openDate: '2025-01-01',
      closeDate: '2025-03-31',
      administrator: 'Fatou Sow'
    },
    {
      id: '2',
      name: 'École Supérieure Polytechnique',
      isActive: true,
      maxCapacity: 200,
      currentApplications: 38,
      admissionOpen: true,
      openDate: '2025-01-15',
      closeDate: '2025-04-15',
      administrator: 'Ibrahima Fall'
    },
    {
      id: '3',
      name: 'Institut des Sciences Juridiques',
      isActive: false,
      maxCapacity: 100,
      currentApplications: 12,
      admissionOpen: false,
      openDate: '2025-02-01',
      closeDate: '2025-05-31',
      administrator: 'Aminata Ndiaye'
    },
    {
      id: '4',
      name: 'École des Arts et Métiers',
      isActive: true,
      maxCapacity: 80,
      currentApplications: 28,
      admissionOpen: true,
      openDate: '2025-01-01',
      closeDate: '2025-03-15',
      administrator: 'Ousmane Ba'
    }
  ]);

  // Alertes système
  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Classe complète',
      message: 'Master 1 Marketing (ISM) a atteint sa capacité maximale (30/30)',
      school: 'Institut Supérieur de Management',
      class: 'Master 1 Marketing',
      time: 'Il y a 30 minutes',
      priority: 'high'
    },
    {
      id: 2,
      type: 'error',
      title: 'Trop de dossiers en attente',
      message: '25 candidatures en attente depuis plus de 5 jours',
      school: 'Toutes écoles',
      time: 'Il y a 2 heures',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'error',
      title: 'Erreur d\'export',
      message: 'L\'export ESP a échoué - Timeout serveur',
      school: 'École Supérieure Polytechnique',
      time: 'Il y a 3 heures',
      priority: 'high'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'error': return AlertTriangle;
      case 'warning': return AlertCircle;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch(type) {
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec alertes système */}
      <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-6 border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de Bord Expert
            </h1>
            <p className="text-gray-700">
              Gestion complète du système d'admissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-100 text-orange-800 border-orange-300">
              {systemAlerts.filter(a => a.priority === 'high').length} alertes critiques
            </Badge>
            <Button 
              variant="outline" 
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={() => setShowSystemAlerts(!showSystemAlerts)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Alertes ({systemAlerts.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Alertes système */}
      {showSystemAlerts && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Alertes Système ({systemAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {systemAlerts.map((alert) => {
                const AlertIcon = getAlertIcon(alert.type);
                return (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertIcon className="h-5 w-5 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">{alert.title}</h4>
                          <p className="text-sm mt-1">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span>📍 {alert.school}</span>
                            <span>⏰ {alert.time}</span>
                            <Badge variant="outline" className="text-xs">
                              {alert.priority === 'high' ? 'Critique' : alert.priority === 'medium' ? 'Moyenne' : 'Basse'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Traiter
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'schools', label: 'Paramétrage écoles', icon: Building2 },
            { id: 'exports', label: 'Historique exports', icon: Download },
            { id: 'audit', label: 'Journal d\'audit', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total candidatures</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                    <p className="text-xs text-green-600 mt-1">+12% ce mois</p>
                  </div>
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">En attente</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.pendingApplications}</p>
                    <p className="text-xs text-orange-600 mt-1">À traiter</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Validées</p>
                    <p className="text-3xl font-bold text-green-600">{stats.validatedApplications}</p>
                    <p className="text-xs text-green-600 mt-1">+15% vs mois dernier</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rejetées</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejectedApplications}</p>
                    <p className="text-xs text-red-600 mt-1">-5% vs mois dernier</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications Table */}
          <Card className="border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Candidatures récentes
                </span>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 border-orange-200"
                  />
                  <Button variant="outline" size="sm" className="border-orange-300">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Matricule</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Candidat</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">École</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Classe</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockApplications.slice(0, 5).map((application) => {
                      const school = getSchoolById(application.schoolId);
                      const classItem = getClassById(application.classId);
                      return (
                        <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {application.matricule}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-600">
                                {application.firstName[0]}{application.lastName[0]}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{application.firstName} {application.lastName}</p>
                                <p className="text-xs text-gray-500">{application.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {school?.name || 'N/A'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {classItem?.name || 'N/A'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {format(application.createdAt, 'dd MMM yyyy', { locale: fr })}
                          </td>
                          <td className="px-4 py-4">
                            <Badge className={
                              application.status === 'validated' ? 'bg-green-100 text-green-800 border-green-300' :
                              application.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                              'bg-orange-100 text-orange-800 border-orange-300'
                            }>
                              {application.status === 'validated' ? 'Validée' :
                               application.status === 'rejected' ? 'Rejetée' : 'En attente'}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Paramétrage écoles */}
      {activeTab === 'schools' && (
        <div className="space-y-6">
          <Card className="border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                Paramétrage avancé des écoles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {schoolsConfig.map((school) => (
                  <div key={school.id} className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                        <p className="text-sm text-gray-600">Administrateur : {school.administrator}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={school.isActive ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-800 border-gray-300'}>
                          {school.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Statut de l'école</p>
                          <p className="text-xs text-gray-500">Activer/désactiver l'école</p>
                        </div>
                        <Switch
                          checked={school.isActive}
                          onCheckedChange={() => {
                            setSchoolsConfig(prev => prev.map(s => 
                              s.id === school.id ? { ...s, isActive: !s.isActive } : s
                            ));
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Admissions ouvertes</p>
                          <p className="text-xs text-gray-500">Permettre les candidatures</p>
                        </div>
                        <Switch
                          checked={school.admissionOpen}
                          onCheckedChange={() => {
                            setSchoolsConfig(prev => prev.map(s => 
                              s.id === school.id ? { ...s, admissionOpen: !s.admissionOpen } : s
                            ));
                          }}
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Limite de places</p>
                        <Input
                          type="number"
                          value={school.maxCapacity}
                          className="border-orange-200"
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            setSchoolsConfig(prev => prev.map(s => 
                              s.id === school.id ? { ...s, maxCapacity: newValue } : s
                            ));
                          }}
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Places utilisées</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full"
                              style={{ width: `${(school.currentApplications / school.maxCapacity) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{school.currentApplications}/{school.maxCapacity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Date d'ouverture</p>
                        <Input
                          type="date"
                          value={school.openDate}
                          className="border-orange-200"
                          onChange={(e) => {
                            setSchoolsConfig(prev => prev.map(s => 
                              s.id === school.id ? { ...s, openDate: e.target.value } : s
                            ));
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Date de fermeture</p>
                        <Input
                          type="date"
                          value={school.closeDate}
                          className="border-orange-200"
                          onChange={(e) => {
                            setSchoolsConfig(prev => prev.map(s => 
                              s.id === school.id ? { ...s, closeDate: e.target.value } : s
                            ));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historique des exports */}
      {activeTab === 'exports' && (
        <div className="space-y-6">
          <Card className="border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-orange-600" />
                  Historique des exports
                </span>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export global
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Utilisateur</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Portée</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Taille</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        user: 'Admin System',
                        email: 'admin@digitalcampus.sn',
                        type: 'Export global',
                        scope: 'Toutes les écoles',
                        date: '2025-01-31 14:30',
                        fileSize: '2.4 MB',
                        status: 'completed',
                        downloadCount: 3
                      },
                      {
                        user: 'Fatou Sow',
                        email: 'fatou.sow@digitalcampus.sn',
                        type: 'Export par école',
                        scope: 'ISM uniquement',
                        date: '2025-01-31 10:15',
                        fileSize: '856 KB',
                        status: 'completed',
                        downloadCount: 1
                      },
                      {
                        user: 'Ibrahima Fall',
                        email: 'ibrahima.fall@digitalcampus.sn',
                        type: 'Export par classe',
                        scope: 'Ingénieur 1 Informatique',
                        date: '2025-01-30 16:45',
                        fileSize: '342 KB',
                        status: 'failed',
                        downloadCount: 0,
                        error: 'Timeout - Trop de données'
                      }
                    ].map((exportItem, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{exportItem.user}</p>
                            <p className="text-xs text-gray-500">{exportItem.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <Badge variant="outline" className="border-orange-300 text-orange-700">
                            {exportItem.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{exportItem.scope}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{exportItem.date}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{exportItem.fileSize}</td>
                        <td className="px-4 py-4">
                          <Badge className={
                            exportItem.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                            'bg-red-100 text-red-800 border-red-300'
                          }>
                            {exportItem.status === 'completed' ? '✓ Terminé' : '✗ Échoué'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {exportItem.status === 'completed' && (
                              <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                                <Download className="h-3 w-3 mr-1" />
                                Télécharger
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="border-gray-300">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Journal d'audit */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <Card className="border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <History className="h-5 w-5 text-orange-600" />
                  Journal d'audit (Audit Log)
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-orange-300 text-orange-700">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter le journal
                  </Button>
                  <Button variant="outline" className="border-orange-300 text-orange-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Utilisateur</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Cible</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">IP</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        user: 'Admin System',
                        action: 'Modification des paramètres système',
                        target: 'Configuration des admissions',
                        date: '2025-01-31 14:45',
                        ip: '192.168.1.100',
                        success: true
                      },
                      {
                        user: 'Fatou Sow',
                        action: 'Validation de candidature',
                        target: 'CAND-2026-0002',
                        date: '2025-01-31 11:30',
                        ip: '192.168.1.102',
                        success: true
                      },
                      {
                        user: 'Agent inconnu',
                        action: 'Tentative d\'accès non autorisé',
                        target: 'Panel administrateur',
                        date: '2025-01-31 09:15',
                        ip: '192.168.1.200',
                        success: false
                      }
                    ].map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{log.user}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{log.action}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{log.target}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{log.date}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{log.ip}</td>
                        <td className="px-4 py-4">
                          <Badge className={log.success ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}>
                            {log.success ? '✓ Succès' : '✗ Échec'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
