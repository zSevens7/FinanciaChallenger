// src/pages/Dashboard.tsx
import { useState, useEffect, useMemo } from "react";
import DashboardKPI from "../features/dashboard/dashboardKPI";
import PageContainer from "../features/gastos/components/PageContainer";
import { useLocalStorageData} from "../hooks/useLocalStorageData";
import { monthNames, getUniqueYears, getUniqueMonthsForYear } from "../utils";
import { useFinancialMetrics } from "../hooks/useFinancialMetrics";
import { SalesExpensesChart, CumulativeCashFlowChart } from "../features/dashboard/components";
import { usePageHeader } from "../contexts/HeaderContext";
import { DashboardTransactionsTable } from "../components/DashHistory/DashBoardTransactionsTable";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { gastos, vendas, refreshAllData } = useLocalStorageData();
  const { setPageHeader } = usePageHeader();

  const { initialInvestmentCalculated, paybackPeriod, tir, chartData } = useFinancialMetrics(
    gastos,
    vendas,
    selectedYear,
    selectedMonth // <-- Adicione selectedMonth aqui!
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "gastos" || event.key === "vendas" || event.key === null) {
        refreshAllData();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshAllData]);

  useEffect(() => {
    setPageHeader("Dashboard", <></>);
    return () => setPageHeader(null, null);
  }, [setPageHeader]);

  const filteredDataForDisplay = useMemo(() => {
    const allItems = [...gastos, ...vendas];
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

    return { filteredGastos, filteredVendas, allItems };
  }, [gastos, vendas, selectedYear, selectedMonth]);

  const { filteredGastos, filteredVendas, allItems } = filteredDataForDisplay;

  const totalDespesas = filteredGastos.reduce((sum, g) => sum + (g.preco || 0), 0);
  const totalVendas = filteredVendas.reduce((sum, v) => sum + (v.valorFinal || 0), 0);
  const saldoLiquido = totalVendas - totalDespesas;

  const allTransactions = [
    ...filteredGastos.map(g => ({
      id: g.id.toString(),
      data: g.data,
      type: "expense" as const,
      amount: g.preco,
      descricao: g.descricao,
      comentario: g.comentario,
      tipo: g.tipoDespesa
    })),
    ...filteredVendas.map(v => ({
      id: v.id.toString(),
      data: v.data,
      type: "sale" as const,
      amount: v.valorFinal ?? 0,
      nomeCliente: v.nomeCliente,
      tipoCurso: v.tipoCurso,
      comentario: v.comentario,
      tipo: v.tipoCurso
    }))
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const uniqueYears = useMemo(() => getUniqueYears(allItems), [allItems]);
  const uniqueMonths = useMemo(() => {
    if (!selectedYear) return [];
    const items = allItems.filter(item => new Date(item.data).getFullYear().toString() === selectedYear);
    return getUniqueMonthsForYear(items, selectedYear);
  }, [allItems, selectedYear]);

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 mb-8">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-start w-full">
          <select
            value={selectedYear}
            onChange={e => {
              setSelectedYear(e.target.value);
              setSelectedMonth("");
            }}
            className="p-2 border border-purple-300 rounded-md bg-white"
          >
            <option value="">Todos os Anos</option>
            {uniqueYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {selectedYear && (
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="p-2 border border-purple-300 rounded-md bg-white"
            >
              <option value="">Todos os Meses</option>
              {uniqueMonths.map(m => (
                <option key={m} value={m}>{monthNames[m]}</option>
              ))}
            </select>
          )}
        </div>

          {/* KPIs responsivos lado a lado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-sm">

            {/* Sempre visíveis */}
            <DashboardKPI
              title="Saldo Líquido"
              value={saldoLiquido.toFixed(2)}
              period={
                selectedMonth && selectedYear
                  ? `${monthNames[selectedMonth]}/${selectedYear}`
                  : selectedYear || "Geral"
              }
            />

            <DashboardKPI
              title="Total Despesas"
              value={totalDespesas.toFixed(2)}
              period={
                selectedMonth && selectedYear
                  ? `${monthNames[selectedMonth]}/${selectedYear}`
                  : selectedYear || "Geral"
              }
            />

            <DashboardKPI
              title="Total de Vendas"
              value={totalVendas.toFixed(2)}
              period={
                selectedMonth && selectedYear
                  ? `${monthNames[selectedMonth]}/${selectedYear}`
                  : selectedYear || "Geral"
              }
            />

            {/* Escondidos no mobile (< 640px) */}
            <div className="hidden sm:block">
              <DashboardKPI
                title="Investimento Inicial"
                value={initialInvestmentCalculated.toFixed(2)}
                period={selectedYear ? `Ano ${selectedYear}` : "Selecione um Ano"}
                valueColorClass={initialInvestmentCalculated < 0 ? "text-red-600" : "text-green-600"}
              />
            </div>

            <div className="hidden sm:block">
              <DashboardKPI
                title="Payback"
                value={paybackPeriod.toString()}
                period={selectedYear ? `Ano ${selectedYear}` : "Selecione um Ano"}
              />
            </div>

            <div className="hidden sm:block">
              <DashboardKPI
                title="TIR"
                value={tir.toString()}
                period={selectedYear ? `Ano ${selectedYear}` : "Selecione um Ano"}
              />
            </div>
          </div>


        {/* Tabela de transações embaixo dos KPIs */}
        <DashboardTransactionsTable transactions={allTransactions} />

        {/* Gráficos */}
        {selectedYear && (
          <div className="flex flex-col gap-8 w-full mt-8 p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">Gráficos Anuais/Mensais</h2>

            <section className="w-full">
              <h3 className="text-xl font-semibold text-[#964bca] mb-3 text-center">Total Vendas vs. Total Despesas</h3>
              {chartData.salesExpensesData.length > 0 ? (
                <SalesExpensesChart data={chartData.salesExpensesData} />
              ) : (
                <p className="text-center text-gray-500">Nenhum dado de vendas ou despesas para o período selecionado.</p>
              )}
            </section>

            <section className="w-full">
              <h3 className="text-xl font-semibold text-[#964bca] mb-3 text-center">Saldo Líquido Acumulado (VPL Visual)</h3>
              {chartData.cumulativeCashFlowData.length > 0 ? (
                <CumulativeCashFlowChart data={chartData.cumulativeCashFlowData} />
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