// src/hooks/useFinancialMetrics.ts
import { useEffect, useState } from "react";
import {
  aggregateByPeriod,
  aggregateSalesByPeriod,
  prepareChartData,
  aggregateByCategory,
  aggregateByTipoDespesa,
} from "../services/agreggation"; // ❌ sem ChartDataItem aqui

export interface ChartDataItem {
  name: string;
  value: number;
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

  // Novas propriedades para compatibilidade com dashboard
  transactions: any[];
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

        const token = localStorage.getItem("token"); // 🔐 se usar autenticação
        const res = await fetch("/api/metrics", { // ✅ URL relativa, usa proxy Nginx
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          throw new Error("Falha ao buscar métricas");
        }

        const data = await res.json();

        // Monta chartData padrão do Dashboard
        const chartData: ChartDataItem[] = [
          { name: "Receita", value: data.totalRevenue },
          { name: "Despesas", value: data.totalExpenses },
          { name: "Lucro Líquido", value: data.netProfit },
          { name: "Investimento", value: data.initialInvestment },
        ];

        // Se não vierem arrays, inicializa vazio
        const transactions = data.transactions || [];
        const salesExpensesData: ChartDataItem[] = data.salesExpensesData || [];
        const cumulativeCashFlowData: ChartDataItem[] = data.cumulativeCashFlowData || [];

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
