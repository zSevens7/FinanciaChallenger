import { PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon: React.ElementType;
  colorClass: string;
  ariaLabel: string;
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
    {/* Ícone: tamanho 12 em mobile, 12 em sm (tablet), 14 em md (desktop) */}
    <Icon size={10} className="sm:size-12 md:size-14" />
    {/* Texto completo do rótulo, visível apenas em telas maiores que 'sm' */}
    <span className="hidden sm:inline">{label}</span>
    {/* Primeira palavra do rótulo, visível apenas em telas menores que 'sm' para economizar espaço */}
    <span className="inline sm:hidden">{label.split(' ')[0]}</span>
  </button>
);

interface HeaderActionButtonsProps {
  onAdicionarVenda: () => void;
  onLimparDadosVendas: () => void;
}

export const HeaderActionButtons: React.FC<HeaderActionButtonsProps> = ({
  onAdicionarVenda,
  onLimparDadosVendas,
}) => (
  <div className="flex flex-row gap-2 sm:gap-4 items-center justify-end p-2 sm:p-4">
    <ActionButton
      label="Adicionar Venda"
      onClick={onAdicionarVenda}
      icon={PlusCircle}
      colorClass="bg-green-600" // Cor alterada para verde
      ariaLabel="Adicionar nova venda"
    />
    <ActionButton
      label="Limpar Dados"
      onClick={onLimparDadosVendas}
      icon={Trash2}
      colorClass="bg-red-600"
      ariaLabel="Limpar dados de vendas"
    />
  </div>
);
