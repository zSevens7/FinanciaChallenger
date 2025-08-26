// src/pages/Dashboard.tsx
import { useState, useEffect, useMemo } from "react";
import DashboardKPI from "../features/dashboard/dashboardKPI";
import PageContainer from "../features/gastos/components/PageContainer";
import { monthNames, getUniqueYears, getUniqueMonthsForYear } from "../utils";
import { SalesExpensesChart, CumulativeCashFlowChart } from "../features/dashboard/components";
import { usePageHeader } from "../contexts/HeaderContext";
import { DashboardTransactionsTable } from "../components/DashHistory/DashBoardTransactionsTable";
import { useVendas } from "../contexts/VendasContext";
import { useGastos } from "../contexts/GastosContext";
import type { Gasto, Venda } from "../utils/financialCalculations";
import { useDashboardChartsData } from "../features/dashboard/hooks/useDashboardChartsData";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { vendas } = useVendas();
  const { gastos } = useGastos();
  const { setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader("Dashboard", <></>);
    return () => setPageHeader(null, null);
  }, [setPageHeader]);

  const filteredDataForDisplay = useMemo(() => {
    let filteredGastos = [...gastos];
    let filteredVendas = [...vendas];

    if (selectedYear) {
      filteredGastos = filteredGastos.filter(g => new Date(g.data).getFullYear().toString() === selectedYear);
      filteredVendas = filteredVendas.filter(v => new Date(v.data).getFullYear().toString() === selectedYear);

      if (selectedMonth) {
        filteredGastos = filteredGastos.filter(
          g => (new Date(g.data).getMonth() + 1).toString().padStart(2, "0") === selectedMonth
        );
        filteredVendas = filteredVendas.filter(
          v => (new Date(v.data).getMonth() + 1).toString().padStart(2, "0") === selectedMonth
        );
      }
    }

    const allItems = [...filteredGastos, ...filteredVendas];
    return { filteredGastos, filteredVendas, allItems };
  }, [gastos, vendas, selectedYear, selectedMonth]);

  const { filteredGastos, filteredVendas, allItems } = filteredDataForDisplay;

  const totalDespesas = filteredGastos.reduce((sum, g) => sum + (g.preco || 0), 0);
  const totalVendas = filteredVendas.reduce((sum, v) => sum + (v.preco || 0), 0);
  const saldoLiquido = totalVendas - totalDespesas;

  const allTransactions = [
    ...filteredGastos.map(g => ({
      id: g.id,
      data: g.data,
      type: "expense" as const,
      amount: g.preco,
      descricao: g.descricao,
      tipo: g.tipo
    })),
    ...filteredVendas.map(v => ({
      id: v.id,
      data: v.data,
      type: "sale" as const,
      amount: v.preco,
      descricao: v.descricao,
      tipo: v.tipoVenda
    }))
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const uniqueYears = useMemo(() => getUniqueYears(allItems), [allItems]);
  const uniqueMonths = useMemo(() => {
    if (!selectedYear) return [];
    const items = allItems.filter(item => new Date(item.data).getFullYear().toString() === selectedYear);
    return getUniqueMonthsForYear(items, selectedYear);
  }, [allItems, selectedYear]);

  // ✅ Passa filteredVendas direto para o hook, sem adaptações
  const { salesExpensesData, cumulativeCashFlowData } = useDashboardChartsData(
    filteredGastos,
    filteredVendas,
    0, // investimento inicial
    selectedYear,
    selectedMonth ? "monthly" : "yearly",
    selectedMonth
  );

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 mb-8">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-start w-full">
          <select
            value={selectedYear}
            onChange={e => { setSelectedYear(e.target.value); setSelectedMonth(""); }}
            className="p-2 border border-purple-300 rounded-md bg-white"
          >
            <option value="">Todos os Anos</option>
            {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {selectedYear && (
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="p-2 border border-purple-300 rounded-md bg-white"
            >
              <option value="">Todos os Meses</option>
              {uniqueMonths.map(m => (
                <option key={m} value={m}>{monthNames[m] || `Mês ${m}`}</option>
              ))}
            </select>
          )}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-sm">
          <DashboardKPI
            title="Saldo Líquido"
            value={saldoLiquido.toFixed(2)}
            period={selectedMonth && selectedYear ? `${monthNames[selectedMonth]}/${selectedYear}` : selectedYear || "Geral"}
          />
          <DashboardKPI
            title="Total Despesas"
            value={totalDespesas.toFixed(2)}
            period={selectedMonth && selectedYear ? `${monthNames[selectedMonth]}/${selectedYear}` : selectedYear || "Geral"}
          />
          <DashboardKPI
            title="Total de Vendas"
            value={totalVendas.toFixed(2)}
            period={selectedMonth && selectedYear ? `${monthNames[selectedMonth]}/${selectedYear}` : selectedYear || "Geral"}
          />
        </div>

        {/* Tabela */}
        <DashboardTransactionsTable transactions={allTransactions} />

        {/* Gráficos */}
        {selectedYear && (
          <div className="flex flex-col gap-8 w-full mt-8 p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">Gráficos Anuais/Mensais</h2>

            <section className="w-full">
              <h3 className="text-xl font-semibold text-[#964bca] mb-3 text-center">Total Vendas vs. Total Despesas</h3>
              {salesExpensesData.length > 0 ? (
                <SalesExpensesChart data={salesExpensesData} />
              ) : (
                <p className="text-center text-gray-500">Nenhum dado de vendas ou despesas para o período selecionado.</p>
              )}
            </section>

            <section className="w-full">
              <h3 className="text-xl font-semibold text-[#964bca] mb-3 text-center">Saldo Líquido Acumulado (VPL Visual)</h3>
              {cumulativeCashFlowData.length > 0 ? (
                <CumulativeCashFlowChart data={cumulativeCashFlowData} />
              ) : (
                <p className="text-center text-gray-500">Nenhum dado de fluxo de caixa acumulado para o período selecionado.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Dashboard;
