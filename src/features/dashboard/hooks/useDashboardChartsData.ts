import { useMemo } from 'react';
import type { Gasto, Venda } from '../../../hooks/useLocalStorageData'; 
import { aggregateCashFlows } from '../../../utils/financialCalculations';
import { monthNames } from '../../../utils';

// Tipos específicos para cada gráfico
interface SalesExpensesDataPoint {
  period: string;
  totalSales: number;
  totalExpenses: number;
}

interface CumulativeCashFlowDataPoint {
  period: string;
  cumulativeCashFlow: number;
  netCashFlow?: number;
}

// Interface de retorno do hook
interface DashboardChartData {
  salesExpensesData: SalesExpensesDataPoint[];
  cumulativeCashFlowData: CumulativeCashFlowDataPoint[];
}

export const useDashboardChartsData = (
  filteredGastosForYear: Gasto[],
  filteredVendasForYear: Venda[],
  initialInvestment: number,
  selectedYear: string,
  periodType: 'monthly' | 'yearly' = 'monthly'
): DashboardChartData => {

  const data = useMemo(() => {
    const salesExpensesMap = new Map<string, { totalSales: number; totalExpenses: number }>();

    // Processa Vendas
    filteredVendasForYear.forEach(v => {
      const date = new Date(v.data);
      const periodKey = periodType === 'monthly'
        ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        : date.getFullYear().toString();

      const current = salesExpensesMap.get(periodKey) || { totalSales: 0, totalExpenses: 0 };
      current.totalSales += (v.valorFinal || 0);
      salesExpensesMap.set(periodKey, current);
    });

    // Processa Despesas
    filteredGastosForYear.forEach(g => {
      const date = new Date(g.data);
      const periodKey = periodType === 'monthly'
        ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        : date.getFullYear().toString();

      const current = salesExpensesMap.get(periodKey) || { totalSales: 0, totalExpenses: 0 };
      current.totalExpenses += (g.preco || 0);
      salesExpensesMap.set(periodKey, current);
    });

    const salesExpensesData: SalesExpensesDataPoint[] = Array.from(salesExpensesMap.entries())
      .sort(([a], [b]) => a.localeCompare(b)) // Ordena por chave real (ex: "2025-01")
      .map(([period, values]) => {
        const displayPeriod = periodType === 'monthly'
          ? `${monthNames[period.substring(5, 7)]} ${period.substring(0, 4)}`
          : period;
        return { period: displayPeriod, ...values };
  });


    // 2. Fluxo acumulado
    const operationalGastos = filteredGastosForYear.filter(g => g.tipoDespesa !== 'investimento');
    const aggregatedCashFlows = aggregateCashFlows(operationalGastos, filteredVendasForYear, periodType);

    const cumulativeCashFlowData: CumulativeCashFlowDataPoint[] = [];
    let currentCumulative = initialInvestment;

    if (aggregatedCashFlows.length > 0) {
      const firstPeriod = aggregatedCashFlows[0].period;
      let initialPeriodLabel: string;
      if (periodType === 'monthly') {
        const year = parseInt(firstPeriod.substring(0, 4));
        const month = parseInt(firstPeriod.substring(5, 7));
        initialPeriodLabel = month === 1
          ? `${monthNames["12"]} ${year - 1}`
          : `${monthNames[(month - 1).toString().padStart(2, '0')]} ${year}`;
      } else {
        initialPeriodLabel = (parseInt(firstPeriod) - 1).toString();
      }
      cumulativeCashFlowData.push({
        period: initialPeriodLabel,
        cumulativeCashFlow: initialInvestment
      });
    } else {
      cumulativeCashFlowData.push({
        period: selectedYear,
        cumulativeCashFlow: initialInvestment
      });
    }

    aggregatedCashFlows.forEach(cf => {
      currentCumulative += cf.netCashFlow;
      const displayPeriod = periodType === 'monthly'
        ? `${monthNames[cf.period.substring(5, 7)]} ${cf.period.substring(0, 4)}`
        : cf.period;

      cumulativeCashFlowData.push({
        period: displayPeriod,
        netCashFlow: cf.netCashFlow,
        cumulativeCashFlow: currentCumulative
      });
    });

    return { salesExpensesData, cumulativeCashFlowData };

  }, [filteredGastosForYear, filteredVendasForYear, initialInvestment, selectedYear, periodType]);

  return data;
};
