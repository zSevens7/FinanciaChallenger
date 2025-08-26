import logo from "../../assets/icons/logo.png";
import perfil from "../../assets/icons/perfil.jpg";
import { usePageHeader } from "../../contexts/HeaderContext";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { PanelLeftIcon } from "lucide-react";

function Header() {
  const { pageTitle } = usePageHeader(); // removeu rightHeaderContent
  const { isMobile, open } = useSidebar();

  return (
    <div className="flex flex-col flex-1 w-full">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        {/* Left section: Mobile menu + Logo + Page Title */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {/* Mobile SidebarTrigger */}
          <div className="md:hidden">
            {isMobile && !open && (
              <SidebarTrigger />
            )}
          </div>

          {/* Logo */}
          <img src={logo} alt="Logo" className="h-12 w-auto md:h-20 ml-4" />

          {/* Page Title */}
          {pageTitle && (
            <h1 className="ml-4 text-2xl font-bold text-purple-700 hidden sm:block">
              {pageTitle}
            </h1>
          )}
        </div>

        {/* Right section: Perfil */}
        <div className="flex items-center space-x-4">
          <a href="/profile">
            <img
              src={perfil}
              alt="Perfil"
              className="h-10 w-10 rounded-full object-cover hover:opacity-80 transition"
            />
          </a>
        </div>
      </header>
    </div>
  );
}

export default Header;
