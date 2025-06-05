type BurgerMenuProps = {
  setDrawerOpen: () => void;
};

const BurgerMenu = ({ setDrawerOpen }: BurgerMenuProps) => {
  return (
    <button className="cursor-pointer p-3" onClick={setDrawerOpen}>
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 6H20.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 12H20.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 18H16.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BurgerMenu;
