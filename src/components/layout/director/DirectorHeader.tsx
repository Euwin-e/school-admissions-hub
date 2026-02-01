import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, LogOut, User, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/data/mockAuth";
import { ISMLogo } from "@/components/ISMLogo";
import { exportService } from "@/services/exportService";
import { useToast } from "@/hooks/use-toast";

export const DirectorHeader = ({ onMenuClick, sidebarOpen }: { onMenuClick: () => void; sidebarOpen: boolean }) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const { toast } = useToast();

  const getUserInitials = () => {
    if (!currentUser) return "D";
    return `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/connexion");
  };

  const handleExportAllApplications = () => {
    try {
      if (currentUser?.schoolId) {
        exportService.generateExcelForSchool(currentUser.schoolId);
        const school = currentUser.schoolId === '1' ? 'ISM' : 'École Secondaire';
        toast({
          title: "Export réussi",
          description: `Toutes les candidatures de ${school} ont été exportées avec succès.`,
        });
      } else {
        exportService.generateExcelForAllSchools();
        toast({
          title: "Export réussi",
          description: "Toutes les candidatures ont été exportées avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le fichier Excel",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-bourbon shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <ISMLogo className="w-10 h-10" />
          <div>
            <h1 className="text-sm font-bold text-gray-900">ISM</h1>
            <p className="text-xs text-bourbon font-semibold">P.D.A.U</p>
          </div>
        </button>

        {/* Center - Title */}
        <h2 className="hidden md:block text-lg font-bold text-gray-900">
          Espace Directeur
        </h2>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <Button
            onClick={handleExportAllApplications}
            className="bg-ochre hover:bg-rope hidden md:flex"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter tout
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-bourbon text-[10px] font-medium text-white">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium">Nouvelle candidature à valider</span>
                <span className="text-xs text-muted-foreground">Moussa Diop a soumis une candidature</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium">Candidature validée</span>
                <span className="text-xs text-muted-foreground">Aissatou Bah a été acceptée</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="font-medium">Rappel</span>
                <span className="text-xs text-muted-foreground">5 candidatures en attente</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-bourbon text-white text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-sm font-medium">
                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Directeur"}
                  </span>
                  <span className="text-xs text-gray-500">Directeur</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Mon profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
