import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { StudentLayout } from "@/components/layout/student/StudentLayout";
import { AgentLayout } from "@/components/layout/agent/AgentLayout";
import Dashboard from "./pages/Dashboard";
import Accueil from "./pages/Accueil";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import Candidatures from "./pages/Candidatures";
import Admissions from "./pages/Admissions";
import Ecoles from "./pages/Ecoles";
import Classes from "./pages/Classes";
import Exports from "./pages/Exports";
import Utilisateurs from "./pages/Utilisateurs";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/StudentDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";
import CandidaturesToProcess from "./pages/agent/CandidaturesToProcess";
import ValidatedCandidatures from "./pages/agent/ValidatedCandidatures";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          
          {/* Admin Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute element={<AppLayout />} />}>
            <Route index element={<Dashboard />} />
            <Route path="candidatures" element={<Candidatures />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="ecoles" element={<Ecoles />} />
            <Route path="classes" element={<Classes />} />
            <Route path="exports" element={<Exports />} />
            <Route path="utilisateurs" element={<Utilisateurs />} />
            <Route path="parametres" element={<Parametres />} />
          </Route>

          {/* Student Dashboard */}
          <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentLayout />} />}>
            <Route index element={<StudentDashboard />} />
          </Route>

          {/* Agent Dashboard */}
          <Route path="/agent-dashboard" element={<ProtectedRoute element={<AgentLayout />} />}>
            <Route index element={<AgentDashboard />} />
            <Route path="candidatures" element={<CandidaturesToProcess />} />
            <Route path="validees" element={<ValidatedCandidatures />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
