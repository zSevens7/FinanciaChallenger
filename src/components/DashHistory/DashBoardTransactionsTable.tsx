// NENHUMA MUDANÇA NECESSÁRIA AQUI.
// O ERRO #310 ESTÁ NO SEU DASHBOARD.TSX (na renderização dos KPIs ou do 'error')
// OU NA SUA FUNÇÃO 'formatDate' (se ela retornar um objeto Date em vez de string).

import React, { useState, useMemo } from "react";
import { formatDate } from "../../utils";

// Tipo de transação do Dashboard
export type Transaction = {
  id: string | number;
  data: string;
  type: "sale" | "expense"; // obrigatório: literal
  amount: number;
  descricao?: string; // opcional, usada na tabela
  tipo?: string;      // opcional, aparece na tabela
};

interface DashboardTransactionsTableProps {
  transactions: Transaction[];
}

export const DashboardTransactionsTable: React.FC<DashboardTransactionsTableProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<"all" | "sales" | "expenses">("all");

  const filteredAndLimitedTransactions = useMemo(() => {
    let filtered = transactions;
    if (filterType === "sales") {
      filtered = transactions.filter((t) => t.type === "sale");
    } else if (filterType === "expenses") {
      filtered = transactions.filter((t) => t.type === "expense");
    }
    return filtered.slice(0, 5);
  }, [transactions, filterType]);

  return (
    <div className="mt-6 font-inter w-full">
      <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Transações Recentes</h2>

      {/* Botões de filtro */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out ${
            filterType === "all" ? "bg-blue-800 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterType("sales")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out ${
            filterType === "sales" ? "bg-green-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Vendas
        </button>
  	  <button
  	    onClick={() => setFilterType("expenses")}
  	    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out ${
  	      filterType === "expenses" ? "bg-red-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
  	    }`}
  	  >
  	    Gastos
  	  </button>
  	</div>

  	<div className="shadow-lg shadow-gray-500/20 rounded-xl overflow-hidden border border-blue-300">
  	  <div className="overflow-x-auto">
  	    <table className="min-w-full text-sm">
  	      <thead className="bg-blue-800 text-white">
  	        <tr>
  	          <th className="p-3 text-left font-semibold tracking-wider whitespace-nowrap">Data</th>
  	          <th className="p-3 text-left font-semibold tracking-wider whitespace-nowrap">Descrição</th>
  	          <th className="p-3 text-right font-semibold tracking-wider whitespace-nowrap">Valor (R$)</th>
  	          <th className="p-3 text-center font-semibold tracking-wider whitespace-nowrap hidden sm:table-cell">Tipo</th>
  	        </tr>
  	      </thead>
  	      <tbody className="bg-white divide-y divide-blue-100">
  	        {filteredAndLimitedTransactions.length > 0 ? (
  	          filteredAndLimitedTransactions.map((t) => (
  	            <tr key={t.id} className="hover:bg-blue-50 transition-colors duration-150 ease-in-out">
  	              <td className="p-3 whitespace-nowrap text-gray-700">
  	                {/* SE 'formatDate' RETORNAR UM OBJETO DATE, O ERRO #310 ACONTECERÁ AQUI */}
  	                {t.data ? formatDate(t.data) : "Data inválida"}
  	              </td>
  	              <td className="p-3 whitespace-nowrap text-gray-800 font-medium">
  	                {t.descricao ?? "Sem descrição"}
  	              </td>
  	              <td
  	                className={`p-3 text-right whitespace-nowrap font-bold ${
  	                  t.type === "expense" ? "text-red-600" : "text-green-600"
  	                }`}
  	              >
  	                {t.type === "expense" ? "- " : "+ "}R$ {(t.amount ?? 0).toFixed(2).replace(".", ",")}
  	              </td>
  	              <td className="p-3 text-center whitespace-nowrap text-gray-700 hidden sm:table-cell">
  	                {/* Esta propriedade 'tipo' não está vindo do seu 'useMemo', 
  	                    mas '?? "-"' lida com isso corretamente. Não é o erro. */}
  	                {t.tipo ?? "-"}
  	              </td>
  	            </tr>
  	          ))
  	        ) : (
  	          <tr>
  	            <td colSpan={4} className="p-6 text-center text-blue-700 font-medium">
  	              Nenhuma transação encontrada para os filtros selecionados.
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