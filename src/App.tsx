// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { HeaderProvider } from "./contexts/HeaderContext";
import { VendasProvider } from "./contexts/VendasContext";
import { GastosProvider } from "./contexts/GastosContext";

import PrivateRoute from './components/PrivateRoute';
import { AppSidebarContent } from "./components/AppSidebar";
import { SidebarProvider, Sidebar, SidebarTrigger, useSidebar } from "./components/ui/sidebar";
import TitleEffect from "./components/ui/tittle";

import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import GastosPage from "./pages/GastosPage";
import Vendas from "./pages/Vendas";
import Login from "./pages/Login";
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <AuthProvider>
      <VendasProvider>
        <GastosProvider>
          <BrowserRouter>
            <HeaderProvider>
              <SidebarProvider defaultOpen={true}>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Rotas protegidas */}
                  <Route element={<PrivateRoute><LayoutWithSidebar /></PrivateRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/gastos" element={<GastosPage />} />
                    <Route path="/vendas" element={<Vendas />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Routes>
              </SidebarProvider>
            </HeaderProvider>
          </BrowserRouter>
        </GastosProvider>
      </VendasProvider>
    </AuthProvider>
  );
}

export default App;

// -------------------------
// Layout com Sidebar
function LayoutWithSidebar() {
  const { open, isMobile } = useSidebar();
  const location = useLocation();
  const [pageTitle, setPageTitle] = React.useState("Minha Aplicação");
  const [pageIcon, setPageIcon] = React.useState("");

  React.useEffect(() => {
    switch (location.pathname) {
      case "/dashboard":
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
      case "/profile":
        setPageTitle("Perfil");
        setPageIcon("👤");
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

        {/* 🔑 Outlet renderiza o conteúdo das rotas protegidas */}
        <Outlet />
      </main>
    </div>
  );
}
