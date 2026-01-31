// Types for the School Admissions Platform

export type UserRole = 'admin' | 'director' | 'agent' | 'supervisor';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  avatar?: string;
  createdAt: Date;
}

export interface School {
  id: string;
  name: string;
  code: string;
  directorId?: string;
  description?: string;
  createdAt: Date;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  schoolId: string;
  capacity: number;
  currentCount: number;
  createdAt: Date;
}

export type ApplicationStatus = 'pending' | 'validated' | 'rejected';

export type Gender = 'male' | 'female';

export interface Application {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date;
  email: string;
  phone: string;
  address: string;
  schoolId: string;
  classId: string;
  status: ApplicationStatus;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
  rejectionReason?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface AdmissionDecision {
  id: string;
  applicationId: string;
  decision: 'validated' | 'rejected';
  reason?: string;
  decidedBy: string;
  decidedAt: Date;
}

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  validatedApplications: number;
  rejectedApplications: number;
  totalSchools: number;
  totalClasses: number;
  recentApplications: Application[];
}

export interface ExportFilter {
  schoolId?: string;
  classId?: string;
  status?: ApplicationStatus;
}
