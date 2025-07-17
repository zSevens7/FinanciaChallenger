// src/components/Header/index.tsx

import logo from "../../assets/icons/logo.png";
import perfil from "../../assets/icons/perfil.jpg";
import { usePageHeader } from "../../contexts/HeaderContext";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { PanelLeftIcon } from "lucide-react";
import { Button } from "../ui/button";

function Header() {
  const { pageTitle, rightHeaderContent } = usePageHeader();
  const { isMobile, open } = useSidebar();

  return (
    <div className="flex flex-col flex-1 w-full">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        {/* Left section: Mobile menu + Logo + Page Title */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {/* AQUI ESTÁ A MUDANÇA: Substitua MobileSidebar pelo SidebarTrigger */}
          <div className="md:hidden"> {/* Este div md:hidden é para ocultar no desktop */}
              {/* No mobile, o SidebarTrigger só aparece se a sidebar estiver fechada (para abri-la) */}
              {/* Se você quiser o SidebarTrigger aqui no mobile, descomente e ajuste */}
              {isMobile && !open && (
                <SidebarTrigger />
              )}
          </div>
          {/* Posicionar o SidebarTrigger para Desktop. Ele pode estar no header ou em uma posição fixa.
              Pelos seus prints, parece que você quer ele fixo no canto superior esquerdo no desktop.
              Então, manteremos a lógica no App.tsx para desktop, e apenas o mobile no Header.
              Vou re-adicionar a lógica no App.tsx para o desktop, pois ela era útil para fixar o botão.
          */}

          {/* AJUSTE AQUI: Aumentando a margem esquerda do logo */}
          <img src={logo} alt="Logo" className="h-12 w-auto md:h-20 ml-4" /> {/* Alterado ml-2 para ml-4 */}
          {pageTitle && (
            <h1 className="ml-4 text-2xl font-bold text-purple-700 hidden sm:block">
              {pageTitle}
            </h1>
          )}
        </div>

        {/* Right section: Conteúdo dinâmico do cabeçalho */}
        {rightHeaderContent ? (
          rightHeaderContent
        ) : (
          <div className="flex items-center space-x-4">
            {/* Barra de Pesquisa */}
            <div className="flex items-center bg-gray-50 rounded-full px-3 py-1 w-40 sm:w-60">
              <input
                type="text"
                placeholder="Pesquisar"
                className="bg-transparent outline-none text-sm w-full"
              />
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z"
                />
              </svg>
            </div>

            {/* Ícone de Perfil */}
            <img
              src={perfil}
              alt="Perfil"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        )}
      </header>
    </div>
  );
}

export default Header;