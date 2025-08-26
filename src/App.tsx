// src/App.tsx
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HeaderProvider } from "./contexts/HeaderContext";
import React from "react";

import { useState } from "react"; // ✅ precisa importar

import { AppSidebarContent } from "./components/AppSidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import GastosPage from "./pages/GastosPage";
import Vendas from "./pages/Vendas";
import Login from "./pages/Login"; // ✅ importar a página de login
import RegisterPage from './pages/RegisterPage'; // A nova página de registro
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // A nova página de recuperação de senha
import ProfilePage from './pages/ProfilePage'; // A nova página de perfil

import { SidebarProvider, Sidebar, SidebarTrigger, useSidebar } from "./components/ui/sidebar";
import TitleEffect from "./components/ui/tittle";


function App() {
  return (
    <BrowserRouter> {/* Use Router em vez de BrowserRouter se já importou como Router */}
      <HeaderProvider>
        <SidebarProvider defaultOpen={true}>
          <Routes>
            {/* Rotas de Autenticação (sem sidebar/header principal) */}
            <Route path="/" element={<Login />} /> {/* Rota principal de login */}
            <Route path="/register" element={<RegisterPage />} /> {/* Sua nova rota de registro */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* Sua nova rota de recuperação de senha */}
            {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}{/* Adicione quando criar */}

            {/* Rotas Protegidas (com Sidebar/Header) */}
            <Route
              path="*" // Esta rota captura qualquer coisa que não foi capturada acima
              element={
                <LayoutWithSidebar>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/gastos" element={<GastosPage />} />
                    <Route path="/vendas" element={<Vendas />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* ...outras rotas da aplicação principal */}
                  </Routes>
                </LayoutWithSidebar>
              }
            />
          </Routes>
        </SidebarProvider>
      </HeaderProvider>
    </BrowserRouter>
  );
}

export default App;



function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { open, isMobile } = useSidebar();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Minha Aplicação");
  const [pageIcon, setPageIcon] = useState("");

  React.useEffect(() => {
    switch (location.pathname) {
      case "/":
            setPageTitle("Login");
            setPageIcon("🔑")
            break;
      case "/dashboard": // ✅ mudou de '/' para '/dashboard'
        setPageTitle("Dashboard");
        setPageIcon("📊");
        break;
      case "/gastos":
        setPageTitle("Gastos");
        setPageIcon("💸");
        break;
      case "/vendas":
        setPageTitle("Vendas");
        setPageIcon("📈");
        break;
      case "/register":
        setPageTitle("Registrar");
        setPageIcon("📝")
        break;
        case "/forgot-password":
          setPageTitle("Recuperar Senha");
          setPageIcon("🔒")
          break;
        case "/profile":
          setPageTitle("Perfil");
          setPageIcon("👤")
          break;
      default:
        setPageTitle("Minha Aplicação");
        setPageIcon("");
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      <TitleEffect baseTitle={pageTitle} icon={pageIcon} />
      <Sidebar collapsible="offcanvas" side="left">
        <AppSidebarContent />
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        {!isMobile && (
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger />
          </div>
        )}
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
