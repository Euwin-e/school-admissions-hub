import { useNavigate } from 'react-router-dom';
import { authService } from '@/data/mockAuth';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ISMLogo } from '@/components/ISMLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function StudentHeader() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/connexion");
  };

  const getUserInitials = () => {
    if (!currentUser) return "XX";
    return `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
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
          Espace Candidat
        </h2>

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
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Étudiant"}
                </span>
                <span className="text-xs text-gray-600">Mon Profil</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mes informations</DropdownMenuItem>
            <DropdownMenuItem>Modifier profil</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
