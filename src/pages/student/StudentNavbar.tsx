import { FileText, PlusCircle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentNavbarProps {
  activeTab: 'list' | 'new';
  setActiveTab: (tab: 'list' | 'new') => void;
}

export function StudentNavbar({ activeTab, setActiveTab }: StudentNavbarProps) {
  return (
    <nav className="flex gap-4 mb-8 border-b border-bourbon/20 pb-4">
      <Button 
        variant={activeTab === 'list' ? 'default' : 'ghost'}
        onClick={() => setActiveTab('list')}
        className={activeTab === 'list' ? 'bg-bourbon' : 'text-gray-600'}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Mes Candidatures & Suivi
      </Button>
      <Button 
        variant={activeTab === 'new' ? 'default' : 'ghost'}
        onClick={() => setActiveTab('new')}
        className={activeTab === 'new' ? 'bg-bourbon' : 'text-gray-600'}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Nouvelle Candidature
      </Button>
    </nav>
  );
}