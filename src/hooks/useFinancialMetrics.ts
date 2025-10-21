// src/hooks/useFinancialMetrics.ts - VERSÃO CORRIGIDA
import { useEffect, useState, useCallback } from "react";

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

const asNumberOrNull = (val: any): number | null => {
  if (val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

// ✅ Função estável para processar transações
const processTransactions = (transactions: any[]): Transaction[] => {
  if (!transactions || !Array.isArray(transactions)) return [];
  
  return transactions.map((tx, idx) => ({
    id: tx.id || `tx-${idx}-${Date.now()}`,
    data: String(tx.date || tx.data || ''),
    descricao: String(tx.description || tx.descricao || ''),
    amount: Number(tx.amount) || 0,
    type: tx.type === "Venda" ? "Venda" : "Gasto",
  }));
};

// ✅ Função estável para processar cash flow
const processCashFlowData = (transactions: Transaction[]): ChartDataItem[] => {
  if (!transactions.length) return [{ name: "Total", value: 0, period: "2025" }];
  
  let saldo = 0;
  return transactions.map(tx => {
    saldo += tx.type === "Venda" ? tx.amount : -tx.amount;
    return {
      name: tx.data,
      value: saldo,
      period: tx.data.slice(0, 7),
    };
  });
};

export const useFinancialMetrics = () => {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ✅ useCallback para evitar recriação da função
  const fetchMetrics = useCallback(async () => {
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

      // ✅ Processamento mais simples e estável
      const transactions = processTransactions(data.transactions || []);
      
      const chartData: ChartDataItem[] = [
        { 
          name: "Receita", 
          value: asNumberOrNull(data.totalRevenue) ?? 0, 
          period: "2025" 
        },
        { 
          name: "Despesas", 
          value: asNumberOrNull(data.totalExpenses) ?? 0, 
          period: "2025" 
        },
        { 
          name: "Lucro Líquido", 
          value: asNumberOrNull(data.netProfit) ?? 0, 
          period: "2025" 
        },
        { 
          name: "Investimento", 
          value: asNumberOrNull(data.initialInvestment) ?? 0, 
          period: "2025" 
        },
      ];

      const salesExpensesData: ChartDataItem[] = [
        { 
          name: "Receita", 
          value: asNumberOrNull(data.totalRevenue) ?? 0, 
          period: "2025" 
        },
        { 
          name: "Despesas", 
          value: asNumberOrNull(data.totalExpenses) ?? 0, 
          period: "2025" 
        },
      ];

      const cumulativeCashFlowData = processCashFlowData(transactions);

      // ✅ Estado mais estável
      setMetrics({
        totalRevenue: asNumberOrNull(data.totalRevenue),
        totalExpenses: asNumberOrNull(data.totalExpenses),
        netProfit: asNumberOrNull(data.netProfit),
        cumulativeCashFlow: asNumberOrNull(data.cumulativeCashFlow),
        initialInvestment: asNumberOrNull(data.initialInvestment),
        paybackPeriod: asNumberOrNull(data.paybackPeriod),
        tir: asNumberOrNull(data.tir),
        chartData,
        transactions,
        salesExpensesData,
        cumulativeCashFlowData,
      });
    } catch (err: any) {
      console.error("Erro ao carregar métricas:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error };
};