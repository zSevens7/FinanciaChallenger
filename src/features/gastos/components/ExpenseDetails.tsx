import React from "react"
import type { Gasto } from "../../../types";

import {
  HomeIcon, //MORADIA
  ReceiptRefundIcon, // Para contas_casa
  UsersIcon, // Para folha_pagamento
  SignalIcon, // Para internet_telefone
  BanknotesIcon, // Para impostos_taxas
  EllipsisHorizontalIcon, // Para outros
  ExclamationCircleIcon, 
} from "@heroicons/react/24/outline"; 


export interface ExpenseDetailsProps {
  expenses: Gasto[];
}

const iconMap: Record<string, React.ReactElement> = {
  moradia: (
    <HomeIcon
      className="text-purple-500 w-7 h-7" 
      strokeWidth={2} 
    />
  ),
  contas_casa: (
    <ReceiptRefundIcon
      className="text-purple-500 w-7 h-7"
      strokeWidth={2}
    />
  ),
  folha_pagamento: (
    <UsersIcon
      className="text-purple-500 w-7 h-7"
      strokeWidth={2}
    />
  ),
  internet_telefone: (
    <SignalIcon
      className="text-purple-500 w-7 h-7"
      strokeWidth={2}
    />
  ),
  impostos_taxas: (
    <BanknotesIcon
      className="text-purple-500 w-7 h-7"
      strokeWidth={2}
    />
  ),
  outros: (
    <EllipsisHorizontalIcon
      className="text-purple-500 w-7 h-7"
      strokeWidth={2}
    />
  ),
  fallback: (
    <ExclamationCircleIcon
      className="text-purple-500 w-7 h-7"
      strokeWidth={2}
    />
  ),
};


export const ExpenseDetails: React.FC<ExpenseDetailsProps> = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-2xl font-semibold text-[#964bca] mb-4">
          Detalhamento Mensal dos Gastos
        </h2>
        <p className="text-gray-500">Sem nenhum gasto para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-[#964bca] mb-6 text-center sm:text-left">
          Detalhamento mensal de gastos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {expenses.map(({ id, nome, preco = 0, data, categoria }) => {
          const IconElement = iconMap[categoria] ?? iconMap.outros;
          const displayPrice = preco ?? 0;

          return (
            <div
              key={id}
              className="flex flex-col items-start bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-150 shadow-sm"
            >
              <div className="mb-2 text-[#964bca]">{IconElement}</div>
              <span className="text-sm text-gray-700 font-medium truncate w-full" title={nome}>{nome}</span>
              <span className="mt-1 text-lg font-bold text-gray-900">
                {Number(displayPrice).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <span className="mt-1 text-xs text-gray-500">
                {new Date(data).toLocaleDateString("pt-BR")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
