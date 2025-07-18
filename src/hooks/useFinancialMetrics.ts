import { useMemo } from 'react';
import type { Gasto, Venda } from './useLocalStorageData'; // ajuste o caminho se precisar
import { useDashboardChartsData } from '../features/dashboard/hooks/useDashboardChartsData'; // ajuste o caminho
import { aggregateCashFlows, calculatePayback, calculateTIR } from '../utils/financialCalculations'; // ajuste o caminho

interface FinancialMetrics {
  initialInvestmentCalculated: number;
  paybackPeriod: number | string;
  tir: number | string;
  chartData: ReturnType<typeof useDashboardChartsData>;
}

export const useFinancialMetrics = (
  allGastos: Gasto[],
  allVendas: Venda[],
  selectedYear: string,
  selectedMonth: string // <-- Adicionado
): FinancialMetrics => {
  // Filtragem segura dos dados pelo ano selecionado
  const filteredGastosForYear = allGastos.filter(g => g.data.substring(0, 4) === selectedYear);
  const filteredVendasForYear = allVendas.filter(v => new Date(v.data).getFullYear().toString() === selectedYear);

  // 2. CALCULAR O INVESTIMENTO INICIAL
  const targetTipoDespesa = 'investimento';
  const investmentGastos = filteredGastosForYear.filter(g => (g.tipoDespesa || '') === targetTipoDespesa);

  let calculatedInitialInvestment = investmentGastos.reduce((sum, g) => sum + (g.preco || 0), 0);
  if (calculatedInitialInvestment > 0) {
    calculatedInitialInvestment = -calculatedInitialInvestment;
  }

  // Definindo tipo de agregação (diária ou mensal)
  const aggregationType = selectedMonth ? 'daily' : 'monthly';

  // Obtém dados para os gráficos
  const chartData = useDashboardChartsData(
    filteredGastosForYear,
    filteredVendasForYear,
    calculatedInitialInvestment,
    selectedYear,
    aggregationType,
    selectedMonth
  );

  // Calcula métricas financeiras com useMemo para performance
  const metrics = useMemo(() => {
    if (!selectedYear) {
      return {
        initialInvestmentCalculated: 0,
        paybackPeriod: 'N/A',
        tir: 'N/A',
        chartData: { salesExpensesData: [], cumulativeCashFlowData: [] }
      };
    }

    // Gastos operacionais (excluindo investimentos) para fluxo de caixa
    const operationalGastosForCashFlow = filteredGastosForYear.filter(g => g.tipoDespesa !== 'investimento');
    
    // Agrega fluxo de caixa mensal
    const cashFlowsForYear = aggregateCashFlows(
      operationalGastosForCashFlow,
      filteredVendasForYear,
      'monthly'
    );

    // Payback
    let calculatedPayback: number | string = 'N/A';
    if (calculatedInitialInvestment < 0 && cashFlowsForYear.length > 0) {
      const paybackVal = calculatePayback(cashFlowsForYear, calculatedInitialInvestment);
      calculatedPayback = paybackVal === Infinity ? 'Nunca' : `${paybackVal.toFixed(2)} meses`;
    } else if (calculatedInitialInvestment >= 0) {
      calculatedPayback = 'Inv. Inicial Inválido';
    }

    // TIR
    let calculatedTir: number | string = 'N/A';
    if (calculatedInitialInvestment < 0 && cashFlowsForYear.length > 0) {
      const tirVal = calculateTIR(cashFlowsForYear, calculatedInitialInvestment);
      calculatedTir = tirVal !== null && !isNaN(tirVal) ? `${(tirVal * 100).toFixed(2)}%` : 'Não calculável';
    } else if (calculatedInitialInvestment >= 0) {
      calculatedTir = 'Inv. Inicial Inválido';
    }

    return {
      initialInvestmentCalculated: calculatedInitialInvestment,
      paybackPeriod: calculatedPayback,
      tir: calculatedTir,
      chartData
    };
  }, [filteredGastosForYear, filteredVendasForYear, calculatedInitialInvestment, selectedYear, chartData]);

  return metrics;
};
