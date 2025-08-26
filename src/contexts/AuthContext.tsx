import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Definir o tipo dos dados do usuário e do contexto
interface User {
  id: string;
  name: string;
  email: string;
}

// Criamos uma nova interface que inclui a senha, para ser usada apenas na lógica de autenticação.
interface UserWithPassword extends User {
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
   register: (newUser: Omit<UserWithPassword, 'id'>) => Promise<boolean>;
}

// 2. Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Criar o provedor do contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Lógica de login e registro simulada com localStorage
  // Futuramente, esta lógica será substituída por chamadas a uma API
  const login = async (email: string, password: string): Promise<boolean> => {
    // Agora o "banco de dados" de usuários usa a interface com a senha
    const users: UserWithPassword[] = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      // Mas o estado do usuário continua sem a senha, por segurança
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      // Salva o usuário logado para manter a sessão
      localStorage.setItem('currentUser', JSON.stringify({ id: foundUser.id, email: foundUser.email }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (newUser: Omit<UserWithPassword, 'id'>): Promise<boolean> => {
    const users: UserWithPassword[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u) => u.email === newUser.email);
    
    if (userExists) {
      return false; // Usuário já existe
    }

    const newUserData = { ...newUser, id: `user-${Date.now()}` }; // Gera um ID simples
    users.push(newUserData as UserWithPassword);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  // Efeito para carregar o usuário da sessão (localStorage) ao iniciar a app
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const { id, email } = JSON.parse(storedUser);
      const users: UserWithPassword[] = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u) => u.email === email);
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
      }
    }
  }, []);

  const value = { user, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Hook personalizado para usar o contexto facilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};