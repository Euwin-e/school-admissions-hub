import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  GraduationCap,
  TrendingUp,
  Users
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageHeader } from '@/components/ui/page-header';
import { 
  getDashboardStats, 
  mockApplications, 
  getSchoolById, 
  getClassById 
} from '@/data/mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard() {
  const stats = getDashboardStats();

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Tableau de bord" 
        subtitle="Vue d'ensemble des admissions et candidatures"
      />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total candidatures"
          value={stats.totalApplications}
          icon={FileText}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="En attente"
          value={stats.pendingApplications}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Validées"
          value={stats.validatedApplications}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Rejetées"
          value={stats.rejectedApplications}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Écoles"
          value={stats.totalSchools}
          icon={Building2}
        />
        <StatCard
          title="Classes"
          value={stats.totalClasses}
          icon={GraduationCap}
        />
        <StatCard
          title="Taux d'admission"
          value={`${Math.round((stats.validatedApplications / stats.totalApplications) * 100)}%`}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Recent Applications Table */}
      <div className="table-container">
        <div className="border-b border-border p-4">
          <h2 className="text-lg font-semibold">Candidatures récentes</h2>
          <p className="text-sm text-muted-foreground">Les 5 dernières candidatures reçues</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Matricule
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Candidat
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  École
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Classe
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockApplications.slice(0, 5).map((application) => {
                const school = getSchoolById(application.schoolId);
                const classItem = getClassById(application.classId);
                return (
                  <tr key={application.id} className="transition-colors hover:bg-muted/20">
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-primary">
                      {application.matricule}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {application.firstName[0]}{application.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium">{application.firstName} {application.lastName}</p>
                          <p className="text-xs text-muted-foreground">{application.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      {school?.name || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      {classItem?.name || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                      {format(application.createdAt, 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats by School */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <h2 className="mb-4 text-lg font-semibold">Répartition par école</h2>
          <div className="space-y-4">
            {['1', '2', '3', '4'].map((schoolId) => {
              const school = getSchoolById(schoolId);
              const applications = mockApplications.filter(a => a.schoolId === schoolId);
              const validated = applications.filter(a => a.status === 'validated').length;
              const percentage = applications.length > 0 
                ? Math.round((validated / applications.length) * 100) 
                : 0;
              
              return (
                <div key={schoolId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{school?.name}</span>
                    <span className="text-muted-foreground">{validated}/{applications.length} admis</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-elevated p-6">
          <h2 className="mb-4 text-lg font-semibold">Activité récente</h2>
          <div className="space-y-4">
            {[
              { icon: Users, text: 'Nouvelle candidature de Moussa Diop', time: 'Il y a 2 heures', color: 'text-primary' },
              { icon: CheckCircle, text: 'Aissatou Bah admise en M1 Finance', time: 'Il y a 5 heures', color: 'text-success' },
              { icon: XCircle, text: 'Mariama Sarr refusée (dossier incomplet)', time: 'Hier', color: 'text-destructive' },
              { icon: FileText, text: 'Export Excel généré pour ISM', time: 'Hier', color: 'text-info' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg bg-muted p-2 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
