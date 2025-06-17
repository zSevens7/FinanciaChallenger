// src/pages/dashboard.tsx
import { useState, useEffect, useMemo } from "react";

import DashboardKPI from "../features/dashboard/DashboardKPI";
import DashHistory from "../components/DashHistory/DashHistory";
import PageContainer from "../features/gastos/components/PageContainer";

// Importe o hook useLocalStorageData e o novo hook useFinancialMetrics
import { useLocalStorageData, type Gasto, type Venda } from "../hooks/useLocalStorageData";
import { monthNames, getUniqueYears, getUniqueMonthsForYear } from "../utils";
import { useFinancialMetrics } from "../hooks/useFinancialMetrics";

// Importe os componentes de gráfico do seu novo index.ts
import { SalesExpensesChart, CumulativeCashFlowChart } from '../features/dashboard/components'; // <-- NOVA IMPORTAÇÃO AQUI!

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const { gastos, vendas, refreshAllData } = useLocalStorageData();

  // --- CÁLCULOS DOS KPIs FINANCEIROS E DADOS DOS GRÁFICOS ---
  // Agora desestruturamos 'chartData' também!
  const { initialInvestmentCalculated, paybackPeriod, tir, chartData } = useFinancialMetrics( // <--- MUDANÇA AQUI!
    gastos,
    vendas,
    selectedYear
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gastos' || event.key === 'vendas' || event.key === null) {
        refreshAllData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshAllData]);

  // --- LÓGICA DE FILTRAGEM PARA OS KPIs EXISTENTES E O HISTÓRICO ---
  // Esta lógica de filtragem local permanece para os KPIs de Saldo/Despesas/Vendas e o histórico
  const filteredDataForDisplay = useMemo(() => {
    const allItems = [...gastos, ...vendas];

    let filteredGastos: Gasto[] = [...gastos];
    let filteredVendas: Venda[] = [...vendas];

    if (selectedYear) {
      filteredGastos = filteredGastos.filter(g => new Date(g.data).getFullYear().toString() === selectedYear);
      filteredVendas = filteredVendas.filter(v => new Date(v.data).getFullYear().toString() === selectedYear);

      if (selectedMonth) {
        filteredGastos = filteredGastos.filter(g =>
          (new Date(g.data).getMonth() + 1).toString().padStart(2, '0') === selectedMonth
        );
        filteredVendas = filteredVendas.filter(v =>
          (new Date(v.data).getMonth() + 1).toString().padStart(2, '0') === selectedMonth
        );
      }
    }

    return { filteredGastos, filteredVendas, allItems };
  }, [gastos, vendas, selectedYear, selectedMonth]);

  const { filteredGastos, filteredVendas, allItems } = filteredDataForDisplay;

  // Obtenção de anos e meses únicos para os filtros de data
  const uniqueYears = useMemo(() => getUniqueYears(allItems), [allItems]);

  const uniqueMonths = useMemo(() => {
    if (!selectedYear) return [];
    const dataForSelectedYear = allItems.filter(item => new Date(item.data).getFullYear().toString() === selectedYear);
    return getUniqueMonthsForYear(dataForSelectedYear, selectedYear);
  }, [allItems, selectedYear]);

  // --- CÁLCULOS DOS TOTAIS DO PERÍODO SELECIONADO (Mês/Ano) ---
  const totalDespesas = filteredGastos.reduce((sum, g) => sum + (g.preco || 0), 0);
  const totalVendas = filteredVendas.reduce((sum, v) => sum + (v.valorFinal || 0), 0);
  const saldoLiquido = totalVendas - totalDespesas;

  // --- PREPARAR DADOS PARA HISTÓRICO NO DASHHISTORY ---
  const allTransactions = [
    ...filteredGastos.map(g => ({
      id: g.id,
      data: g.data,
      type: 'expense' as const,
      amount: g.preco,
      descricao: g.descricao,
      comentario: g.comentario,
      tipo: g.tipoDespesa,
    })),
    ...filteredVendas.map(v => ({
      id: v.id,
      data: v.data,
      type: 'sale' as const,
      amount: v.valorFinal,
      nomeCliente: v.nomeCliente,
      tipoCurso: v.tipoCurso,
      comentario: v.comentario,
      tipo: v.tipoCurso,
    }))
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <PageContainer>
      {/* HEADER */}
      <div className="p-6 font-bold text-2xl text-purple-600 border-b border-purple-600 mb-7 ">
        Dashboard
      </div>

      {/* FILTROS DE ANO E MÊS, KPI CARDS E HISTÓRICO */}
      <div className="flex flex-col md:flex-row w-full gap-8 mb-8"> {/* Adicionado mb-8 para espaçamento */}
        <div className="flex flex-col items-center gap-6 w-full md:w-1/2">
          {/* Filtros de Data */}
          <section className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow w-full">
            <h2 className="text-xl font-semibold text-[#964bca] mb-3 text-center">
              Filtros de Data
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedMonth('');
                }}
                className="p-2 border border-purple-300 rounded-md w-full sm:w-auto bg-white focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Todos os Anos</option>
                {uniqueYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {selectedYear && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="p-2 border border-purple-300 rounded-md w-full sm:w-auto bg-white focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Todos os Meses</option>
                  {uniqueMonths.map((m) => (
                    <option key={m} value={m}>
                      {monthNames[m] || m}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </section>

          {/* KPI CARDS (Existente e Novos) */}
          <DashboardKPI
            title="Saldo Líquido"
            value={saldoLiquido.toFixed(2)}
            period={
                selectedMonth && selectedYear
                ? `${monthNames[selectedMonth]}/${selectedYear}`
                : selectedYear
                ? selectedYear
                : "Geral"
            }
          />
          <DashboardKPI
            title="Total Despesas"
            value={totalDespesas.toFixed(2)}
            period={
                selectedMonth && selectedYear
                ? `${monthNames[selectedMonth]}/${selectedYear}`
                : selectedYear
                ? selectedYear
                : "Geral"
            }
          />
          <DashboardKPI
            title="Total de Vendas"
            value={totalVendas.toFixed(2)}
            period={
                selectedMonth && selectedYear
                ? `${monthNames[selectedMonth]}/${selectedYear}`
                : selectedYear
                ? selectedYear
                : "Geral"
            }
          />

          {/* NOVOS KPI CARDS: Investimento Inicial, Payback e TIR */}
          <DashboardKPI
              title="Investimento Inicial"
              value={initialInvestmentCalculated.toFixed(2)}
              period={selectedYear ? `Ano ${selectedYear}` : "Selecione um Ano"}
              // Adicione uma classe para cor negativa se for o caso
              valueColorClass={initialInvestmentCalculated < 0 ? 'text-red-600' : 'text-green-600'} 
          />
          <DashboardKPI
            title="Payback"
            value={paybackPeriod.toString()}
            period={selectedYear ? `Ano ${selectedYear}` : "Selecione um Ano"}
          />
          <DashboardKPI
            title="TIR"
            value={tir.toString()}
            period={selectedYear ? `Ano ${selectedYear}` : "Selecione um Ano"}
          />

        </div>

        {/* TRANSACTION HISTORY */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <DashHistory transactions={allTransactions} />
        </div>
      </div>

      {/* --- SEÇÃO DOS GRÁFICOS --- */}
      {selectedYear && ( // Renderiza os gráficos apenas se um ano for selecionado
        <div className="flex flex-col gap-8 w-full mt-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">Gráficos Anuais/Mensais</h2>

          <section className="w-full">
            <h3 className="text-xl font-semibold text-[#964bca] mb-3 text-center">Total Vendas vs. Total Despesas</h3>
            {/* Certifique-se de que chartData.salesExpensesData tem dados antes de renderizar */}
            {chartData.salesExpensesData.length > 0 ? (
                <SalesExpensesChart data={chartData.salesExpensesData} />
            ) : (
                <p className="text-center text-gray-500">Nenhum dado de vendas ou despesas para o período selecionado.</p>
            )}
          </section>

          <section className="w-full">
            <h3 className="text-xl font-semibold text-[#964bca] mb-3 text-center">Saldo Líquido Acumulado (VPL Visual)</h3>
            {/* Certifique-se de que chartData.cumulativeCashFlowData tem dados antes de renderizar */}
            {chartData.cumulativeCashFlowData.length > 0 ? (
                <CumulativeCashFlowChart data={chartData.cumulativeCashFlowData} />
            ) : (
                <p className="text-center text-gray-500">Nenhum dado de fluxo de caixa acumulado para o período selecionado.</p>
            )}
          </section>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;