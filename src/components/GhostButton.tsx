function GhostButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="GhostButton bg-transparent border border-purple-500 text-purple-500 font-semibold py-2 px-4 rounded hover:bg-purple-500 hover:text-white transition-colors duration-300 cursor-pointer"
    >
      {label}
    </button>
  );
}

export default GhostButton;
