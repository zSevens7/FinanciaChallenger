import { useState, type ReactNode } from "react";
import BurgerMenu from "./subcomponents/BurgerMenu";
import logo from "../../assets/icons/logo.png";
import perfil from "../../assets/icons/perfil.jpg";
import Drawer from "./subcomponents/Drawer";

type HeaderProps = {
  children: ReactNode;
};

function Header({ children }: HeaderProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);

  console.log({ drawerVisible });

  return (
    <div className="flex flex-col flex-1 h-lvh w-lvw bg-amber-400">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        {/* Burger menu */}
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="md:hidden">
            <BurgerMenu
              setDrawerOpen={() => {
                setDrawerVisible(true);
              }}
            />
          </div>
          <img src={logo} alt="Logo" className="h-12 w-auto md:h-20" />
        </div>

        {/* Barra de Pesquisa + Perfil */}
        <div className="flex items-center space-x-4">
          {/* Barra de Pesquisa */}
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-40 sm:w-60">
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
      </header>
      <div className="flex flex-1">
        <Drawer className="hidden md:flex" />
        {children}
      </div>

      <div
        className={`p-6 absolute h-full w-96 bg-blue-300 transition-all duration-500 transform ${
          drawerVisible ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <Drawer
          className={`flex flex-col h-full absolute transition-all duration-500 transform ${
            drawerVisible ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
          closeDrawer={() => {
            setDrawerVisible(false);
          }}
        />
      </div>
    </div>
  );
}

export default Header;
