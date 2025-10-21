// src/hooks/useFinancialMetrics.ts
import { useEffect, useState } from "react";

export interface ChartDataItem {
  name: string;
  value: number;
  period?: string;
}

export interface Transaction {
  id: string;
  data: string;
  descricao: string;
  amount: number;
  type: "Venda" | "Gasto";
}

// Interface atualizada: KPIs agora podem ser 'null' se a API não os fornecer
export interface FinancialMetrics {
  totalRevenue: number | null;
  totalExpenses: number | null;
  netProfit: number | null;
  cumulativeCashFlow: number | null;
  initialInvestment: number | null;
  paybackPeriod: number | null;
  tir: number | null;
  chartData: ChartDataItem[];
  transactions: Transaction[];
  salesExpensesData: ChartDataItem[];
  cumulativeCashFlowData: ChartDataItem[];
}

// ✅ Helper para garantir que o valor da API seja um número ou nulo
// Isso impede que um objeto (ex: {erro: "..."}) chegue ao estado
const asNumberOrNull = (val: any): number | null => {
  if (val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

export const useFinancialMetrics = () => {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  // ✅ Alterado para 'Error | null' para um tratamento de erro melhor
  const [error, setError] = useState<Error | null>(null);

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

        if (!res.ok) throw new Error(`Falha ao buscar métricas: ${res.statusText}`);

        const data = await res.json();

        // KPIs básicos (usando o helper para segurança)
        const chartData: ChartDataItem[] = [
          { name: "Receita", value: asNumberOrNull(data.totalRevenue) ?? 0, period: "2025" },
          { name: "Despesas", value: asNumberOrNull(data.totalExpenses) ?? 0, period: "2025" },
          { name: "Lucro Líquido", value: asNumberOrNull(data.netProfit) ?? 0, period: "2025" },
          { name: "Investimento", value: asNumberOrNull(data.initialInvestment) ?? 0, period: "2025" },
        ];

        // Transações
        const transactions: Transaction[] = (data.transactions || []).map((tx: any, idx: number) => ({
          id: tx.id || idx.toString(),
          data: tx.date,
          descricao: tx.description ?? "",
          amount: tx.amount ?? 0,
          type: tx.type === "Venda" ? "Venda" : "Gasto",
        }));

        // Vendas x Despesas
        const salesExpensesData: ChartDataItem[] = [
          { name: "Receita", value: asNumberOrNull(data.totalRevenue) ?? 0, period: "2025" },
          { name: "Despesas", value: asNumberOrNull(data.totalExpenses) ?? 0, period: "2025" },
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
          : [{ name: "Total", value: asNumberOrNull(data.cumulativeCashFlow) ?? 0, period: "2025" }];

        // ✅ Substituído o '...data' por um mapeamento explícito e seguro
        setMetrics({
          totalRevenue: asNumberOrNull(data.totalRevenue),
          totalExpenses: asNumberOrNull(data.totalExpenses),
          netProfit: asNumberOrNull(data.netProfit),
          cumulativeCashFlow: asNumberOrNull(data.cumulativeCashFlow),
          initialInvestment: asNumberOrNull(data.initialInvestment),
          paybackPeriod: asNumberOrNull(data.paybackPeriod),
          tir: asNumberOrNull(data.tir),
          // Dados processados
          chartData,
          transactions,
          salesExpensesData,
          cumulativeCashFlowData,
        });
      } catch (err: any) {
        console.error("Erro ao carregar métricas:", err);
        // ✅ Armazena o objeto de Erro completo
        setError(err instanceof Error ? err : new Error(String(err.message || "Erro desconhecido")));
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
};