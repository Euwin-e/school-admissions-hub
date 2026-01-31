import { useState } from 'react';
import { Plus, Search, Building2, Users, GraduationCap, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  mockSchools, 
  mockClasses, 
  mockApplications,
  getClassesBySchool,
  mockUsers
} from '@/data/mockData';
import { School } from '@/types';

export default function Ecoles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  const filteredSchools = mockSchools.filter((school) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSchoolStats = (schoolId: string) => {
    const classes = getClassesBySchool(schoolId);
    const applications = mockApplications.filter(a => a.schoolId === schoolId);
    const validated = applications.filter(a => a.status === 'validated').length;
    const director = mockUsers.find(u => u.schoolId === schoolId && u.role === 'director');
    
    return {
      classCount: classes.length,
      applicationCount: applications.length,
      validatedCount: validated,
      director,
    };
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des écoles" 
        subtitle="Gérez les instituts et leurs paramètres"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle école
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une école</DialogTitle>
                <DialogDescription>
                  Créez un nouvel institut ou école
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'école</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Institut Supérieur de Commerce"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input 
                    id="code" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="Ex: ISC"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description de l'école..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher une école..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Schools Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredSchools.map((school) => {
          const stats = getSchoolStats(school.id);
          return (
            <div 
              key={school.id} 
              className="card-elevated overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="gradient-primary p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-xl font-bold text-white">
                      {school.code}
                    </div>
                    <div className="text-white">
                      <h3 className="text-lg font-semibold">{school.name}</h3>
                      <p className="text-sm text-white/80">{school.description}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedSchool(school)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-xs">Classes</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.classCount}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Candidatures</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.applicationCount}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 text-success">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Admis</span>
                    </div>
                    <p className="text-2xl font-bold text-success">{stats.validatedCount}</p>
                  </div>
                </div>

                {stats.director && (
                  <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {stats.director.firstName[0]}{stats.director.lastName[0]}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{stats.director.firstName} {stats.director.lastName}</p>
                      <p className="text-xs text-muted-foreground">Directeur</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
