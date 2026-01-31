import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  mockApplications, 
  mockSchools, 
  getSchoolById, 
  getClassById 
} from '@/data/mockData';
import { Application } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function Admissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  // Only show pending applications for admission decisions
  const pendingApplications = mockApplications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.matricule.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSchool = schoolFilter === 'all' || app.schoolId === schoolFilter;
    const isPending = app.status === 'pending';

    return matchesSearch && matchesSchool && isPending;
  });

  const handleValidate = (app: Application) => {
    toast({
      title: "Candidature validée",
      description: `${app.firstName} ${app.lastName} a été admis(e) avec succès.`,
    });
    setSelectedApplication(null);
  };

  const handleReject = () => {
    if (selectedApplication) {
      toast({
        title: "Candidature rejetée",
        description: `La candidature de ${selectedApplication.firstName} ${selectedApplication.lastName} a été rejetée.`,
        variant: "destructive",
      });
      setShowRejectDialog(false);
      setSelectedApplication(null);
      setRejectionReason('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des admissions" 
        subtitle="Validez ou rejetez les candidatures en attente"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-elevated flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
            <Clock className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingApplications.length}</p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </div>
        </div>
        <div className="card-elevated flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {mockApplications.filter(a => a.status === 'validated').length}
            </p>
            <p className="text-sm text-muted-foreground">Validées ce mois</p>
          </div>
        </div>
        <div className="card-elevated flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {mockApplications.filter(a => a.status === 'rejected').length}
            </p>
            <p className="text-sm text-muted-foreground">Rejetées ce mois</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un candidat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Filtrer par école" />
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

      {/* Pending Applications Grid */}
      {pendingApplications.length === 0 ? (
        <div className="card-elevated flex flex-col items-center justify-center py-16">
          <CheckCircle className="h-16 w-16 text-success/30" />
          <h3 className="mt-4 text-lg font-semibold">Aucune candidature en attente</h3>
          <p className="text-muted-foreground">Toutes les candidatures ont été traitées.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingApplications.map((application) => {
            const school = getSchoolById(application.schoolId);
            const classItem = getClassById(application.classId);
            return (
              <div key={application.id} className="card-elevated overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {application.firstName[0]}{application.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {application.lastName} {application.firstName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{application.matricule}</p>
                      </div>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">École</span>
                      <span className="font-medium">{school?.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Classe</span>
                      <span className="font-medium">{classItem?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span>{format(application.createdAt, 'dd MMM yyyy', { locale: fr })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="flex-1 rounded-none text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Voir
                  </Button>
                  <div className="w-px bg-border" />
                  <Button 
                    variant="ghost" 
                    className="flex-1 rounded-none text-success hover:bg-success/10 hover:text-success"
                    onClick={() => handleValidate(application)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Valider
                  </Button>
                  <div className="w-px bg-border" />
                  <Button 
                    variant="ghost" 
                    className="flex-1 rounded-none text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowRejectDialog(true);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rejeter
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Application Dialog */}
      <Dialog open={!!selectedApplication && !showRejectDialog} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
            <DialogDescription>
              {selectedApplication?.matricule}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {selectedApplication.firstName[0]}{selectedApplication.lastName[0]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedApplication.lastName} {selectedApplication.firstName}
                  </h3>
                  <p className="text-muted-foreground">{selectedApplication.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{selectedApplication.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date de naissance</p>
                  <p className="font-medium">{format(selectedApplication.dateOfBirth, 'dd MMMM yyyy', { locale: fr })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Sexe</p>
                  <p className="font-medium">{selectedApplication.gender === 'male' ? 'Masculin' : 'Féminin'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">{selectedApplication.address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">École demandée</p>
                  <p className="font-medium">{getSchoolById(selectedApplication.schoolId)?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Classe demandée</p>
                  <p className="font-medium">{getClassById(selectedApplication.classId)?.name}</p>
                </div>
              </div>

              {selectedApplication.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Documents joints</p>
                  <div className="space-y-2">
                    {selectedApplication.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                        <span className="text-sm">{doc.name}</span>
                        <Button variant="outline" size="sm">Télécharger</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => setShowRejectDialog(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
            <Button onClick={() => selectedApplication && handleValidate(selectedApplication)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider l'admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la candidature</DialogTitle>
            <DialogDescription>
              Veuillez indiquer le motif du rejet pour {selectedApplication?.firstName} {selectedApplication?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motif du rejet</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Dossier incomplet, pièces justificatives manquantes..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
