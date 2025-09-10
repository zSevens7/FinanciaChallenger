// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import api from "../services/api"; // Axios configurado com baseURL e interceptor

// Tipos do usuário
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Login via email
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<{ token: string }>("/auth/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Buscar os dados do usuário logado
      const userResponse = await api.get<{ user: User }>("/auth/profile");
      setUser(userResponse.data.user);

      return true;
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.response?.data?.error || error.message);
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Registro
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Aqui enviamos `username` para o backend
      const res = await api.post<{ token: string, user: User }>("/auth/register", {
        username: name,
        email,
        password
      });

      // Salvar token e usuário no frontend
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      return true;
    } catch (error: any) {
      console.error("Erro ao registrar usuário:", error.response?.data?.error || error.message);
      return false;
    }
  };

  // Manter usuário logado após reload
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userResponse = await api.get<{ user: User }>("/auth/profile");
          setUser(userResponse.data.user);
        } catch (err) {
          console.error("Erro ao carregar usuário:", err);
          logout();
        }
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
