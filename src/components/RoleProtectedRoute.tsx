import { Navigate } from "react-router-dom";
import { authService } from "@/data/mockAuth";

interface RoleProtectedRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({ element, allowedRoles }: RoleProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }
  
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    // Rediriger vers le dashboard approprié selon le rôle
    if (currentUser.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    } else if (currentUser.role === "director") {
      return <Navigate to="/director" replace />;
    } else if (currentUser.role === "agent") {
      return <Navigate to="/agent-dashboard" replace />;
    } else if (currentUser.role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return element;
};
