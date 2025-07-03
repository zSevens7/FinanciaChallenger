import { formatDate } from "../../../utils"
import { useState } from "react";
import type { Gasto } from "../../../types";

// Props para tabela de gastos
export interface GastosTableProps {
  gastos: Gasto[]
}

export const GastosTable = ({ gastos }: GastosTableProps) => {
  // Estado para controlar a visibilidade de colunas extras no modo mobile
  const [showAllColumnsMobile, setShowAllColumnsMobile] = useState(false);

  // Função para alternar a visibilidade das colunas extras no mobile
  const toggleMobileColumns = () => {
    setShowAllColumnsMobile(!showAllColumnsMobile);
  };

  // Função para determinar o colspan da célula "Nenhum gasto encontrado"
  const getColSpan = () => {
    // Em telas maiores que md (768px), sempre 5 colunas visíveis
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      return 5;
    }
    // Em mobile, 2 colunas visíveis por padrão (Data, Nome)
    // Se 'Mostrar Detalhes' for clicado, 5 colunas visíveis
    return showAllColumnsMobile ? 5 : 2;
  };

  return (
    <div className="mt-6 font-inter"> {/* fonte Inter */}
      {/* Botão para dar visibilidade às colunas extras em mobile */}
      {/* Visível apenas em telas menores que md (tablet/mobile) */}
      <div className="md:hidden mb-4 text-right">
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

      <div className="shadow-lg shadow-grey-500/20 rounded-xl overflow-hidden border border-purple-200"> {/* Adicionada borda sutil */}
        <div className="overflow-x-auto"> {/* Garante scroll horizontal se a tabela for muito larga */}
          <table className="min-w-full text-sm">
            <thead className="bg-[#964bca] text-purple-50">
              <tr>
                {/* Cabeçalhos da tabela */}
                <th scope="col" className="p-3 text-left font-semibold tracking-wider whitespace-nowrap">Data</th>
                {/* Nome: Escondido abaixo de md (768px) */}
                <th
                  scope="col"
                  className={`p-3 text-left font-semibold tracking-wider whitespace-nowrap hidden md:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Nome
                </th>
                <th scope="col" className="p-3 text-right font-semibold tracking-wider whitespace-nowrap">Preço (R$)</th>
                {/* Categoria: Escondida abaixo de lg (1024px) e centralizada */}
                <th
                  scope="col"
                  className={`p-3 text-center font-semibold tracking-wider whitespace-nowrap hidden lg:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Categoria
                </th>
                {/* Tipo: Escondido abaixo de sm (640px) */}
                <th
                  scope="col"
                  className={`p-3 text-left font-semibold tracking-wider whitespace-nowrap hidden sm:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Tipo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-100"> {/* Linhas divisórias mais claras */}
              {gastos.length > 0 ? (
                gastos.map(g => (
                  <tr key={g.id} className="hover:bg-purple-50 transition-colors duration-150 ease-in-out"> {/* Hover mais suave */}
                    <td className="p-3 whitespace-nowrap text-gray-700">
                      {formatDate(g.data)}
                    </td>
                    {/* Nome (corpo): Escondido abaixo de md (768px) */}
                    <td
                      className={`p-3 whitespace-nowrap text-gray-800 font-medium hidden md:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
                    >
                      {g.nome}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap text-gray-700">
                      R$ {(g.preco ?? 0).toFixed(2).replace('.', ',')} {/* Adicionado "R$" e formatado */}
                    </td>
                    {/* Categoria (corpo): Escondida abaixo de lg (1024px) e centralizada */}
                    <td
                      className={`p-3 text-center whitespace-nowrap text-gray-700 hidden lg:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
                    >
                      {g.categoria}
                    </td>
                    {/* Tipo (corpo): Escondido abaixo de sm (640px) */}
                    <td
                      className={`p-3 whitespace-nowrap text-gray-700 hidden sm:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
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
                    Nenhum gasto encontrado para os filtros selecionados. {/* Mensagem mais descritiva */}
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
