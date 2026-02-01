import { Application, ApplicationStatus, Notification } from '@/types';
import { mockApplications, mockSchools } from '@/data/mockData';

export type { Application } from '@/types';

export interface DocumentIssue {
  missing: string[];
  nonConforming: string[];
}

export interface DirectorInboxItem {
  id: string;
  applicationId: string;
  schoolId: string;
  directorId?: string;
  agentId?: string;
  createdAt: Date;
  read: boolean;
}

const APPLICATIONS_STORAGE_KEY = 'sah_applications';
const DIRECTOR_INBOX_STORAGE_KEY = 'sah_director_inbox';
const NOTIFICATIONS_STORAGE_KEY = 'sah_notifications';

const requiredDocuments = ['Diplôme', 'Relevé de notes', 'Lettre de motivation'];

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const hydrateApplication = (raw: any): Application => {
  return {
    ...raw,
    dateOfBirth: raw.dateOfBirth ? new Date(raw.dateOfBirth) : raw.dateOfBirth,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : raw.createdAt,
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : raw.updatedAt,
    validatedAt: raw.validatedAt ? new Date(raw.validatedAt) : raw.validatedAt,
    documents: Array.isArray(raw.documents)
      ? raw.documents.map((d: any) => ({
          ...d,
          uploadedAt: d.uploadedAt ? new Date(d.uploadedAt) : d.uploadedAt,
        }))
      : [],
  };
};

const serializeApplications = (apps: Application[]) => {
  return JSON.stringify(apps);
};

const deserializeApplications = (value: string): Application[] => {
  const raw = JSON.parse(value);
  if (!Array.isArray(raw)) return [];
  return raw.map(hydrateApplication);
};

const hydrateDirectorInboxItem = (raw: any): DirectorInboxItem => {
  return {
    ...raw,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : raw.createdAt,
  };
};

const serializeDirectorInbox = (items: DirectorInboxItem[]) => {
  return JSON.stringify(items);
};

const deserializeDirectorInbox = (value: string): DirectorInboxItem[] => {
  const raw = JSON.parse(value);
  if (!Array.isArray(raw)) return [];
  return raw.map(hydrateDirectorInboxItem);
};

export const getStoredApplications = (): Application[] => {
  const existing = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  if (existing) {
    return deserializeApplications(existing);
  }
  const seeded = mockApplications.map(hydrateApplication);
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, serializeApplications(seeded));
  return seeded;
};

export const saveStoredApplications = (apps: Application[]) => {
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, serializeApplications(apps));
};

export const updateApplication = (applicationId: string, patch: Partial<Application>) => {
  const apps = getStoredApplications();
  const next = apps.map((a) =>
    a.id === applicationId
      ? {
          ...a,
          ...patch,
          updatedAt: new Date(),
        }
      : a
  );
  saveStoredApplications(next);
  return next.find((a) => a.id === applicationId) ?? null;
};

export const getDirectorInbox = (): DirectorInboxItem[] => {
  const existing = localStorage.getItem(DIRECTOR_INBOX_STORAGE_KEY);
  if (!existing) return [];
  return deserializeDirectorInbox(existing);
};

export const saveDirectorInbox = (items: DirectorInboxItem[]) => {
  localStorage.setItem(DIRECTOR_INBOX_STORAGE_KEY, serializeDirectorInbox(items));
};

export const pushToDirectorInbox = (item: Omit<DirectorInboxItem, 'id' | 'createdAt' | 'read'>) => {
  const items = getDirectorInbox();
  const next: DirectorInboxItem[] = [
    {
      id: createId(),
      createdAt: new Date(),
      read: false,
      ...item,
    },
    ...items,
  ];
  saveDirectorInbox(next);
  return next[0];
};

