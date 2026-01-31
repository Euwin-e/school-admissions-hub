# Comptes de Test et Dashboards

## Comptes de Test Disponibles

Tous les comptes utilisent le mot de passe : **`password123`**

### 1. **Étudiant** (Student Dashboard)
- **Email** : `etudiant@example.com`
- **Mot de passe** : `password123`
- **Rôle** : `student`
- **Redirection** : `/student-dashboard`
- **Fonctionnalités** :
  - Voir le statut de sa candidature
  - Consulter les documents téléchargés
  - Suivre la progression de l'examen
  - Télécharger les documents manquants

### 2. **Agent d'Admission** (Agent Dashboard)
- **Email** : `agent@example.com`
- **Mot de passe** : `password123`
- **Rôle** : `agent`
- **Redirection** : `/agent-dashboard`
- **Fonctionnalités** :
  - Tableau de bord avec statistiques
  - Examen des candidatures en attente
  - Validation/rejet des candidatures
  - Consultation des candidatures validées
  - Suivi des inscriptions

### 3. **Directeur** (Admin Dashboard)
- **Email** : `directeur@example.com`
- **Mot de passe** : `password123`
- **Rôle** : `director`
- **Redirection** : `/dashboard` (Admin)
- **Fonctionnalités** :
  - Gestion complète du système
  - Configuration des écoles
  - Gestion des classes
  - Gestion des utilisateurs
  - Exports et rapports

### 4. **Administrateur** (Admin Dashboard)
- **Email** : `admin@example.com`
- **Mot de passe** : `password123`
- **Rôle** : `admin`
- **Redirection** : `/dashboard` (Admin)
- **Fonctionnalités** :
  - Accès complet à tous les paramètres
  - Gestion des rôles et permissions
  - Configuration système

## Structure des Dossiers

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx              # Layout Admin (existant)
│   │   ├── Header.tsx                 # Header Admin (existant)
│   │   ├── Sidebar.tsx                # Sidebar Admin (existant)
│   │   ├── student/
│   │   │   ├── StudentLayout.tsx      # Layout Étudiant
│   │   │   └── StudentHeader.tsx      # Header Étudiant
│   │   └── agent/
│   │       ├── AgentLayout.tsx        # Layout Agent
│   │       ├── AgentHeader.tsx        # Header Agent
│   │       └── AgentSidebar.tsx       # Sidebar Agent
│   ├── ISMLogo.tsx                    # Logo ISM
│   ├── ProtectedRoute.tsx             # Protection des routes
│   └── ... (autres composants UI)
│
├── pages/
│   ├── Dashboard.tsx                  # Dashboard Admin
│   ├── Accueil.tsx                    # Page d'accueil (public)
│   ├── Inscription.tsx                # Formulaire inscription (public)
│   ├── Connexion.tsx                  # Page de connexion (public)
│   ├── Candidatures.tsx               # Gestion candidatures (Admin)
│   ├── ... (autres pages Admin)
│   ├── student/
│   │   └── StudentDashboard.tsx       # Dashboard Étudiant
│   └── agent/
│       ├── AgentDashboard.tsx         # Dashboard Agent
│       ├── CandidaturesToProcess.tsx  # Candidatures à traiter
│       └── ValidatedCandidatures.tsx  # Candidatures validées
│
└── data/
    └── mockAuth.ts                    # Service d'authentification
```

## Routes Disponibles

### Routes Publiques (Pas d'authentification requise)
- `GET /` - Page d'accueil
- `GET /inscription` - Page d'inscription
- `GET /connexion` - Page de connexion

### Routes Protégées (Authentification requise)

#### Dashboard Étudiant
- `GET /student-dashboard` - Dashboard principal étudiant

#### Dashboard Agent
- `GET /agent-dashboard` - Dashboard principal agent
- `GET /agent-dashboard/candidatures` - Candidatures à traiter
- `GET /agent-dashboard/validees` - Candidatures validées

#### Dashboard Admin
- `GET /dashboard` - Dashboard principal admin
- `GET /dashboard/candidatures` - Gestion des candidatures
- `GET /dashboard/admissions` - Gestion des admissions
- `GET /dashboard/ecoles` - Gestion des écoles
- `GET /dashboard/classes` - Gestion des classes
- `GET /dashboard/exports` - Exports et rapports
- `GET /dashboard/utilisateurs` - Gestion des utilisateurs
- `GET /dashboard/parametres` - Paramètres système

## Fonctionnement de l'Authentification

### Flux de Connexion
1. L'utilisateur accède à `/connexion`
2. Il entre ses identifiants (email et mot de passe)
3. Le service `authService.login()` valide les identifiants
4. Si valide :
   - L'utilisateur est stocké dans `localStorage` avec `currentUser`
   - Une redirection est effectuée selon le rôle :
     - `student` → `/student-dashboard`
     - `agent` → `/agent-dashboard`
     - `admin` ou `director` → `/dashboard`
5. Si invalide, un message d'erreur s'affiche

### Protection des Routes
- Le composant `ProtectedRoute` vérifie si l'utilisateur est authentifié
- S'il n'est pas authentifié, il est redirigé vers `/connexion`
- Les données de l'utilisateur sont accessibles via `authService.getCurrentUser()`

### Déconnexion
- Clic sur "Déconnexion" dans le header
- Appel à `authService.logout()`
- Suppression des données de `localStorage`
- Redirection vers `/connexion`

## Charte Graphique Commune

### Couleurs
- **Primaire** : Amber/Orange (#d97706, #f59e0b)
- **Accent border** : Border amber-500
- **Footer** : bg-gray-900
- **Header border** : border-b-4 border-amber-500

### Logo
- **Logo ISM** : Utilisé dans tous les headers
- **Fond** : Marron (#3d2817)
- **Bordure** : Orange
- **Représentation** : Grille de bâtiment

### Composants Réutilisables
- Buttons (Tailwind CSS + shadcn/ui)
- Cards avec headers gradients
- Badges pour les statuts
- Dropdowns pour les menus utilisateur
- Modals et dialogs

## Prochaines Étapes

- [ ] Créer un dashboard pour les directeurs (si différent de l'admin)
- [ ] Ajouter les pages spécifiques pour le dashboard étudiant
- [ ] Implémenter les fonctionnalités de validation/rejet pour les agents
- [ ] Créer les API/services backend
- [ ] Ajouter la persistance des données en base de données
- [ ] Implémenter les notifications en temps réel
- [ ] Ajouter les exports et rapports
