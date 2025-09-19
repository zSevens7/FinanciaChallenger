import { formatDate } from "../../../utils";
import { useState } from "react";
import type { Gasto } from "../../../types";

export interface GastosTableProps {
  gastos: Gasto[];
  onDelete?: (id: string) => void;
}

export const GastosTable = ({ gastos, onDelete }: GastosTableProps) => {
  const [showAllColumnsMobile, setShowAllColumnsMobile] = useState(false);

  const toggleMobileColumns = () => {
    setShowAllColumnsMobile(!showAllColumnsMobile);
  };

  const getColSpan = () => {
    const base = typeof window !== "undefined" && window.innerWidth >= 768 ? 5 : showAllColumnsMobile ? 5 : 2;
    return onDelete ? base + 1 : base;
  };

  return (
    <div className="mt-6 font-inter">
      {/* Botão mostrar/ocultar colunas mobile */}
      <div className="md:hidden mb-4 text-right">
        <button
          onClick={toggleMobileColumns}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-150 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#964bca]
                     ${showAllColumnsMobile
                      ? 'bg-purple-200 text-purple-700 hover:bg-purple-300'
                      : 'bg-[#ce644a] text-white hover:bg-purple-700'
                     }`}
        >
          {showAllColumnsMobile ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
        </button>
      </div>

      <div className="shadow-lg shadow-grey-500/20 rounded-xl overflow-hidden border border-purple-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f55944] text-purple-50">
              <tr>
                <th scope="col" className="p-3 text-left font-semibold tracking-wider whitespace-nowrap">Data</th>
                <th scope="col" className={`p-3 text-left font-semibold tracking-wider whitespace-nowrap hidden md:table-cell ${showAllColumnsMobile ? 'table-cell' : ''}`}>Nome</th>
                <th scope="col" className="p-3 text-right font-semibold tracking-wider whitespace-nowrap">Preço (R$)</th>
                <th scope="col" className={`p-3 text-center font-semibold tracking-wider whitespace-nowrap hidden lg:table-cell ${showAllColumnsMobile ? 'table-cell' : ''}`}>Categoria</th>
                <th scope="col" className={`p-3 text-left font-semibold tracking-wider whitespace-nowrap hidden sm:table-cell ${showAllColumnsMobile ? 'table-cell' : ''}`}>Tipo</th>
                {onDelete && <th scope="col" className="p-3 text-center font-semibold tracking-wider whitespace-nowrap">Ações</th>}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-purple-100">
              {gastos.length > 0 ? (
                gastos.map(g => (
                  <tr key={g.id} className="hover:bg-purple-50 transition-colors duration-150 ease-in-out">
                    <td className="p-3 whitespace-nowrap text-gray-700">{typeof g.data === "string" ? formatDate(g.data) : "—"}</td>
                    <td className={`p-3 whitespace-nowrap text-gray-800 font-medium hidden md:table-cell ${showAllColumnsMobile ? 'table-cell' : ''}`}>{g.nome}</td>
                    <td className="p-3 text-right whitespace-nowrap text-gray-700">R$ {(g.preco ?? 0).toFixed(2).replace('.', ',')}</td>
                    <td className={`p-3 text-center whitespace-nowrap text-gray-700 hidden lg:table-cell ${showAllColumnsMobile ? 'table-cell' : ''}`}>{g.categoria}</td>
                    <td className={`p-3 whitespace-nowrap text-gray-700 hidden sm:table-cell ${showAllColumnsMobile ? 'table-cell' : ''}`}>{g.tipoDespesa}</td>
                    {onDelete && (
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            if (confirm("Deseja realmente apagar este gasto?")) {
                              onDelete(g.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 font-medium p-1 rounded-full hover:bg-red-100 transition-colors"
                          title="Apagar gasto"
                        >
                          {/* Ícone de lixeira */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={getColSpan()} className="p-6 text-center text-purple-600 font-medium">
                    Nenhum gasto encontrado para os filtros selecionados.
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