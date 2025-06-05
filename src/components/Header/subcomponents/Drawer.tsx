import { Link } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  BanknoteArrowDown,
  BanknoteArrowUp,
} from "lucide-react";

type DrawerButtonProps = {
  label: string;
  route: string;
  icon: React.ReactNode;
  closeDrawer?: () => void;
};

const DrawerButton = ({
  label,
  route,
  closeDrawer,
  icon,
}: DrawerButtonProps) => {
  return (
    <Link className="w-full" to={route} onClick={closeDrawer}>
      <div className="flex gap-2.5 p-1.5 bg-white items-center justify-center rounded-full">
        {icon}
        {label}
      </div>
    </Link>
  );
};

type DrawerProps = {
  closeDrawer?: () => void;
  className?: string;
};
const Drawer = ({ closeDrawer, className }: DrawerProps) => {
  return (
    <div className={`p-6 w-96 bg-purple-600 ${className}`}>
      {closeDrawer && (
        <button className="cursor-pointer" onClick={closeDrawer}>
          <X />
        </button>
      )}
      <div className="flex flex-col gap-4 mt-8 items-center w-full ">
        <DrawerButton
          label="Dashboard"
          route="/"
          closeDrawer={closeDrawer}
          icon={<LayoutDashboard />}
        />
        <DrawerButton
          label="Gastos"
          route="/gastos"
          closeDrawer={closeDrawer}
          icon={<BanknoteArrowDown />}
        />
        <DrawerButton
          label="Vendas"
          route="/vendas"
          closeDrawer={closeDrawer}
          icon={<BanknoteArrowUp />}
        />
      </div>
    </div>
  );
};

export default Drawer;
