// src/features/vendas/VendasTable.tsx

import { formatDate } from "../../utils";
import { useState } from "react";
import type { Venda } from "../../types/index";

export interface VendasTableProps {
  vendas: Venda[];
  onDelete?: (id: number) => void; // callback para deletar
}

export const VendasTable = ({ vendas, onDelete }: VendasTableProps) => {
  const [showAllColumnsMobile, setShowAllColumnsMobile] = useState(false);

  const toggleMobileColumns = () => {
    setShowAllColumnsMobile(!showAllColumnsMobile);
  };

  const totalColumns = 5; // Data, Tipo da Venda, Descrição, Valor, Ação

  return (
    <div className="mt-6 font-inter">
      <div className="md:hidden mb-4 text-right">
        <button
          onClick={toggleMobileColumns}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600
            ${showAllColumnsMobile
              ? 'bg-green-200 text-green-700 hover:bg-green-300'
              : 'bg-green-600 text-white hover:bg-green-700'
            }`}
        >
          {showAllColumnsMobile ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
        </button>
      </div>

      <div className="shadow-lg shadow-grey-500/20 rounded-xl overflow-hidden border border-green-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-left font-semibold tracking-wider whitespace-nowrap">Data</th>
                <th className="p-3 text-left font-semibold tracking-wider whitespace-nowrap">Tipo da Venda</th>
                <th className="p-3 text-left font-semibold tracking-wider whitespace-nowrap">Descrição</th>
                <th className="p-3 text-right font-semibold tracking-wider whitespace-nowrap">Valor (R$)</th>
                <th className="p-3 text-center font-semibold tracking-wider whitespace-nowrap">Ação</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-100">
              {vendas.length > 0 ? (
                vendas.map((venda) => (
                  <tr
                    key={venda.id}
                    className="hover:bg-green-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="p-3 whitespace-nowrap text-gray-700">{formatDate(venda.data)}</td>
                    <td className="p-3 whitespace-nowrap text-gray-800 font-medium">{venda.tipoVenda}</td>
                    <td className="p-3 whitespace-nowrap text-gray-700">{venda.descricao ?? '-'}</td>
                    <td className="p-3 text-right whitespace-nowrap text-gray-900 font-bold">
                      R$ {(typeof venda.preco === 'number' ? venda.preco : 0).toFixed(2).replace(".", ",")}
                    </td>
                    <td className="p-3 text-center">
                      {onDelete && (
                        <button
                          onClick={() => onDelete(venda.id)}
                          className="text-red-600 hover:text-red-800 font-bold focus:outline-none"
                          aria-label={`Deletar venda ${venda.id}`}
                          title="Deletar venda"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={totalColumns}
                    className="p-6 text-center text-green-600 font-medium"
                  >
                    Nenhuma venda encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
