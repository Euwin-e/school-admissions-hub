import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  History,
  Settings,
  FileSpreadsheet,
} from "lucide-react";

interface DirectorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectorSidebar = ({ isOpen, onClose }: DirectorSidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/director/dashboard",
      icon: LayoutDashboard,
      title: "Tableau de bord",
    },
    {
      path: "/director/to-validate",
      icon: Clock,
      title: "À valider",
    },
    {
      path: "/director/validated",
      icon: CheckCircle,
      title: "Validées",
    },
    {
      path: "/director/rejected",
      icon: XCircle,
      title: "Rejetées",
    },
    {
      path: "/director/history",
      icon: History,
      title: "Historique",
    },
    {
      path: "/director/exports",
      icon: FileSpreadsheet,
      title: "Exports",
    },
    {
      path: "/director/settings",
      icon: Settings,
      title: "Paramètres",
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 lg:pt-0">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-ochre/10 text-bourbon border-l-4 border-bourbon"
                      : "text-gray-600 hover:bg-ochre/5 hover:text-gray-900"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Système de Gestion des Admissions
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
