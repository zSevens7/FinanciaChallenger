// src/hooks/useFinancialMetrics.ts
import { useEffect, useState } from "react";

interface ChartDataItem {
  name: string;
  value: number;
}

interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cumulativeCashFlow: number;
  initialInvestment: number;
  paybackPeriod: number;
  tir: number;
  chartData: ChartDataItem[];

  // ✅ Novas propriedades
  transactions: any[]; // ou tipo correto
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
        const res = await fetch("http://localhost:3001/api/metrics", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          throw new Error("Falha ao buscar métricas");
        }

        const data = await res.json();

        const chartData: ChartDataItem[] = [
          { name: "Receita", value: data.totalRevenue },
          { name: "Despesas", value: data.totalExpenses },
          { name: "Lucro Líquido", value: data.netProfit },
          { name: "Investimento", value: data.initialInvestment },
        ];

        setMetrics({
          ...data,
          chartData,
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
