import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Globe, Lock, Palette, Save } from 'lucide-react';

export default function Parametres() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Paramètres" 
        subtitle="Configurez les paramètres de la plateforme"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="space-y-6 lg:col-span-2">
          {/* General Settings */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Paramètres généraux</h2>
                <p className="text-sm text-muted-foreground">Configuration de base de la plateforme</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Nom de l'organisation</Label>
                  <Input id="orgName" defaultValue="Digital Campus Dakar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Année académique</Label>
                  <Select defaultValue="2025-2026">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2026-2027">2026-2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email de contact</Label>
                <Input id="email" type="email" defaultValue="admissions@digitalcampus.sn" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Bell className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Gérez les alertes et notifications</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouvelle candidature</p>
                  <p className="text-sm text-muted-foreground">Notification par email pour chaque nouvelle candidature</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Décision d'admission</p>
                  <p className="text-sm text-muted-foreground">Notifier le candidat après validation/rejet</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rappels quotidiens</p>
                  <p className="text-sm text-muted-foreground">Résumé quotidien des dossiers en attente</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Lock className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-semibold">Sécurité</h2>
                <p className="text-sm text-muted-foreground">Paramètres de sécurité et accès</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Authentification à deux facteurs</p>
                  <p className="text-sm text-muted-foreground">Exiger la 2FA pour tous les utilisateurs</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Expiration de session</p>
                  <p className="text-sm text-muted-foreground">Déconnexion automatique après inactivité</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Theme */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Thème</h2>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/5 p-3">
                <div className="h-4 w-4 rounded-full bg-primary" />
                <span className="text-sm font-medium">Clair (actif)</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border p-3 opacity-50">
                <div className="h-4 w-4 rounded-full bg-foreground" />
                <span className="text-sm">Sombre</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button className="w-full gap-2">
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </Button>

          {/* Version Info */}
          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            <p>Plateforme Admissions</p>
            <p className="font-medium">Version 1.0.0</p>
            <p className="mt-2">© 2026 Digital Campus Dakar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
