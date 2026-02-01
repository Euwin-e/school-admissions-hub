import { useState } from "react";
import { Bell } from "lucide-react";
import { StudentNavbar } from "./StudentNavbar";
import { NewApplicationForm } from "./NewApplicationForm";
import ApplicationStatusView from "./ApplicationStatusView";
import { authService } from "@/data/mockAuth";
import { useApplications } from "./useApplications";
import { getStoredNotifications, markNotificationRead, type Notification } from "@/data/applicationsRepository";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const StudentDashboard = () => {
  const currentUser = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const { applications, addApplication } = useApplications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = getStoredNotifications().filter((n) => n.userId === currentUser?.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNewApplication = (applicationData: any) => {
    addApplication(applicationData);
    // Basculer automatiquement vers la liste des candidatures après soumission
    setActiveTab('list');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {currentUser?.firstName}!</h1>
          <p className="text-gray-600">Gérez vos candidatures et suivez vos dossiers en cours.</p>
        </div>
        <Button
          variant="outline"
          className="relative"
          onClick={() => setShowNotifications(true)}
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Navigation entre les options */}
      <StudentNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenu dynamique */}
      {activeTab === 'list' ? (
        <ApplicationStatusView applications={applications} />
      ) : (
        <NewApplicationForm onSubmitted={handleNewApplication} />
      )}

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Aucune notification non lue'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-lg border p-3 ${!notif.read ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{notif.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{notif.message}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {notif.createdAt.toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    {!notif.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-3"
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">Aucune notification.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;