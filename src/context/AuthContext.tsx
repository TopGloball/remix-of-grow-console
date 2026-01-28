import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe, login, register, AuthError } from "@/api/api";
import type { User, LoginPayload } from "@/types";

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getMe();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      // Silently fail on auth check - user is just not logged in
      if (err instanceof AuthError) {
        setUser(null);
      } else {
        console.error('Auth check error:', err);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const payload: LoginPayload = { email, password };
    const response = await login(payload);
    if (response.success && response.data) {
      setUser(response.data);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const handleRegister = async (email: string, password: string) => {
    const payload: LoginPayload = { email, password };
    const response = await register(payload);
    if (response.success && response.data) {
      setUser(response.data);
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    // Clear cookies by calling logout endpoint if it exists
    // For now, just clear local state
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, login: handleLogin, register: handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
