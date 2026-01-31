import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  mockApplications, 
  mockSchools, 
  mockClasses, 
  getSchoolById, 
  getClassById,
  getClassesBySchool 
} from '@/data/mockData';
import { Application, ApplicationStatus, Gender } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Candidatures() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
  // New application form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as Gender,
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    schoolId: '',
    classId: '',
  });

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSchool = schoolFilter === 'all' || app.schoolId === schoolFilter;

    return matchesSearch && matchesStatus && matchesSchool;
  });

  const availableClasses = formData.schoolId 
    ? getClassesBySchool(formData.schoolId) 
    : [];

  const handleViewApplication = (app: Application) => {
    setSelectedApplication(app);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des candidatures" 
        subtitle="Consultez et gérez toutes les candidatures"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle candidature
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouvelle candidature</DialogTitle>
                <DialogDescription>
                  Saisissez les informations du candidat
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Nom de famille"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="Prénom"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Sexe</Label>
                    <Select 
                      value={formData.gender}
                      onValueChange={(value) => setFormData({...formData, gender: value as Gender})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculin</SelectItem>
                        <SelectItem value="female">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date de naissance</Label>
                    <Input 
                      id="dateOfBirth" 
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+221 77 000 00 00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Adresse complète"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school">École demandée</Label>
                    <Select 
                      value={formData.schoolId}
                      onValueChange={(value) => setFormData({...formData, schoolId: value, classId: ''})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une école" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSchools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Classe demandée</Label>
                    <Select 
                      value={formData.classId}
                      onValueChange={(value) => setFormData({...formData, classId: value})}
                      disabled={!formData.schoolId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une classe" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClasses.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, matricule, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="validated">Validé</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>
        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="École" />
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

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredApplications.length} candidature(s) trouvée(s)
      </p>

      {/* Table */}
      <div className="table-container">
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
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  École / Classe
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredApplications.map((application) => {
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
                          <p className="font-medium">{application.lastName} {application.firstName}</p>
                          <p className="text-xs text-muted-foreground">
                            {application.gender === 'male' ? 'M' : 'F'} • {format(application.dateOfBirth, 'dd/MM/yyyy')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p>{application.email}</p>
                        <p className="text-muted-foreground">{application.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="font-medium">{school?.code}</p>
                        <p className="text-muted-foreground">{classItem?.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                      {format(application.createdAt, 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewApplication(application)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Application Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
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
                <div className="ml-auto">
                  <StatusBadge status={selectedApplication.status} />
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

              {selectedApplication.rejectionReason && (
                <div className="rounded-lg bg-destructive/10 p-4">
                  <p className="text-sm font-medium text-destructive">Motif du rejet</p>
                  <p className="text-sm">{selectedApplication.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
