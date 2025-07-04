// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HeaderProvider } from "./contexts/HeaderContext";

import { AppSidebarContent } from "./components/AppSidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import GastosPage from "./pages/GastosPage";
import Vendas from "./pages/Vendas";

import { SidebarProvider, Sidebar, SidebarTrigger, useSidebar } from "./components/ui/sidebar";
import { Menu } from "lucide-react"; // Não precisamos mais do X aqui
import { Button } from "./components/ui/button";

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
  const { open, toggleSidebar, isMobile, state } = useSidebar();

  return (
    <div className="flex h-screen">
      <Sidebar collapsible="offcanvas" side="left">
        <AppSidebarContent />

        {/* REMOVIDO: O botão de fechar para mobile foi movido para AppSidebarContent.tsx
           e depois para dentro do SheetHeader no components/ui/sidebar.tsx
        */}
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