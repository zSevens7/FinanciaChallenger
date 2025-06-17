// src/components/DashHistory/DashHistory.tsx
import React, { useState } from "react";
import moment from "moment"; // Certifique-se de ter 'moment' instalado: npm install moment ou yarn add moment
import FloatingBox from "../FloatingBox"; // Verifique se o caminho está correto
import PrimaryButton from "../PrimaryButton"; // Verifique se o caminho está correto
import HistorySelectButton from "./subcomponents/HistorySelectButton"; 

// =======================================================================
// INTERFACES PARA O COMPONENTE DashHistory E SEUS SUB-COMPONENTES
// =======================================================================

// Interface para uma transação individual combinada
// Deve corresponder ao formato que o Dashboard.tsx cria em `allTransactions`
export interface Transaction {
  id: string | number; // ID único
  data: string; // Data da transação (yyyy-mm-dd)
  type: 'expense' | 'sale'; // Tipo geral: 'expense' ou 'sale'
  amount: number | null; // Valor da transação

  // Propriedades específicas que podem vir de Gastos ou Vendas
  descricao?: string; // Para Gastos
  nomeCliente?: string; // Para Vendas
  tipoCurso?: string; // Para Vendas (usado para o 'tipo' no HistoryCard)
  comentario?: string; // Para Gastos ou Vendas
  tipo?: string; // Uma string para o `getIcon()` (ex: 'Aluguel', 'Venda', 'Luz')
}

// Interface para as props do DashHistory
export interface DashHistoryProps {
  transactions: Transaction[]; // O array de transações combinado
}

// Interface para as props do HistoryCard
interface HistoryCardProps {
  id: string | number; // Necessário para a key do React
  data: string;
  comentario?: string;
  nomeCliente?: string;
  tipo?: string; // O tipo mais específico (Aluguel, Luz, Venda, Matrícula)
  type: 'expense' | 'sale'; // O tipo geral (entrada/saída)
  amount: number | null;
}

// =======================================================================
// COMPONENTE HISTORYCARD
// =======================================================================
const HistoryCard: React.FC<HistoryCardProps> = ({
  id,
  data,
  comentario,
  nomeCliente,
  tipo, // tipo mais específico
  type, // tipo geral (expense/sale)
  amount,
}) => {
  const getIcon = () => {
    // Implemente sua lógica de ícones aqui com base no 'tipo' ou 'type'
    // Exemplo simplificado:
    switch (tipo) {
      case "Aluguel": return "🏠";
      case "Luz": return "💡";
      case "Venda": return "💰";
      case "Matrícula": return "📝";
      case "Outros": return "📦";
      default:
        return type === 'expense' ? "➖" : "➕"; // Ícone padrão
    }
  };

  return (
    <div key={id} className="flex flex-row justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
      <div className="text-2xl mr-2">{getIcon()}</div> {/* Ajuste de tamanho do ícone */}
      <div className="flex flex-col flex-grow">
        <div className="font-semibold text-gray-800">
          {comentario || (type === 'sale' ? `Venda (${tipo || 'Desconhecido'})` : `Gasto (${tipo || 'Desconhecido'})`)}
        </div>
        {nomeCliente && <div className="text-sm text-gray-500">Cliente: {nomeCliente}</div>}
      </div>
      <div className="flex flex-col items-end ml-2">
        <div
          className={`${
            type === "sale" ? "text-green-500" : "text-red-500"
          } font-bold`}
        >
          R$ {amount != null ? amount.toFixed(2).replace(".", ",") : "0,00"}
        </div>
        <div className="text-sm text-gray-500">
          {moment(data).format("DD/MM/YYYY")}
        </div>
      </div>
    </div>
  );
};

// =======================================================================
// COMPONENTE DashHistory
// =======================================================================
const DashHistory: React.FC<DashHistoryProps> = ({ transactions }) => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);
  const [verMais, setVerMais] = useState(false);

  const getData = () => {
    let finalData = [...transactions]; // Usa as props 'transactions'
    if (selectedTab === "Vendas") {
      finalData = finalData.filter((item) => item.type === "sale"); // Filtra por 'type'
    } else if (selectedTab === "Gastos") {
      finalData = finalData.filter((item) => item.type === "expense"); // Filtra por 'type'
    }
    return finalData;
  };

  const dataToDisplay = verMais
    ? getData()
    : getData().slice(0, 6); // Os primeiros 6 itens para "Ver menos"

  return (
    <div>
      <div className="flex flex-col w-full text-purple-600 text-xl font-bold gap-2 max-w-96 mb-2"> {/* Ajuste de texto para 'xl' */}
        Transações Recentes
      </div>
      <FloatingBox containerClassName="w-96">
        <div className="flex justify-between mb-4"> {/* Adicionado mb-4 para espaçamento */}
          <HistorySelectButton
            label="Todos"
            isSelected={selectedTab === undefined}
            onClick={() => {
              setSelectedTab(undefined);
            }}
          />
          <HistorySelectButton
            label="Vendas"
            isSelected={selectedTab === "Vendas"}
            onClick={() => {
              setSelectedTab("Vendas");
            }}
          />
          <HistorySelectButton
            label="Gastos"
            isSelected={selectedTab === "Gastos"}
            onClick={() => {
              setSelectedTab("Gastos");
            }}
          />
        </div>
        <div className="space-y-3"> {/* Espaçamento entre os HistoryCards */}
          {dataToDisplay.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Nenhuma transação para exibir.</p>
          ) : (
            dataToDisplay.map((item) => (
              <HistoryCard
                key={item.id} // Muito importante para a performance e evitar erros no React
                id={item.id}
                data={item.data}
                comentario={item.comentario || item.descricao} // Prioriza 'comentario', senão usa 'descricao'
                nomeCliente={item.nomeCliente}
                type={item.type}
                tipo={item.tipo || (item.type === 'expense' ? 'Gasto' : 'Venda')} // Garante um 'tipo' para o getIcon
                amount={item.amount}
              />
            ))
          )}
        </div>
        {/* Mostra o botão "Ver mais/menos" apenas se houver mais de 6 transações */}
        {getData().length > 6 && (
          <PrimaryButton
            onClick={() => {
              setVerMais(!verMais);
            }}
            label={!verMais ? "Ver mais" : "Ver menos"}
            className="mt-4 w-full" // Adiciona margem superior e largura total
          />
        )}
      </FloatingBox>
    </div>
  );
};

export default DashHistory;