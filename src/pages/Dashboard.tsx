// src/pages/Dashboard.tsx
import { useState, useEffect, useMemo } from "react";
import DashboardKPI from "../features/dashboard/dashboardKPI";
import PageContainer from "../features/gastos/components/PageContainer";
import { monthNames, safeFormatDate } from "../utils"; // Use safeFormatDate
import { SalesExpensesChart, CumulativeCashFlowChart } from "../features/dashboard/components";
import { usePageHeader } from "../contexts/HeaderContext";
import { DashboardTransactionsTable, Transaction } from "../components/DashHistory/DashBoardTransactionsTable";
import { useFinancialMetrics, ChartDataItem } from "../hooks/useFinancialMetrics";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { setPageHeader } = usePageHeader();
  const { metrics, loading, error } = useFinancialMetrics();

  useEffect(() => {
    setPageHeader("Dashboard", <></>);
    return () => setPageHeader(null, null);
  }, [setPageHeader]);

  if (loading) {
    return (
      <PageContainer>
        <p className="text-center text-gray-600 mt-10">Carregando métricas...</p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <p className="text-center text-red-600 mt-10">
          Erro ao carregar métricas: {error instanceof Error ? error.message : String(error)}
        </p>
      </PageContainer>
    );
  }

  if (!metrics) {
    return (
      <PageContainer>
        <p className="text-center text-gray-500 mt-10">Nenhum dado encontrado.</p>
      </PageContainer>
    );
  }

  // KPIs - useMemo para evitar recálculos desnecessários
  const kpis = useMemo(() => [
    { name: "Receita Total", value: metrics.totalRevenue },
    { name: "Despesas Totais", value: metrics.totalExpenses },
    { name: "Lucro Líquido", value: metrics.netProfit },
    { name: "Investimento Inicial", value: metrics.initialInvestment },
    { name: "Payback (períodos)", value: metrics.paybackPeriod },
    { name: "TIR (%)", value: (metrics.tir ?? 0) * 100 }
  ], [metrics]);

  // Filtro de gráficos por período
  const filterByPeriod = (data: ChartDataItem[]): ChartDataItem[] => {
    return data.filter(item => {
      if (!item.period) return true;
      if (selectedYear && !selectedMonth) return item.period.startsWith(selectedYear);
      if (selectedYear && selectedMonth) return item.period.startsWith(`${selectedYear}-${selectedMonth}`);
      return true;
    });
  };

  // 🔴 CORREÇÃO CRÍTICA: Removido crypto.randomUUID() que causava o erro
  const formattedTransactions: Transaction[] = useMemo(() => {
    if (!metrics?.transactions?.length) return [];

    return metrics.transactions.map((tx, index) => ({
      id: tx.id || `temp-${index}-${tx.data || ''}`, // ID estável
      data: tx.data ?? "",
      type: tx.type === "Venda" ? "sale" : "expense",
      amount: typeof tx.amount === "number" ? tx.amount : 0,
      descricao: tx.descricao ?? "",
    }));
  }, [metrics?.transactions?.length]); // Apenas length como dependência

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 mb-8">
        {/* 🔽 Filtros de ano/mês */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-start w-full">
          <select
            value={selectedYear}
            onChange={e => {
              setSelectedYear(e.target.value);
              setSelectedMonth("");
            }}
            className="p-2 border border-blue-700 rounded-md bg-white text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os Anos</option>
            {[2023, 2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {selectedYear && (
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="p-2 border border-blue-700 rounded-md bg-white text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os Meses</option>
              {Object.keys(monthNames).map(m => (
                <option key={m} value={m}>{monthNames[m]}</option>
              ))}
            </select>
          )}
        </div>

        {/* 📊 KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-sm">
          {kpis.map(kpi => (
            <DashboardKPI
              key={kpi.name}
              title={kpi.name}
              value={typeof kpi.value === "number" ? kpi.value.toFixed(2) : "N/A"}
              period={
                selectedMonth && selectedYear
                  ? `${monthNames[selectedMonth]}/${selectedYear}`
                  : selectedYear || "Geral"
              }
              valueColorClass={typeof kpi.value === "number" && kpi.value < 0 ? "text-red-600" : undefined}
            />
          ))}
        </div>

        {/* 💰 Tabela de Histórico */}
        <DashboardTransactionsTable transactions={formattedTransactions} />

        {/* 📈 Gráficos */}
        <div className="flex flex-col gap-8 w-full mt-8 p-4 bg-blue-50 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
            Gráficos Financeiros
          </h2>

          <section className="w-full">
            <h3 className="text-xl font-semibold text-blue-700 mb-3 text-center">
              Total de Vendas vs. Total de Despesas
            </h3>
            <SalesExpensesChart data={filterByPeriod(metrics.salesExpensesData || [])} />
          </section>

          <section className="w-full">
            <h3 className="text-xl font-semibold text-blue-700 mb-3 text-center">
              Fluxo de Caixa Acumulado
            </h3>
            <CumulativeCashFlowChart
              data={filterByPeriod(metrics.cumulativeCashFlowData || [])}
            />
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;