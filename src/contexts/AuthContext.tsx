import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "patient" | "front-desk" | "doctor";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, firstName: string, role: UserRole) => void;
  logout: () => void;
}

export type { UserRole };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem("neuroassist_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string, firstName: string, role: UserRole = "patient") => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      firstName,
      role,
    };
    setUser(newUser);
    localStorage.setItem("neuroassist_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("neuroassist_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
