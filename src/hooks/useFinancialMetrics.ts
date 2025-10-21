// src/hooks/useFinancialMetrics.ts - VERSÃO CORRIGIDA COM TIPOS
import { useEffect, useState, useCallback } from "react";
import api from "../services/api"; // Ajuste o caminho para seu api.ts

// ✅ Interface para a resposta da API
interface ApiMetricsResponse {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cumulativeCashFlow: number;
  initialInvestment: number;
  paybackPeriod: number;
  tir: number;
  transactions?: Array<{
    id: string | number;
    date?: string;
    data?: string;
    description?: string;
    descricao?: string;
    amount: number;
    type: string;
  }>;
  salesExpensesData?: Array<{
    period: string;
    sales: number;
    expenses: number;
  }>;
  cumulativeCashFlowData?: Array<{
    period: string;
    cumulativeCashFlow: number;
  }>;
  chartData?: Array<{
    name: string;
    value: number;
    period?: string;
  }>;
}

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
    id: String(tx.id || `tx-${idx}`),
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
      period: tx.data?.slice(0, 7) || "2025-01",
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

      console.log("🔄 Buscando métricas...");

      // ✅ USA API AXIOS COM TIPO DEFINIDO
      const response = await api.get<ApiMetricsResponse>("/api/metrics");
      const data = response.data;

      console.log("📊 Dados recebidos da API:", data);

      // ✅ Processamento mais simples e estável
      const transactions = processTransactions(data.transactions || []);
      
      const chartData: ChartDataItem[] = [
        { 
          name: "Receita", 
          value: asNumberOrNull(data.totalRevenue) ?? 0, 
          period: "total" 
        },
        { 
          name: "Despesas", 
          value: asNumberOrNull(data.totalExpenses) ?? 0, 
          period: "total" 
        },
        { 
          name: "Lucro Líquido", 
          value: asNumberOrNull(data.netProfit) ?? 0, 
          period: "total" 
        },
        { 
          name: "Investimento", 
          value: asNumberOrNull(data.initialInvestment) ?? 0, 
          period: "total" 
        },
      ];

      // ✅ Sales Expenses Data - usa dados da API ou fallback
      const salesExpensesData: ChartDataItem[] = data.salesExpensesData 
        ? data.salesExpensesData.map((item) => ({
            name: item.period || "Periodo",
            value: item.sales || item.expenses || 0,
            period: item.period
          }))
        : [
            { 
              name: "Receita", 
              value: asNumberOrNull(data.totalRevenue) ?? 0, 
              period: "total" 
            },
            { 
              name: "Despesas", 
              value: asNumberOrNull(data.totalExpenses) ?? 0, 
              period: "total" 
            },
          ];

      // ✅ Cumulative Cash Flow - usa dados da API ou fallback
      const cumulativeCashFlowData = data.cumulativeCashFlowData 
        ? data.cumulativeCashFlowData.map((item) => ({
            name: item.period || "Periodo",
            value: item.cumulativeCashFlow || 0,
            period: item.period
          }))
        : processCashFlowData(transactions);

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
      console.error("❌ Erro ao carregar métricas:", err);
      
      // ✅ Tratamento de erro mais robusto
      if (err.response?.status === 401) {
        setError(new Error("Token inválido ou expirado. Faça login novamente."));
      } else if (err.response?.data?.error) {
        setError(new Error(err.response.data.error));
      } else {
        setError(err instanceof Error ? err : new Error("Erro desconhecido ao carregar métricas"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error };
};