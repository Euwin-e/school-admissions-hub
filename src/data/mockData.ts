import { User, School, Class, Application, DashboardStats } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Mamadou',
    lastName: 'Diallo',
    email: 'admin@digitalcampus.sn',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    firstName: 'Fatou',
    lastName: 'Sow',
    email: 'fatou.sow@digitalcampus.sn',
    role: 'director',
    schoolId: '1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    firstName: 'Ibrahima',
    lastName: 'Fall',
    email: 'ibrahima.fall@digitalcampus.sn',
    role: 'director',
    schoolId: '2',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    firstName: 'Aminata',
    lastName: 'Ndiaye',
    email: 'aminata.ndiaye@digitalcampus.sn',
    role: 'agent',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '5',
    firstName: 'Ousmane',
    lastName: 'Ba',
    email: 'ousmane.ba@digitalcampus.sn',
    role: 'agent',
    createdAt: new Date('2024-02-15'),
  },
];

// Mock Schools
export const mockSchools: School[] = [
  {
    id: '1',
    name: 'Institut Supérieur de Management',
    code: 'ISM',
    directorId: '2',
    description: 'École de commerce et de management',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'École Supérieure Polytechnique',
    code: 'ESP',
    directorId: '3',
    description: 'École d\'ingénieurs',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Institut des Sciences Juridiques',
    code: 'ISJ',
    description: 'Formation en droit et sciences juridiques',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'École des Arts et Métiers',
    code: 'EAM',
    description: 'Formation en arts appliqués et design',
    createdAt: new Date('2024-01-01'),
  },
];

