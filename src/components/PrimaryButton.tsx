function PrimaryButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full sm:w-auto bg-purple-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:grey-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-100"
    >
      {label}
    </button>
  );
}

export default PrimaryButton;
