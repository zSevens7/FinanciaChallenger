import React from "react"
import type { ExpenseDetailsProps } from "../../../types";


const FaHomeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 576 512" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.58V48a16 16 0 0 0-16-16H320a16 16 0 0 0-16 16v32l-55.85-42.78a16 16 0 0 0-20.32 0L4.39 251.47a16 16 0 0 0-6.39 12.53l16 176A16 16 0 0 0 32 448h16a16 16 0 0 0 16-16v-32h448v32a16 16 0 0 0 16 16h16a16 16 0 0 0 16-16.09l16-176a16 16 0 0 0-6.37-12.53z"/>
  </svg>
);

const FaBoltIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 320 512" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M312.3 271.5L160 496l-32.3-48.5 111.8-175.9H128V16H64v112H16v128h112v-.1l-112 176 32.3 48.4L160 240.6V496h32V240.5l120.3 31z"></path>
  </svg>
);

const FaWrenchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M507.5 192.5c0-20.1-12.1-37.5-29.9-44.9l-72.1-30.1c-5.9-2.5-12.5-2.5-18.4 0l-117.9 49.1c-3.3 1.3-5.2 4.5-5.2 8.1v28.4c0 3.3 1.8 6.3 4.7 7.9l101.8 55.2c2.1 1.1 4.5 1.1 6.6 0l101.8-55.2c2.9-1.6 4.7-4.6 4.7-7.9v-4.9zm-143.3 113.9L262.4 251c-13.2-7.2-29.8-7.2-43.1 0L112.5 306.4c-13.2 7.2-21.6 20.6-21.6 35.2V368c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-26.8c0-4.8 2.6-9.3 6.9-11.9l84.6-51.2c13.2-7.2 29.8-7.2 43.1 0l84.6 51.2c4.3 2.6 6.9 7.1 6.9 11.9V368c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-26.4c0-14.6-8.4-28-21.6-35.2zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 464c-114.9 0-208-93.1-208-208S141.1 48 256 48s208 93.1 208 208-93.1 208-208 208z"/>
  </svg>
);

const FaTintIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 384 512" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M192 512c44.4 0 84.6-19.4 113.1-51.2C337.1 425.9 384 351.4 384 256 384 119 298 .5 192 .5S0 119 0 256c0 95.4 46.9 169.9 78.9 204.8C107.4 492.6 147.6 512 192 512zM119.1 391.6c-20.4-27.5-31.1-59.6-31.1-93.1 0-79.5 64.5-144 144-144s144 64.5 144 144c0 33.5-10.7 65.6-31.1 93.1-17.2 23.2-39.6 41.9-65.3 54.7-1.1.5-2.2.8-3.3.8s-2.2-.3-3.3-.8c-25.7-12.7-48.1-31.5-65.3-54.7z"/>
  </svg>
);

const FaUsersIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 640 512" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.7 0-32 14.3-32 32v144h128V288c0-17.7-14.3-32-32-32zm-256 0h-64c-17.7 0-32 14.3-32 32v144h128V288c0-17.7-14.3-32-32-32zM288 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm-248 80c-32.9 0-59.8 25-63.4 56.9L0 400.9V416c0 17.7 14.3 32 32 32h576c17.7 0 32-14.3 32-32v-15.1l-7.2-64.1c-3.5-31.8-30.4-56.8-63.3-56.8H40z"/>
  </svg>
);

const FaEllipsisHIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"/>
  </svg>
);

const iconMap: Record<string, React.ReactElement> = {
  moradia: <FaHomeIcon className="text-purple-500 w-6 h-6" />, 
  contas_casa: <FaBoltIcon className="text-purple-500 w-6 h-6" />, 
  folha_pagamento: <FaUsersIcon className="text-purple-500 w-6 h-6" />, 
  internet_telefone: <FaWrenchIcon className="text-purple-500 w-6 h-6" />,
  impostos_taxas: <FaTintIcon className="text-purple-500 w-6 h-6" />,
  outros: <FaEllipsisHIcon className="text-purple-500 w-6 h-6" />,
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
              <div className="mb-2 text-purple-500">{IconElement}</div>
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
