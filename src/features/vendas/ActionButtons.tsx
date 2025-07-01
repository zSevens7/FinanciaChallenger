
import { PlusCircle, Trash2 } from 'lucide-react';


interface ActionButtonsVendasProps { // Nome da interface específico para vendas
  onAdicionarVenda: () => void; 
  onLimparDadosVendas: () => void; 
}

export const ActionButtons = ({
  onAdicionarVenda,
  onLimparDadosVendas
}: ActionButtonsVendasProps) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center p-4">
    {/* Botão Adicionar Venda */}
    <button
      onClick={onAdicionarVenda} // Chamando a função específica de vendas
      className="w-full sm:w-auto bg-purple-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-100"
      aria-label="Adicionar nova venda"
    >
      <PlusCircle size={20} />
      Adicionar Venda
    </button>

    {/* Botão Limpar Dados de Vendas */}
    <button
      onClick={onLimparDadosVendas} // Chamando a função específica de vendas
      className="w-full sm:w-auto bg-red-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:-scale-100"
      aria-label="Limpar dados de vendas"
    >
      <Trash2 size={20} />
      Limpar Dados
    </button>
  </div>
);