import { PlusCircle, Trash2 } from 'lucide-react';
interface ActionButtonsProps {
  onAdicionarGasto: () => void
  onLimparDados: () => void
}

export const ActionButtons = ({ onAdicionarGasto, onLimparDados }: ActionButtonsProps) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center p-4">
    {/* Botão Adicionar Gasto */}
    <button
      onClick={onAdicionarGasto}
      className="w-full sm:w-auto bg-[#964bca] text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:grey-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-100"
      aria-label="Adicionar novo gasto" 
    >
      <PlusCircle size={20} /> {/* Ícone de adicionar */}
      Adicionar Gasto
    </button>

    {/* Botão Limpar Dados */}
    <button
      onClick={onLimparDados}
      className="w-full sm:w-auto bg-[#964bca] text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:grey-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-100"
      aria-label="Limpar todos os dados" 
    >
      <Trash2 size={20} /> 
      Limpar Dados
    </button>
  </div>
);
