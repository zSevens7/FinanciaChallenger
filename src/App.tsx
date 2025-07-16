// src/App.tsx
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HeaderProvider } from "./contexts/HeaderContext";
import React, { useEffect, useState } from 'react'; // Importe React, useEffect e useState

import { AppSidebarContent } from "./components/AppSidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import GastosPage from "./pages/GastosPage";
import Vendas from "./pages/Vendas";

import { SidebarProvider, Sidebar, SidebarTrigger, useSidebar } from "./components/ui/sidebar";
import { Menu } from "lucide-react";
import { Button } from "./components/ui/button";

// Importe o novo componente TitleEffect
import TitleEffect from "./components/ui/tittle"; // Ajuste o caminho conforme necessário

function App() {
  return (
    <BrowserRouter>
      <HeaderProvider>
        <SidebarProvider defaultOpen={true}>
          <LayoutWithSidebar>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/gastos" element={<GastosPage />} />
              <Route path="/vendas" element={<Vendas />} />
            </Routes>
          </LayoutWithSidebar>
        </SidebarProvider>
      </HeaderProvider>
    </BrowserRouter>
  );
}

export default App;

function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { open, isMobile } = useSidebar(); // Removido 'toggleSidebar' e 'state' pois não são usados aqui
  const location = useLocation(); // Hook para obter informações sobre a URL atual
  const [pageTitle, setPageTitle] = useState("Minha Aplicação"); // Estado para o título base da página
  const [pageIcon, setPageIcon] = useState(""); // Estado para o ícone da página

  // useEffect para atualizar o título e ícone com base na rota
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setPageTitle("Dashboard");
        setPageIcon("📊"); // Exemplo de ícone para Dashboard
        break;
      case '/gastos':
        setPageTitle("Gastos");
        setPageIcon("💸"); // Exemplo de ícone para Gastos
        break;
      case '/vendas':
        setPageTitle("Vendas");
        setPageIcon("📈"); // Exemplo de ícone para Vendas
        break;
      default:
        setPageTitle("Minha Aplicação"); // Título padrão para rotas não mapeadas
        setPageIcon(""); // Sem ícone para rotas não mapeadas
    }
  }, [location.pathname]); // Re-executa sempre que a rota mudar

  return (
    <div className="flex h-screen">
      {/* Componente TitleEffect para gerenciar o título da aba */}
      <TitleEffect baseTitle={pageTitle} icon={pageIcon} />

      <Sidebar collapsible="offcanvas" side="left">
        <AppSidebarContent />
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        {/* Botão para togglar a sidebar (visível no desktop sempre, e no mobile quando fechada) */}
        {/* Desktop: sempre mostra o trigger, para abrir/fechar */}
        {!isMobile && (
            <div className="absolute top-4 left-4 z-50">
                <SidebarTrigger />
            </div>
        )}
        {/* Mobile: mostra o trigger apenas quando a sidebar está fechada */}
        {isMobile && !open && (
            <div className="absolute top-4 left-4 z-50">
                <SidebarTrigger />
            </div>
        )}

        <Header />

        {children}
      </main>
    </div>
  );
}
