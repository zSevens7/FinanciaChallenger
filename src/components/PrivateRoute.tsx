// src/components/PrivateRoute.tsx
import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redireciona para a página de login se não houver usuário logado
    return <Navigate to="/" replace />;
  }

  // Permite o acesso se o usuário estiver logado
  return children;
};

export default PrivateRoute;