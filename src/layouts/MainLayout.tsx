// src/layouts/MainLayout.tsx

import React from "react";
import { SidebarProvider, useSidebar, SidebarTrigger, Sidebar } from "@/components/ui/sidebar";
import { X, PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebarContent } from "@/components/AppSidebar"; // Certifique-se de que o caminho está correto

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutContent>
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { open, toggleSidebar, isMobile, state } = useSidebar();

  return (
    <div className="flex h-screen">
      {/*
        REMOVIDA a prop 'isOpen={open}'
        O componente Sidebar já usa o 'state' e 'isMobile' do contexto internamente.
      */}
      <Sidebar collapsible="offcanvas" side="left">
        {/* Conteúdo da sua AppSidebar */}
        <AppSidebarContent />

        {/* Botão de fechar para mobile dentro do Sheet (se necessário) */}
        {/* Este botão aparecerá DENTRO do Sheet quando ele for ativado */}
        {isMobile && open && (
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                // Ajuste as classes para posicionamento dentro do SheetContent
                className="absolute top-2 right-2 z-[1001] text-white hover:bg-gray-700"
                aria-label="Fechar menu"
            >
                <X size={20} />
            </Button>
        )}
      </Sidebar>

      {/* Conteúdo principal da aplicação */}
      <main className="flex-1 overflow-y-auto">
        {/* Botão para togglar a sidebar. Posicione-o onde for mais adequado. */}
        {/* Em desktop, mostra o trigger se sidebar está 'collapsed' */}
        {state === "collapsed" && !isMobile && (
            <div className="absolute top-4 left-4 z-50">
                <SidebarTrigger />
            </div>
        )}
        {/* Em mobile, mostra o trigger se sidebar está fechada ('!open') */}
        {isMobile && !open && (
            <div className="absolute top-4 left-4 z-50">
                <SidebarTrigger />
            </div>
        )}

        {children} {/* Seu conteúdo de página */}
      </main>

      {/* Overlay para mobile quando a sidebar está aberta */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[998]"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}