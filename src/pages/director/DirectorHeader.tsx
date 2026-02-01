import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/data/mockAuth";
import { ISMLogo } from "@/components/ISMLogo";

export const DirectorHeader = ({ onMenuClick, sidebarOpen }: { onMenuClick: () => void; sidebarOpen: boolean }) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const getUserInitials = () => {
    if (!currentUser) return "D";
    return `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/connexion");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-green-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <ISMLogo className="w-10 h-10" />
          <div>
            <h1 className="text-sm font-bold text-gray-900">ISM</h1>
            <p className="text-xs text-green-600 font-semibold">P.D.A.U</p>
          </div>
        </button>

        {/* Center - Title */}
        <h2 className="hidden md:block text-lg font-bold text-gray-900">
          Espace Directeur
        </h2>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-600 text-white text-xs">
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

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onMenuClick}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};
