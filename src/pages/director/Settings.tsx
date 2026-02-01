import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Globe,
  Save,
} from "lucide-react";
import { authService } from "@/data/mockAuth";
import { getSchoolById } from "@/data/mockData";

export default function Settings() {
  const currentUser = authService.getCurrentUser();
  const school = currentUser?.schoolId ? getSchoolById(currentUser.schoolId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">
          Gérez votre profil et les paramètres de votre compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profil */}
        <div className="lg:col-span-2 space-y-6">
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
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={currentUser?.firstName || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={currentUser?.lastName || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    value={currentUser?.email || ""}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    value={currentUser?.phone || "Non renseigné"}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Entrez un nouveau mot de passe"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez le nouveau mot de passe"
                />
              </div>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Mettre à jour le mot de passe
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouvelles candidatures à valider</p>
                    <p className="text-sm text-gray-500">
                      Recevoir une notification quand une candidature est prête pour validation
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rapports hebdomadaires</p>
                    <p className="text-sm text-gray-500">
                      Recevoir un résumé hebdomadaire des candidatures traitées
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertes système</p>
                    <p className="text-sm text-gray-500">
                      Notifications importantes concernant le système
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les préférences
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rôle et permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Rôle</Label>
                <Badge className="mt-1 bg-green-600">Directeur</Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">École assignée</Label>
                <p className="font-medium mt-1">{school?.name || "Non assignée"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">ID Utilisateur</Label>
                <p className="font-mono text-sm mt-1">{currentUser?.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Préférences système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Langue</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Français</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Fuseau horaire</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>UTC+00:00 (GMT)</option>
                  <option>UTC+01:00 (CET)</option>
                </select>
              </div>
              <Button className="w-full" variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Appliquer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Exporter mes données
              </Button>
              <Button className="w-full" variant="outline">
                Télécharger l'historique
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