// Mock Classes
export const mockClasses: Class[] = [
  // ISM Classes
  { id: '1', name: 'Master 1 Marketing', code: 'M1-MKT', schoolId: '1', capacity: 30, currentCount: 25, createdAt: new Date('2024-01-01') },
  { id: '2', name: 'Master 1 Finance', code: 'M1-FIN', schoolId: '1', capacity: 30, currentCount: 28, createdAt: new Date('2024-01-01') },
  { id: '3', name: 'Master 2 Management', code: 'M2-MGT', schoolId: '1', capacity: 25, currentCount: 20, createdAt: new Date('2024-01-01') },
  { id: '4', name: 'MBA 1', code: 'MBA1', schoolId: '1', capacity: 20, currentCount: 18, createdAt: new Date('2024-01-01') },
  // ESP Classes
  { id: '5', name: 'Ingénieur 1 Informatique', code: 'ING1-INFO', schoolId: '2', capacity: 40, currentCount: 35, createdAt: new Date('2024-01-01') },
  { id: '6', name: 'Ingénieur 2 Génie Civil', code: 'ING2-GC', schoolId: '2', capacity: 35, currentCount: 30, createdAt: new Date('2024-01-01') },
  { id: '7', name: 'Ingénieur 3 Électronique', code: 'ING3-ELEC', schoolId: '2', capacity: 30, currentCount: 25, createdAt: new Date('2024-01-01') },
  // ISJ Classes
  { id: '8', name: 'Licence 3 Droit Privé', code: 'L3-DP', schoolId: '3', capacity: 50, currentCount: 45, createdAt: new Date('2024-01-01') },
  { id: '9', name: 'Master 1 Droit des Affaires', code: 'M1-DA', schoolId: '3', capacity: 30, currentCount: 25, createdAt: new Date('2024-01-01') },
  // EAM Classes
  { id: '10', name: 'Design Graphique 1', code: 'DG1', schoolId: '4', capacity: 25, currentCount: 20, createdAt: new Date('2024-01-01') },
  { id: '11', name: 'Architecture Intérieure 2', code: 'AI2', schoolId: '4', capacity: 20, currentCount: 15, createdAt: new Date('2024-01-01') },
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: '1',
    matricule: 'ADM-2026-0001',
    firstName: 'Moussa',
    lastName: 'Diop',
    gender: 'male',
    dateOfBirth: new Date('2000-03-15'),
    email: 'moussa.diop@email.com',
    phone: '+221 77 123 45 67',
    address: 'Dakar, Plateau',
    schoolId: '1',
    classId: '1',
    status: 'to_validate',
    documents: [
      { id: '1', name: 'Diplôme Baccalauréat', type: 'pdf', url: '/docs/bac.pdf', uploadedAt: new Date() },
      { id: '2', name: 'Relevé de notes', type: 'pdf', url: '/docs/notes.pdf', uploadedAt: new Date() },
    ],
    createdAt: new Date('2026-01-28'),
    updatedAt: new Date('2026-01-28'),
  },
  {
    id: '2',
    matricule: 'ADM-2026-0002',
    firstName: 'Aissatou',
    lastName: 'Bah',
    gender: 'female',
    dateOfBirth: new Date('1999-07-22'),
    email: 'aissatou.bah@email.com',
    phone: '+221 76 234 56 78',
    address: 'Dakar, Almadies',
    schoolId: '1',
    classId: '2',
    status: 'validated',
    documents: [
      { id: '3', name: 'Diplôme Licence', type: 'pdf', url: '/docs/licence.pdf', uploadedAt: new Date() },
    ],
    createdAt: new Date('2026-01-25'),
    updatedAt: new Date('2026-01-27'),
    validatedBy: '2',
    validatedAt: new Date('2026-01-27'),
  },
  {
    id: '3',
    matricule: 'ADM-2026-0003',
    firstName: 'Cheikh',
    lastName: 'Mbaye',
    gender: 'male',
    dateOfBirth: new Date('2001-11-08'),
    email: 'cheikh.mbaye@email.com',
    phone: '+221 78 345 67 89',
    address: 'Thiès, Centre',
    schoolId: '2',
    classId: '5',
    status: 'to_validate',
    documents: [
      { id: '4', name: 'Diplôme Baccalauréat', type: 'pdf', url: '/docs/bac2.pdf', uploadedAt: new Date() },
      { id: '5', name: 'Relevé de notes', type: 'pdf', url: '/docs/notes2.pdf', uploadedAt: new Date() },
    ],
    createdAt: new Date('2026-01-29'),
    updatedAt: new Date('2026-01-29'),
  },
  {
    id: '4',
    matricule: 'ADM-2026-0004',
    firstName: 'Mariama',
    lastName: 'Sarr',
    gender: 'female',
    dateOfBirth: new Date('2000-05-30'),
    email: 'mariama.sarr@email.com',
    phone: '+221 77 456 78 90',
    address: 'Saint-Louis',
    schoolId: '2',
    classId: '6',
    status: 'rejected',
    documents: [],
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-24'),
    validatedBy: '3',
    validatedAt: new Date('2026-01-24'),
    rejectionReason: 'Dossier incomplet - pièces justificatives manquantes',
  },
  {
    id: '5',
    matricule: 'ADM-2026-0005',
    firstName: 'Abdoulaye',
    lastName: 'Niang',
    gender: 'male',
    dateOfBirth: new Date('1998-09-12'),
    email: 'abdoulaye.niang@email.com',
    phone: '+221 76 567 89 01',
    address: 'Dakar, Fann',
    schoolId: '1',
    classId: '4',
    status: 'validated',
    documents: [],
    createdAt: new Date('2026-01-22'),
    updatedAt: new Date('2026-01-26'),
    validatedBy: '2',
    validatedAt: new Date('2026-01-26'),
  },
  {
    id: '6',
    matricule: 'ADM-2026-0006',
    firstName: 'Khadija',
    lastName: 'Thiam',
    gender: 'female',
    dateOfBirth: new Date('2001-02-18'),
    email: 'khadija.thiam@email.com',
    phone: '+221 78 678 90 12',
    address: 'Dakar, Parcelles',
    schoolId: '3',
    classId: '8',
    status: 'pending',
    documents: [],
    createdAt: new Date('2026-01-30'),
    updatedAt: new Date('2026-01-30'),
  },
  {
    id: '7',
    matricule: 'ADM-2026-0007',
    firstName: 'Modou',
    lastName: 'Gueye',
    gender: 'male',
    dateOfBirth: new Date('1999-12-05'),
    email: 'modou.gueye@email.com',
    phone: '+221 77 789 01 23',
    address: 'Rufisque',
    schoolId: '4',
    classId: '10',
    status: 'validated',
    documents: [],
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-21'),
    validatedBy: '2',
    validatedAt: new Date('2026-01-21'),
  },
  {
    id: '8',
    matricule: 'ADM-2026-0008',
    firstName: 'Ndèye',
    lastName: 'Diaw',
    gender: 'female',
    dateOfBirth: new Date('2000-08-25'),
    email: 'ndeye.diaw@email.com',
    phone: '+221 76 890 12 34',
    address: 'Dakar, Médina',
    schoolId: '2',
    classId: '7',
    status: 'pending',
    documents: [],
    createdAt: new Date('2026-01-31'),
    updatedAt: new Date('2026-01-31'),
  },
  {
    id: '9',
    matricule: 'ADM-2026-0009',
    firstName: 'Samba',
    lastName: 'Faye',
    gender: 'male',
    dateOfBirth: new Date('2001-04-10'),
    email: 'samba.faye@email.com',
    phone: '+221 78 901 23 45',
    address: 'Kaolack',
    schoolId: '3',
    classId: '9',
    status: 'validated',
    documents: [],
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-19'),
    validatedBy: '2',
    validatedAt: new Date('2026-01-19'),
  },
  {
    id: '10',
    matricule: 'ADM-2026-0010',
    firstName: 'Rama',
    lastName: 'Sy',
    gender: 'female',
    dateOfBirth: new Date('1999-06-28'),
    email: 'rama.sy@email.com',
    phone: '+221 77 012 34 56',
    address: 'Dakar, Sicap',
    schoolId: '1',
    classId: '3',
    status: 'pending',
    documents: [],
    createdAt: new Date('2026-01-31'),
    updatedAt: new Date('2026-01-31'),
  },
];

// Dashboard Stats
export const getDashboardStats = (): DashboardStats => {
  const totalApplications = mockApplications.length;
  const pendingApplications = mockApplications.filter(a => a.status === 'pending' || a.status === 'to_validate').length;
  const validatedApplications = mockApplications.filter(a => a.status === 'validated').length;
  const rejectedApplications = mockApplications.filter(a => a.status === 'rejected').length;
  
  return {
    totalApplications,
    pendingApplications,
    validatedApplications,
    rejectedApplications,
    totalSchools: mockSchools.length,
    totalClasses: mockClasses.length,
    recentApplications: mockApplications.slice(0, 5),
  };
};

// Helper functions
export const getSchoolById = (id: string): School | undefined => 
  mockSchools.find(s => s.id === id);

export const getClassById = (id: string): Class | undefined => 
  mockClasses.find(c => c.id === id);

export const getClassesBySchool = (schoolId: string): Class[] => 
  mockClasses.filter(c => c.schoolId === schoolId);

export const getApplicationsBySchool = (schoolId: string): Application[] => 
  mockApplications.filter(a => a.schoolId === schoolId);

export const getApplicationsByClass = (classId: string): Application[] => 
  mockApplications.filter(a => a.classId === classId);

export const getValidatedApplicationsByClass = (classId: string): Application[] => 
  mockApplications.filter(a => a.classId === classId && a.status === 'validated');
