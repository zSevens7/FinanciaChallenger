// Hook personalizado para calcular métricas financeiras
import { useMemo } from 'react';

// ✅ CORREÇÃO: Importa os tipos 'Gasto' e 'Venda' da sua fonte unificada.
// Isso resolve o erro de tipagem que você estava recebendo.
import type { Gasto, Venda } from '../types';



interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cumulativeCashFlow: number;
}

/**
 * Hook para calcular métricas financeiras com base em gastos e vendas.
 * * @param allGastos - Array com todos os gastos.
 * @param allVendas - Array com todas as vendas.
 * @param initialInvestment - Valor do investimento inicial.
 * @returns Um objeto com o total de receita, despesas e lucro líquido.
 */
export const useFinancialMetrics = (
  allGastos: Gasto[],
  allVendas: Venda[],
  initialInvestment: number = 0,
): FinancialMetrics => {
  // O hook 'useMemo' garante que os cálculos só sejam refeitos
  // quando as dependências (gastos, vendas, investimento inicial) mudarem.
  const metrics = useMemo(() => {
    // Calcula o total de receita (vendas)
    const totalRevenue = allVendas.reduce((acc, venda) => {
      // ✅ CORREÇÃO: A propriedade 'preco' existe na interface 'Venda' de `../types`.
      return acc + (venda.preco || 0);
    }, 0);

    // Calcula o total de despesas (gastos)
    const totalExpenses = allGastos.reduce((acc, gasto) => {
      // ✅ CORREÇÃO: A propriedade 'preco' existe na interface 'Gasto' de `../types`.
      return acc + (gasto.preco || 0);
    }, 0);
    
    const netProfit = totalRevenue - totalExpenses;
    const cumulativeCashFlow = initialInvestment + netProfit;

    // Retorna as métricas calculadas
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      cumulativeCashFlow,
    };
  }, [allGastos, allVendas, initialInvestment]);

  return metrics;
};