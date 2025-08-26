// src/components/PrimaryButton.tsx
import React from 'react'; 

// Defina a interface para as props que o PrimaryButton espera receber
interface PrimaryButtonProps {
  onClick: () => void; // A função que será chamada no clique
  label: string;      // O texto do botão
  className?: string; // <-- AQUI! Torna 'className' opcional (com '?') e do tipo string
  // Você pode adicionar outras props aqui se o seu botão as usar (ex: disabled?: boolean;)
}

// Declare o componente como um React.FC (Functional Component) e especifique suas props
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, label, className }) => {
  return (
    <button
      onClick={onClick}
      // Combine as classes padrão com as classes passadas via prop 'className'
      // Se 'className' não for fornecido, ele usará apenas as classes padrão.
      className={`
        w-full sm:w-auto bg-purple-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl
        hover:bg-purple-700
        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75
        flex items-center justify-center gap-2 transition-all duration-300 ease-in-out
        transform hover:-translate-y-0.5 hover:scale-100
        ${className || ''} // Adiciona as classes personalizadas passadas via prop
      `}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
