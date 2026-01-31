import { Navigate } from "react-router-dom";
import { authService } from "@/data/mockAuth";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }
  
  return element;
};
