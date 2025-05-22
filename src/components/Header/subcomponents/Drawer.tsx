type DrawerButtonProps = {
  label: string;
  onClick?: () => void
}

const DrawerButton = ({
  label,
  onClick
}: DrawerButtonProps) => {
  return (
    <button onClick={onClick} className="cursor-pointer w-full rounded-2xl bg-blue-500">
      {label}
    </button>
  )
};

type DrawerProps = {
  closeDrawer: () => void;
  isVisible: boolean;
}
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
        <DrawerButton label="Dashboard" onClick={() => { console.log('navgate to dashboard') }} />
        <DrawerButton label="Gastos" onClick={() => { console.log('navgate to Gastos') }} />
        <DrawerButton label="Vendas" onClick={() => { console.log('navgate to Vendas') }} />
      </div>
    </div>
  );
};

export default Drawer;
