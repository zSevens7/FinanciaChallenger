import { useMemo } from 'react';
import type { Gasto, Venda } from '../../../types'; // Importa os tipos do arquivo types.ts

const monthNames: { [key: string]: string } = {
  '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
  '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
  '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
};

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

interface DashboardChartData {
  salesExpensesData: SalesExpensesDataPoint[];
  cumulativeCashFlowData: CumulativeCashFlowDataPoint[];
}

// Type guard para identificar se o item é Venda
const isVenda = (item: Gasto | Venda): item is Venda => {
  return 'valor' in item && 'categoria' in item;
};

// Type guard para identificar se o item é Gasto
const isGasto = (item: Gasto | Venda): item is Gasto => {
  return 'preco' in item && 'tipo' in item;
};

export const useDashboardChartsData = (
  filteredGastos: Gasto[],
  filteredVendas: Venda[],
  initialInvestment: number,
  selectedYear: string,
  aggregationType: 'daily' | 'monthly' | 'yearly',
  selectedMonth?: string
): DashboardChartData => {
  const data = useMemo(() => {
    const salesExpensesMap = new Map<string, { totalSales: number; totalExpenses: number; netCashFlow: number }>();

    const allTransactions: Array<Gasto | Venda> = [...filteredGastos, ...filteredVendas].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    );

    // Inicializa períodos no map
    if (aggregationType === 'monthly') {
      for (let i = 1; i <= 12; i++) {
        const monthKey = `${selectedYear}-${i.toString().padStart(2, '0')}`;
        salesExpensesMap.set(monthKey, { totalSales: 0, totalExpenses: 0, netCashFlow: 0 });
      }
    } else if (aggregationType === 'daily' && selectedMonth) {
      const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dayKey = `${selectedYear}-${selectedMonth}-${day.toString().padStart(2, '0')}`;
        salesExpensesMap.set(dayKey, { totalSales: 0, totalExpenses: 0, netCashFlow: 0 });
      }
    }

    // Processa transações
    allTransactions.forEach(item => {
      const date = new Date(item.data);
      let periodKey = '';

      if (aggregationType === 'daily' && selectedMonth) {
        if (date.getFullYear().toString() !== selectedYear ||
          (date.getMonth() + 1).toString().padStart(2, '0') !== selectedMonth) return;
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      } else if (aggregationType === 'monthly') {
        if (date.getFullYear().toString() !== selectedYear) return;
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else { // yearly
        periodKey = date.getFullYear().toString();
      }

      const current = salesExpensesMap.get(periodKey) || { totalSales: 0, totalExpenses: 0, netCashFlow: 0 };

      if (isGasto(item)) {
        current.totalExpenses += Math.abs(item.preco);
        current.netCashFlow -= Math.abs(item.preco);
      } else if (isVenda(item)) {
        current.totalSales += item.preco;
        current.netCashFlow += item.preco;
      }

      salesExpensesMap.set(periodKey, current);
    });

    const sortedPeriodKeys = Array.from(salesExpensesMap.keys()).sort((a, b) => a.localeCompare(b));

    const salesExpensesData: SalesExpensesDataPoint[] = [];
    const cumulativeCashFlowData: CumulativeCashFlowDataPoint[] = [];

    // Adiciona ponto inicial do investimento
    if (initialInvestment !== 0) {
      let initialPeriodLabel = aggregationType === 'monthly' ? `Mês Anterior ${selectedYear}` : (parseInt(selectedYear) - 1).toString();
      cumulativeCashFlowData.push({
        period: initialPeriodLabel,
        cumulativeCashFlow: initialInvestment,
        netCashFlow: initialInvestment
      });
    }

    let currentCumulative = cumulativeCashFlowData.length > 0 ? cumulativeCashFlowData[cumulativeCashFlowData.length - 1].cumulativeCashFlow : 0;

    sortedPeriodKeys.forEach(periodKey => {
      const values = salesExpensesMap.get(periodKey)!;

      let displayPeriod: string;
      if (aggregationType === 'daily') {
        const [, monthStr, dayStr] = periodKey.split('-');
        displayPeriod = `${parseInt(dayStr, 10).toString().padStart(2, '0')}/${monthNames[monthStr] || monthStr}`;
      } else if (aggregationType === 'monthly') {
        const [year, monthStr] = periodKey.split('-');
        displayPeriod = `${monthNames[monthStr] || monthStr} ${year}`;
      } else {
        displayPeriod = periodKey;
      }

      salesExpensesData.push({
        period: displayPeriod,
        totalSales: values.totalSales,
        totalExpenses: Math.abs(values.totalExpenses),
      });

      currentCumulative += values.netCashFlow;
      cumulativeCashFlowData.push({
        period: displayPeriod,
        cumulativeCashFlow: currentCumulative,
        netCashFlow: values.netCashFlow,
      });
    });

    return { salesExpensesData, cumulativeCashFlowData };
  }, [filteredGastos, filteredVendas, initialInvestment, selectedYear, aggregationType, selectedMonth]);

  return data;
};
