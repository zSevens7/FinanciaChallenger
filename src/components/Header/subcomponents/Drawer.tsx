import { Link } from "react-router-dom";

type DrawerButtonProps = {
  label: string;
  route: string;
  closeDrawer: () => void;
};

const DrawerButton = ({ label, route, closeDrawer }: DrawerButtonProps) => {
  return (
    <Link to={route} onClick={closeDrawer}>
      {label}
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
        close drawerr
      </button>
      <div className="flex flex-col gap-4 mt-8">
        <DrawerButton label="Dashboard" route="/" closeDrawer={closeDrawer} />
        <DrawerButton label="Gastos" route="/gastos" closeDrawer={closeDrawer} />
        <DrawerButton label="Vendas" route="/vendas" closeDrawer={closeDrawer} />
      </div>
    </div>
  );
};

export default Drawer;
