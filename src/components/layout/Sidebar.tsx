import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Building2, 
  GraduationCap, 
  FileSpreadsheet, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/dashboard/candidatures', icon: FileText, label: 'Candidatures' },
  { path: '/dashboard/admissions', icon: CheckCircle, label: 'Admissions' },
  { path: '/dashboard/ecoles', icon: Building2, label: 'Écoles' },
  { path: '/dashboard/classes', icon: GraduationCap, label: 'Classes' },
  { path: '/dashboard/exports', icon: FileSpreadsheet, label: 'Exports Excel' },
  { path: '/dashboard/utilisateurs', icon: Users, label: 'Utilisateurs' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "relative flex flex-col bg-sidebar transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          !isOpen && "justify-center"
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">Digital Campus</span>
              <span className="text-xs text-sidebar-foreground/60">Admissions</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = item.path === '/dashboard' 
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                !isOpen && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="border-t border-sidebar-border p-3">
        <NavLink
          to="/dashboard/parametres"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            !isOpen && "justify-center px-2"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span>Paramètres</span>}
        </NavLink>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </aside>
  );
}
