// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import api from "../services/api";

export interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (username: string, email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<{ token: string }>("/api/auth/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      const userResponse = await api.get<{ user: User }>("/api/auth/profile");
      setUser(userResponse.data.user);

      return true;
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.response?.data?.error || error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await api.post("/api/auth/register", { username: name, email, password });
      return await login(email, password);
    } catch (error: any) {
      console.error("Erro ao registrar usuário:", error.response?.data?.error || error.message);
      return false;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userResponse = await api.get<{ user: User }>("/api/auth/profile");
          setUser(userResponse.data.user);
        } catch (err) {
          console.error("Erro ao carregar usuário:", err);
          logout();
        }
      }
    };
    loadUser();
  }, []);

  const updateProfile = async (username: string, email: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await api.put<{ user: User }>("/api/auth/profile", { username, email });
      setUser(res.data.user);
      return true;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};