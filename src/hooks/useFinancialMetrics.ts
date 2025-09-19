// src/hooks/useFinancialMetrics.ts
import { useMemo } from "react";
import type { Gasto, Venda } from "../types";

interface ChartDataItem {
  name: string;
  value: number;
}

interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cumulativeCashFlow: number;
  initialInvestmentCalculated: number;
  paybackPeriod: number;
  tir: number;
  chartData: ChartDataItem[];
}

/**
 * Hook para calcular métricas financeiras com base em gastos e vendas.
 * @param allGastos - Array com todos os gastos.
 * @param allVendas - Array com todas as vendas.
 * @param initialInvestment - Valor do investimento inicial (default: 0)
 * @returns Um objeto com métricas financeiras completas
 */
export const useFinancialMetrics = (
  allGastos: Gasto[],
  allVendas: Venda[],
  initialInvestment: number = 0
): FinancialMetrics => {
  const metrics = useMemo(() => {
    // Total de receita (somatório das vendas)
    const totalRevenue = allVendas.reduce((acc, venda) => acc + (venda.preco || 0), 0);

    // Total de despesas (somatório dos gastos)
    const totalExpenses = allGastos.reduce((acc, gasto) => acc + (gasto.preco || 0), 0);

    // Lucro líquido
    const netProfit = totalRevenue - totalExpenses;

    // Fluxo de caixa acumulado
    const cumulativeCashFlow = initialInvestment + netProfit;

    // Investimento inicial calculado (pode ser ajustado se quiser incluir gastos iniciais)
    const initialInvestmentCalculated = initialInvestment;

    // Payback: tempo aproximado para recuperar o investimento
    const paybackPeriod = netProfit > 0 ? initialInvestment / netProfit : 0;

    // TIR (placeholder, pode ser implementada com fluxo de caixa real)
    const tir = 0;

    // Dados para gráficos
    const chartData: ChartDataItem[] = [
      { name: "Receita", value: totalRevenue },
      { name: "Despesas", value: totalExpenses },
      { name: "Lucro Líquido", value: netProfit },
    ];

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      cumulativeCashFlow,
      initialInvestmentCalculated,
      paybackPeriod,
      tir,
      chartData,
    };
  }, [allGastos, allVendas, initialInvestment]);

  return metrics;
};
