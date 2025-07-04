import { useMemo } from 'react';
import type { Gasto, Venda } from './useLocalStorageData';
import { aggregateCashFlows, calculatePayback, calculateTIR } from '../utils/financialCalculations';
import { useDashboardChartsData } from '../features/dashboard/hooks/useDashboardChartsData';

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
  selectedMonth: string // <-- Adicione este parâmetro
): FinancialMetrics => {
  // Filtragem fora do useMemo (seguro)
  const filteredGastosForYear = allGastos.filter(g => g.data.substring(0, 4) === selectedYear);
  const filteredVendasForYear = allVendas.filter(v => new Date(v.data).getFullYear().toString() === selectedYear);

  // 2. CALCULAR O INVESTIMENTO INICIAL
  const targetTipoDespesa = 'investimento';
  const investmentGastos = filteredGastosForYear.filter(g => (g.tipoDespesa || '') === targetTipoDespesa);

  let calculatedInitialInvestment = investmentGastos.reduce((sum, g) => sum + (g.preco || 0), 0);
  if (calculatedInitialInvestment > 0) {
    calculatedInitialInvestment = -calculatedInitialInvestment;
  }

  // --- >>> ADICIONE ESTA LINHA AQUI <<< ---
  const aggregationType = selectedMonth ? 'daily' : 'monthly'; 
  // --- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ---

  // ✅ Chama o hook corretamente — no topo
  const chartData = useDashboardChartsData(
    filteredGastosForYear,
    filteredVendasForYear,
    calculatedInitialInvestment,
    selectedYear,
    aggregationType, // <-- Agora 'aggregationType' está definido
    selectedMonth    // <-- ADICIONEI selectedMonth aqui!
  );

  const metrics = useMemo(() => {
    if (!selectedYear) {
      return {
        initialInvestmentCalculated: 0,
        paybackPeriod: 'N/A',
        tir: 'N/A',
        chartData: { salesExpensesData: [], cumulativeCashFlowData: [] }
      };
    }

    // 3. Fluxo de caixa para Payback e TIR
    const operationalGastosForCashFlow = filteredGastosForYear.filter(g => g.tipoDespesa !== 'investimento');
    const cashFlowsForYear = aggregateCashFlows(
      operationalGastosForCashFlow,
      filteredVendasForYear,
      'monthly'
    );

    // 4. Payback
    let calculatedPayback: number | string = 'N/A';
    if (calculatedInitialInvestment < 0 && cashFlowsForYear.length > 0) {
      const paybackVal = calculatePayback(cashFlowsForYear, calculatedInitialInvestment);
      calculatedPayback = paybackVal === Infinity ? 'Nunca' : `${paybackVal.toFixed(2)} meses`;
    } else if (calculatedInitialInvestment >= 0) {
      calculatedPayback = 'Inv. Inicial Inválido';
    }

    // 5. TIR
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
  }, [filteredGastosForYear, filteredVendasForYear, calculatedInitialInvestment, selectedYear, chartData]); // Atenção: 'chartData' aqui pode causar re-render desnecessário se não for estável

  return metrics;
};