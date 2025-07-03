// src/features/gastos/ActionButtons.tsx

import { PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';

// Componente genérico para um único botão de ação
interface ActionButtonProps {
  label: string; // Rótulo do botão (ex: "Adicionar Gasto")
  onClick: () => void; // Função a ser executada ao clicar
  icon: React.ElementType; // Componente do ícone (ex: PlusCircle)
  colorClass: string; // Classe Tailwind para a cor de fundo (ex: "bg-green-600")
  ariaLabel: string; // Rótulo para acessibilidade
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, icon: Icon, colorClass, ariaLabel }) => (
  <button
    onClick={onClick}
    // Classes Tailwind para responsividade:
    // Ajustes para tornar o botão um pouco menor em telas maiores (desktop)
    // px/py: padding horizontal/vertical
    // text-size: tamanho da fonte
    // gap: espaçamento entre ícone e texto
    className={`w-full sm:w-auto ${colorClass} text-white font-semibold 
      px-1.5 py-0.5 text-xs 
      sm:px-2 sm:py-1 sm:text-xs 
      md:px-3 md:py-1.5 md:text-sm 
      rounded-2xl shadow-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 
      flex items-center justify-center gap-1 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-100`}
    aria-label={ariaLabel}
  >
    {/* Ícone: tamanho 12 em mobile, 14 em sm (tablet), 16 em md (desktop) */}
    <Icon size={12} className="sm:size-12 md:size-14" />
    {/* Texto completo do rótulo, visível apenas em telas maiores que 'sm' */}
    <span className="hidden sm:inline">{label}</span>
    {/* Primeira palavra do rótulo, visível apenas em telas menores que 'sm' para economizar espaço */}
    <span className="inline sm:hidden">{label.split(' ')[0]}</span>
  </button>
);

// Interface para as props do componente principal ActionButtons
interface ActionButtonsProps {
  onAdicionarGasto: () => void;
  onLimparDados: () => void;
}

// Componente principal ActionButtons para Gastos
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAdicionarGasto,
  onLimparDados,
}) => (
  // O contêiner dos botões, alinhado à direita para uso no cabeçalho
  // flex-row: para que os botões fiquem lado a lado
  // gap: espaçamento entre os botões
  // items-center: alinha verticalmente
  // p: padding para o grupo de botões
  <div className="flex flex-row gap-2 sm:gap-4 items-center justify-end p-2 sm:p-4">
    <ActionButton
      label="Adicionar Gasto"
      onClick={onAdicionarGasto}
      icon={PlusCircle}
      colorClass="bg-green-600" // Cor verde para gastos
      ariaLabel="Adicionar novo gasto"
    />
    <ActionButton
      label="Limpar Dados"
      onClick={onLimparDados}
      icon={Trash2}
      colorClass="bg-red-600"
      ariaLabel="Limpar dados de gastos"
    />
  </div>
);