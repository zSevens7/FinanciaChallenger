import { formatDate } from "../../utils";
import { useState } from "react";
import type { Venda } from "../../types/index";

// Props para a tabela de vendas
export interface VendasTableProps {
  vendas: Venda[];
}

export const VendasTable = ({ vendas }: VendasTableProps) => {
  const [showAllColumnsMobile, setShowAllColumnsMobile] = useState(false);

  const toggleMobileColumns = () => {
    setShowAllColumnsMobile(!showAllColumnsMobile);
  };

  // O colSpan será sempre o número máximo de colunas para garantir que a mensagem
  // "Nenhuma venda encontrada" ocupe toda a largura da tabela, independentemente da responsividade.
  const totalColumns = 10; // Data, Tipo Curso, Cliente, Email, Telefone, Valor Bruto, Desconto, Imposto, Comissão, Valor Final

  return (
    <div className="mt-6 font-inter">
      {/* Botão "Mostrar Detalhes" visível apenas em telas pequenas (abaixo de 'md') */}
      <div className="md:hidden mb-4 text-right">
        <button
          onClick={toggleMobileColumns}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-150 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600
                       ${showAllColumnsMobile
                          ? 'bg-purple-200 text-purple-700 hover:bg-purple-300'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                       }`}
        >
          {showAllColumnsMobile ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
        </button>
      </div>

      <div className="shadow-lg shadow-grey-500/20 rounded-xl overflow-hidden border border-purple-200"> {/* Adicionada borda sutil */}
        <div className="overflow-x-auto"> {/* Garante scroll horizontal se a tabela for muito larga */}
          <table className="min-w-full text-sm">
            <thead className="bg-purple-600 text-white">
              <tr>
                {/* Colunas SEMPRE visíveis */}
                <th scope="col" className="p-3 text-left font-semibold tracking-wider whitespace-nowrap">Data</th>
                <th scope="col" className="p-3 text-left font-semibold tracking-wider whitespace-nowrap">Tipo Curso</th>
                <th scope="col" className="p-3 text-right font-semibold tracking-wider whitespace-nowrap">Valor Final (R$)</th>

                {/* Colunas que aparecem em diferentes breakpoints */}
                {/* Cliente: Escondido abaixo de sm (640px) */}
                <th
                  scope="col"
                  className={`p-3 text-left font-semibold tracking-wider whitespace-nowrap hidden sm:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Cliente
                </th>
                {/* Valor Bruto: Escondido abaixo de lg (1024px) */}
                <th
                  scope="col"
                  className={`p-3 text-right font-semibold tracking-wider whitespace-nowrap hidden lg:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Valor Bruto (R$)
                </th>
                {/* Email: Escondido abaixo de xl (1280px) */}
                <th
                  scope="col"
                  className={`p-3 text-left font-semibold tracking-wider whitespace-nowrap hidden xl:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Email
                </th>
                {/* Telefone: Escondido abaixo de xl (1280px) */}
                <th
                  scope="col"
                  className={`p-3 text-left font-semibold tracking-wider whitespace-nowrap hidden xl:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Telefone
                </th>
                {/* Desconto: Escondido abaixo de 2xl (1536px) */}
                <th
                  scope="col"
                  className={`p-3 text-right font-semibold tracking-wider whitespace-nowrap hidden 2xl:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Desconto (R$)
                </th>
                {/* Imposto: Escondido abaixo de 2xl (1536px) */}
                <th
                  scope="col"
                  className={`p-3 text-right font-semibold tracking-wider whitespace-nowrap hidden 2xl:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Imposto (R$)
                </th>
                {/* Comissão: Escondido abaixo de 2xl (1536px) */}
                <th
                  scope="col"
                  className={`p-3 text-right font-semibold tracking-wider whitespace-nowrap hidden 2xl:table-cell ${
                    showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                  }`}
                >
                  Comissão (R$)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-100"> {/* Linhas divisórias mais claras */}
              {vendas.length > 0 ? (
                vendas.map(venda => (
                  <tr key={venda.id} className="hover:bg-purple-50 transition-colors duration-150 ease-in-out"> {/* Hover mais suave */}
                    {/* Células SEMPRE visíveis */}
                    <td className="p-3 whitespace-nowrap text-gray-700">{formatDate(venda.data)}</td>
                    <td className="p-3 whitespace-nowrap text-gray-800 font-medium">{venda.tipoCurso}</td>
                    <td className="p-3 text-right whitespace-nowrap text-gray-900 font-bold">
                      R$ {(venda.valorFinal ?? 0).toFixed(2).replace('.', ',')}
                    </td>

                    {/* Células que aparecem em diferentes breakpoints */}
                    {/* Cliente (corpo): Escondido abaixo de sm (640px) */}
                    <td
                      className={`p-3 whitespace-nowrap text-gray-800 font-medium hidden sm:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
                    >
                      {venda.nomeCliente}
                    </td>
                    {/* Valor Bruto (corpo): Escondido abaixo de lg (1024px) */}
                    <td
                      className={`p-3 text-right whitespace-nowrap text-gray-700 hidden lg:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
                    >
                      R$ {(venda.valorBruto ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    {/* Email (corpo): Escondido abaixo de xl (1280px) */}
                    <td
                      className={`p-3 whitespace-nowrap text-gray-700 hidden xl:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
                    >
                      {venda.email}
                    </td>
                    {/* Telefone (corpo): Escondido abaixo de xl (1280px) */}
                    <td
                      className={`p-3 whitespace-nowrap text-gray-700 hidden xl:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
                    >
                      {venda.telefone}
                    </td>
                    {/* Desconto (corpo): Escondido abaixo de 2xl (1536px) */}
                    <td
                      className={`p-3 text-right whitespace-nowrap text-gray-700 hidden 2xl:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
                    >
                      R$ {(venda.desconto ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    {/* Imposto (corpo): Escondido abaixo de 2xl (1536px) */}
                    <td
                      className={`p-3 text-right whitespace-nowrap text-gray-700 hidden 2xl:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
                    >
                      R$ {(venda.imposto ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    {/* Comissão (corpo): Escondido abaixo de 2xl (1536px) */}
                    <td
                      className={`p-3 text-right whitespace-nowrap text-gray-700 hidden 2xl:table-cell ${
                        showAllColumnsMobile ? 'table-cell' : '' // Override para mobile toggle
                      }`}
                    >
                      R$ {(venda.comissao ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={totalColumns} // Usando totalColumns para o colSpan
                    className="p-6 text-center text-purple-600 font-medium"
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