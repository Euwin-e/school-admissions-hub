// Mock users for testing authentication
export const mockUsers = [
  {
    id: "user-1",
    email: "etudiant@example.com",
    password: "password123",
    firstName: "Jean",
    lastName: "Dupont",
    role: "student",
  },
  {
    id: "4",
    email: "agent@example.com",
    password: "password123",
    firstName: "Marie",
    lastName: "Martin",
    role: "agent",
  },
  {
    id: "2",
    email: "directeur@example.com",
    password: "password123",
    firstName: "Pierre",
    lastName: "Bernard",
    role: "director",
    schoolId: "1",
  },
  {
    id: "1",
    email: "admin@example.com",
    password: "password123",
    firstName: "Admin",
    lastName: "System",
    role: "admin",
  },
];

// Authentication service
export const authService = {
  login: (email: string, password: string) => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (user) {
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        schoolId: user.schoolId,
      };
      
      // Store user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    
    return null;
  },

  logout: () => {
    localStorage.removeItem("currentUser");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("currentUser");
  },
};
