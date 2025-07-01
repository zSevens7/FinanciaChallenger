// src/features/vendas/components/VendasTable.tsx

import { useState, useEffect } from "react"; // Adicionado useEffect para lidar com resize

import { formatDate } from "../../utils";
import type { Venda } from "../../types/index";

// Props para a tabela de vendas
export interface VendasTableProps {
  vendas: Venda[];
}

export const VendasTable = ({ vendas }: VendasTableProps) => {
  const [showAllColumnsMobile, setShowAllColumnsMobile] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false); // Novo estado para controlar se está em view móvel

  // Efeito para verificar o tamanho da tela e ajustar isMobileView
  useEffect(() => {
    const handleResize = () => {
      // Define isMobileView como true se a largura for menor que 'md' (768px)
      setIsMobileView(window.innerWidth < 768);
    };

    // Define o estado inicial
    handleResize();

    // Adiciona o event listener para redimensionamento
    window.addEventListener('resize', handleResize);

    // Limpa o event listener ao desmontar o componente
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Executa apenas uma vez no montagem e desmontagem

  const toggleMobileColumns = () => {
    setShowAllColumnsMobile(!showAllColumnsMobile);
  };

  // Funções auxiliares para classes de colunas
  const getColumnClasses = (breakpoint: string) => {
    // Para telas maiores, a coluna é sempre visível a partir do seu breakpoint
    // Para telas menores, depende do showAllColumnsMobile
    if (isMobileView) {
        return showAllColumnsMobile ? 'table-cell' : 'hidden';
    } else {
        // Para desktops, as colunas são ocultadas abaixo do breakpoint e exibidas acima
        // Ex: para 'md', é hidden sm:hidden, mas md:table-cell
        // Para 'lg', é hidden sm:hidden md:hidden, mas lg:table-cell
        switch (breakpoint) {
            case 'md': return 'hidden md:table-cell';
            case 'lg': return 'hidden md:hidden lg:table-cell'; // Esconde em md também
            case 'xl': return 'hidden md:hidden lg:hidden xl:table-cell'; // Esconde em lg também
            default: return ''; // Para colunas sempre visíveis
        }
    }
  };

  // Consideramos que o colSpan deve cobrir o número total de colunas visíveis em desktop
  // Para mobile, o colSpan será apenas para as colunas base se showAllColumnsMobile for false
  const getColSpan = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1280) { // xl breakpoint
      return 11; // Todas as 11 colunas
    } else if (typeof window !== 'undefined' && window.innerWidth >= 1024) { // lg breakpoint
      return 8; // Data, Tipo Curso, Cliente, Valor Bruto, Email, Telefone, Valor Final + 1 ou 2 adicionais
    } else if (typeof window !== 'undefined' && window.innerWidth >= 768) { // md breakpoint
      return 6; // Data, Tipo Curso, Cliente, Valor Bruto, Valor Final + 1 ou 2 adicionais
    }
    // Em telas pequenas, colSpan depende de showAllColumnsMobile para o "Nenhuma venda encontrada."
    // 3 colunas base (Data, Tipo Curso, Valor Final) + 2 (Cliente, Valor Bruto) + 6 (Email, Telefone, Desconto, Imposto, Comissão) = 11
    return showAllColumnsMobile ? 11 : 3; // 3 colunas básicas ou todas
  };


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

      <div className="shadow-lg shadow-grey-500/20 rounded-xl overflow-hidden">
        {/* Usar overflow-x-auto apenas se não estiver na visualização móvel expandida,
            ou se as colunas ocultas no mobile não puderem ser mostradas facilmente.
            A sua implementação de showAllColumnsMobile já gerencia a visibilidade de célula a célula,
            então o overflow-x-auto garante que, se tudo for mostrado, ainda seja rolavel. */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-purple-600 text-white">
              <tr>
                {/* Colunas SEMPRE visíveis */}
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap">Data</th>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap">Tipo Curso</th>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap">Cliente</th> {/* Cliente agora é sempre visível no mobile quando "Mostrar Detalhes" é clicado */}


                {/* Colunas que aparecem em diferentes breakpoints */}
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap hidden md:table-cell">
                    Email
                </th>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap hidden md:table-cell">
                    Telefone
                </th>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap hidden md:table-cell">
                    Valor Bruto (R$)
                </th>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap hidden lg:table-cell">
                    Desconto (R$)
                </th>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap hidden lg:table-cell">
                    Imposto (R$)
                </th>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap hidden xl:table-cell">
                    Comissão (R$)
                </th>
                <th scope="col" className="p-4 text-left font-semibold tracking-wider whitespace-nowrap">Valor Final (R$)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendas.length > 0 ? (
                vendas.map(venda => (
                  <tr key={venda.id} className="hover:bg-purple-50 transition-colors duration-150 ease-in-out">
                    {/* Células SEMPRE visíveis */}
                    <td className="p-4 whitespace-nowrap text-gray-700">{formatDate(venda.data)}</td>
                    <td className="p-4 whitespace-nowrap text-gray-800 font-medium">{venda.tipoCurso}</td>
                    <td className="p-4 whitespace-nowrap text-gray-800 font-medium">{venda.nomeCliente}</td>


                    {/* Células que aparecem em diferentes breakpoints */}
                    <td
                      className={`p-4 whitespace-nowrap text-gray-700 ${getColumnClasses('md')}`}
                    >
                      {venda.email}
                    </td>
                    <td
                      className={`p-4 whitespace-nowrap text-gray-700 ${getColumnClasses('md')}`}
                    >
                      {venda.telefone}
                    </td>
                    <td
                      className={`p-4 text-right whitespace-nowrap text-gray-700 ${getColumnClasses('md')}`}
                    >
                      {(venda.valorBruto ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    <td
                      className={`p-4 text-right whitespace-nowrap text-gray-700 ${getColumnClasses('lg')}`}
                    >
                      {(venda.desconto ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    <td
                      className={`p-4 text-right whitespace-nowrap text-gray-700 ${getColumnClasses('lg')}`}
                    >
                      {(venda.imposto ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    <td
                      className={`p-4 text-right whitespace-nowrap text-gray-700 ${getColumnClasses('xl')}`}
                    >
                      {(venda.comissao ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap text-gray-900 font-bold">
                      {(venda.valorFinal ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={getColSpan()} // Agora colSpan deve ser mais inteligente
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