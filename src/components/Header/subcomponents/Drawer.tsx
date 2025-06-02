import { Link } from "react-router-dom";
import { X,
   LayoutDashboard,
  BanknoteArrowDown,
BanknoteArrowUp} from "lucide-react"

type DrawerButtonProps = {
  label: string;
  route: string;
  icon: React.ReactNode;
  closeDrawer: () => void;
};

const DrawerButton = ({ label, route, closeDrawer, icon }: DrawerButtonProps) => {
  return (
    <Link to={route} onClick={closeDrawer}>
      <div className="flex gap-2.5 p-1.5 bg-indigo-500 items-center justify-center rounded-full">{icon}{label}</div>
    </Link>
  );
};

type DrawerProps = {
  closeDrawer: () => void;
  isVisible: boolean;
};
const Drawer = ({ closeDrawer, isVisible }: DrawerProps) => {
  return (
    <div
      className={`p-6 absolute h-full w-96 bg-blue-300 transition-all duration-500 transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button className="cursor-pointer" onClick={closeDrawer}>
        <X/>
      </button>
      <div className="flex flex-col gap-4 mt-8">
        <DrawerButton label="Dashboard" route="/" closeDrawer={closeDrawer} icon={<LayoutDashboard />}/>
        <DrawerButton label="Gastos" route="/gastos" closeDrawer={closeDrawer} icon={<BanknoteArrowDown />} />
        <DrawerButton label="Vendas" route="/vendas" closeDrawer={closeDrawer} icon={<BanknoteArrowUp />}/>
      </div>
    </div>
  );
};

export default Drawer;
