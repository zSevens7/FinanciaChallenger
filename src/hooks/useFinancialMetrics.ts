// src/hooks/useFinancialMetrics.ts
import { useEffect, useState } from "react";

export interface ChartDataItem {
  name: string; // Ex: "Receita", "Despesas", "Lucro Líquido", "Investimento"
  value: number;
  period?: string; // ⬅️ necessário para filtro por ano/mês
}

// Transaction compatível com DashboardTransactionsTable
export interface Transaction {
  id: string;
  data: string;       // formato ISO "YYYY-MM-DD"
  descricao: string;  // agora em português, para o Dashboard
  amount: number;
  type: "Venda" | "Gasto";
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cumulativeCashFlow: number;
  initialInvestment: number;
  paybackPeriod: number;
  tir: number;
  chartData: ChartDataItem[];

  transactions: Transaction[];
  salesExpensesData: ChartDataItem[];
  cumulativeCashFlowData: ChartDataItem[];
}

export const useFinancialMetrics = () => {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const res = await fetch("/api/metrics", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error("Falha ao buscar métricas");

        const data = await res.json();

        // KPIs básicos
        const chartData: ChartDataItem[] = [
          { name: "Receita", value: data.totalRevenue, period: "2025" },
          { name: "Despesas", value: data.totalExpenses, period: "2025" },
          { name: "Lucro Líquido", value: data.netProfit, period: "2025" },
          { name: "Investimento", value: data.initialInvestment, period: "2025" },
        ];

        // Transações
        const transactions: Transaction[] = (data.transactions || []).map((tx: any, idx: number) => ({
          id: tx.id || idx.toString(),
          data: tx.date,                       // agora compatível com Dashboard
          descricao: tx.description ?? "",      // mapeia para 'descricao'
          amount: tx.amount ?? 0,
          type: tx.type === "Venda" ? "Venda" : "Gasto",
        }));

        // Vendas x Despesas com período
        const salesExpensesData: ChartDataItem[] = [
          { name: "Receita", value: data.totalRevenue, period: "2025" },
          { name: "Despesas", value: data.totalExpenses, period: "2025" },
        ];

        // Fluxo de caixa acumulado
        let saldo = 0;
        const cumulativeCashFlowData: ChartDataItem[] = transactions.length
          ? transactions.map(tx => {
              saldo += tx.type === "Venda" ? tx.amount : -tx.amount;
              return {
                name: tx.data,
                value: saldo,
                period: tx.data.slice(0, 7), // "YYYY-MM"
              };
            })
          : [{ name: "Total", value: data.cumulativeCashFlow, period: "2025" }];

        setMetrics({
          ...data,
          chartData,
          transactions,
          salesExpensesData,
          cumulativeCashFlowData,
        });
      } catch (err: any) {
        console.error("Erro ao carregar métricas:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
};
