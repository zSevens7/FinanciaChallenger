import { formatDate } from "../../../utils"
import { useState } from "react";
import type { GastosTableProps } from "../../../types";

export const GastosTable = ({ gastos }: GastosTableProps) => {
  //vaii definir que qnd estiver no modo mobile vai exibir uma tabela compacta
  const [showAllColumnsMobile, setShowAllColumnsMobile] = useState(false);

  const toggleMobileColumns = () => {
    setShowAllColumnsMobile(!showAllColumnsMobile);
  };

  const getColSpan = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) { 
      return 5;
    }
    return showAllColumnsMobile ? 5 : 2;
  };


  return (
    <div className="mt-6 font-inter"> {/* fonte Inter*/}
      {/* Botao para dar visibilidade */}
      <div className="md:hidden mb-4 text-right"> {/* */}
        <button
          onClick={toggleMobileColumns}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-150 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#964bca]
                      ${showAllColumnsMobile 
                        ? 'bg-purple-200 text-purple-700 hover:bg-purple-300' 
                        : 'bg-[#964bca] text-white hover:bg-purple-700'
                      }`}
        >
          {showAllColumnsMobile ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
        </button>
      </div>

      <div className="shadow-lg shadow-grey-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#964bca] text-purple-50">
              <tr>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap">Data</th>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap">Nome</th>
                {/* elas so mostram no mobile apertadno o botao */}
                <th
                  scope="col"
                  className={`p-4 text-left font-semibold tracking-wider whitespace-nowrap ${
                    showAllColumnsMobile ? 'table-cell' : 'hidden'
                  } md:table-cell`}
                >
                  Preço (R$)
                </th>
                <th
                  scope="col"
                  className={`p-4 text-left font-semibold tracking-wider whitespace-nowrap ${
                    showAllColumnsMobile ? 'table-cell' : 'hidden'
                  } md:table-cell`}
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className={`p-4 text-left font-semibold tracking-wider whitespace-nowrap ${
                    showAllColumnsMobile ? 'table-cell' : 'hidden'
                  } md:table-cell`}
                >
                  Tipo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-200">
              {gastos.length > 0 ? (
                gastos.map(g => (
                  <tr key={g.id} className="hover:bg-purple-100 transition-colors duration-150 ease-in-out">
                    <td className="p-4 whitespace-nowrap text-gray-700">{formatDate(g.data)}</td>
                    <td className="p-4 whitespace-nowrap text-gray-800 font-medium">{g.nome}</td>
                    {/* */}
                    <td
                      className={`p-4 text-right whitespace-nowrap text-gray-700 ${
                        showAllColumnsMobile ? 'table-cell' : 'hidden'
                      } md:table-cell`}
                    >
                      {(g.preco ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    <td
                      className={`p-4 whitespace-nowrap text-gray-700 ${
                        showAllColumnsMobile ? 'table-cell' : 'hidden'
                      } md:table-cell`}
                    >
                      {g.categoria}
                    </td>
                    <td
                      className={`p-4 whitespace-nowrap text-gray-700 ${
                        showAllColumnsMobile ? 'table-cell' : 'hidden'
                      } md:table-cell`}
                    >
                      {g.tipoDespesa}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={getColSpan()} 
                    className="p-6 text-center text-purple-600 font-medium"
                  >
                    Nenhum gasto encontrado.
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
