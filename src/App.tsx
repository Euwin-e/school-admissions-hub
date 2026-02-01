import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { AppLayout } from "@/components/layout/AppLayout";
import { StudentLayout } from "@/components/layout/student/StudentLayout";
import { AgentLayout } from "@/components/layout/agent/AgentLayout";
import { DirectorLayout } from "@/components/layout/director/DirectorLayout";
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
import DirectorDashboard from "./pages/director/DirectorDashboard";
import ApplicationReview from "./pages/director/ApplicationReview";
import ToValidateList from "./pages/director/ToValidateList";
import ValidatedList from "./pages/director/ValidatedList";
import RejectedList from "./pages/director/RejectedList";
import History from "./pages/director/History";
import DirectorSettings from '@/pages/director/Settings';
import DirectorExports from '@/pages/director/Exports';

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
          <Route path="/dashboard" element={<RoleProtectedRoute element={<AppLayout />} allowedRoles={["admin"]} />}>
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
          <Route path="/student-dashboard" element={<RoleProtectedRoute element={<StudentLayout />} allowedRoles={["student"]} />}>
            <Route index element={<StudentDashboard />} />
          </Route>

          {/* Agent Dashboard */}
          <Route path="/agent-dashboard" element={<RoleProtectedRoute element={<AgentLayout />} allowedRoles={["agent"]} />}>
            <Route index element={<AgentDashboard />} />
            <Route path="candidatures" element={<CandidaturesToProcess />} />
            <Route path="validees" element={<ValidatedCandidatures />} />
          </Route>

          {/* Director Dashboard */}
          <Route path="/director" element={<RoleProtectedRoute element={<DirectorLayout />} allowedRoles={["director"]} />}>
            <Route index element={<DirectorDashboard />} />
            <Route path="dashboard" element={<DirectorDashboard />} />
            <Route path="application/:id" element={<ApplicationReview />} />
            <Route path="to-validate" element={<ToValidateList />} />
            <Route path="validated" element={<ValidatedList />} />
            <Route path="rejected" element={<RejectedList />} />
            <Route path="history" element={<History />} />
            <Route path="exports" element={<DirectorExports />} />
            <Route path="settings" element={<DirectorSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
