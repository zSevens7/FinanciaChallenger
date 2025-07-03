// src/contexts/HeaderContext.tsx

import React, { createContext, useState, useContext, useCallback, type ReactNode } from 'react'; // Adicionado useCallback

// Define a interface para o estado do cabeçalho
interface HeaderContextType {
  pageTitle: string | null;
  rightHeaderContent: ReactNode | null;
  setPageHeader: (title: string | null, content: ReactNode | null) => void;
}

// Cria o contexto com valores padrão (null para indicar que nada foi definido ainda)
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// Provedor do contexto
export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [rightHeaderContent, setRightHeaderContent] = useState<ReactNode | null>(null);

  // Memoiza a função setPageHeader com useCallback
  // Ela só será recriada se setPageTitle ou setRightHeaderContent mudarem,
  // o que não acontece, tornando-a estável.
  const setPageHeader = useCallback((title: string | null, content: ReactNode | null) => {
    setPageTitle(title);
    setRightHeaderContent(content);
  }, []); // Array de dependências vazio para garantir que a função seja estável

  return (
    <HeaderContext.Provider value={{ pageTitle, rightHeaderContent, setPageHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

// Hook personalizado para usar o contexto do cabeçalho
export const usePageHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('usePageHeader must be used within a HeaderProvider');
  }
  return context;
};