export const getApplicationDocumentIssues = (app: Application): DocumentIssue => {
  const documentNames = app.documents.map((d) => d.name.toLowerCase());

  const missing = requiredDocuments.filter((req) => {
    const r = req.toLowerCase();
    return !documentNames.some((n) => n.includes(r));
  });

  const nonConforming = app.documents
    .filter((d) => !d.url || d.type !== 'pdf')
    .map((d) => d.name);

  return { missing, nonConforming };
};

export const markApplicationToValidate = (applicationId: string, agentId?: string) => {
  const apps = getStoredApplications();
  const app = apps.find((a) => a.id === applicationId);
  if (!app) {
    return { ok: false as const, error: 'NOT_FOUND' as const };
  }

  const issues = getApplicationDocumentIssues(app);
  if (issues.missing.length > 0 || issues.nonConforming.length > 0) {
    return { ok: false as const, error: 'DOCUMENT_ISSUES' as const, issues };
  }

  const updated = updateApplication(applicationId, { status: 'to_validate' as ApplicationStatus });

  const school = mockSchools.find((s) => s.id === app.schoolId);
  pushToDirectorInbox({
    applicationId: app.id,
    schoolId: app.schoolId,
    directorId: school?.directorId,
    agentId,
  });

  return { ok: true as const, updated };
};

export const markApplicationIncomplete = (applicationId: string, missingDocument: string, agentId?: string) => {
  const trimmed = missingDocument.trim();
  if (!trimmed) {
    return { ok: false as const, error: 'EMPTY' as const };
  }

  const updated = updateApplication(applicationId, {
    agentMissingDocument: trimmed,
    agentReviewedBy: agentId,
  });

  if (!updated) {
    return { ok: false as const, error: 'NOT_FOUND' as const };
  }

  // Envoyer une notification au candidat concerné
  addNotification({
    userId: updated.id, // On utilise l'id de l'application comme userId candidat (à adapter si tu as un vrai user ID)
    type: 'warning',
    title: 'Document manquant',
    message: `Votre dossier est incomplet. Veuillez fournir : ${trimmed}`,
  });

  return { ok: true as const, updated };
};

export const directorValidateApplication = (applicationId: string, directorId: string) => {
  return updateApplication(applicationId, {
    status: 'validated' as ApplicationStatus,
    validatedBy: directorId,
    validatedAt: new Date(),
    rejectionReason: undefined,
  });
};

export const directorRejectApplication = (applicationId: string, directorId: string, reason: string) => {
  return updateApplication(applicationId, {
    status: 'rejected' as ApplicationStatus,
    validatedBy: directorId,
    validatedAt: new Date(),
    rejectionReason: reason,
  });
};

export const clearDirectorInboxForApplication = (applicationId: string) => {
  const items = getDirectorInbox();
  const next = items.filter((i) => i.applicationId !== applicationId);
  saveDirectorInbox(next);
};

// Notifications helpers
const hydrateNotification = (raw: any): Notification => {
  return {
    ...raw,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : raw.createdAt,
  };
};

const serializeNotifications = (items: Notification[]) => {
  return JSON.stringify(items);
};

const deserializeNotifications = (value: string): Notification[] => {
  const raw = JSON.parse(value);
  if (!Array.isArray(raw)) return [];
  return raw.map(hydrateNotification);
};

export const getStoredNotifications = (): Notification[] => {
  const existing = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (!existing) return [];
  return deserializeNotifications(existing);
};

export const saveStoredNotifications = (items: Notification[]) => {
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, serializeNotifications(items));
};

export const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
  const items = getStoredNotifications();
  const next: Notification[] = [
    {
      id: createId(),
      createdAt: new Date(),
      read: false,
      ...notification,
    },
    ...items,
  ];
  saveStoredNotifications(next);
  return next[0];
};

export const getValidatedApplicationsByClass = (classId: string): Application[] => {
  const applications = getStoredApplications();
  return applications.filter(a => a.classId === classId && a.status === 'validated');
};

export const markNotificationRead = (notificationId: string) => {
  const items = getStoredNotifications();
  const next = items.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveStoredNotifications(next);
};
