import { useMemo } from 'react';

// Se ainda não tiver os tipos, define aqui
export interface Gasto {
  data: string;
  preco?: number; // ou valor, dependendo do seu model
  tipo?: string;
  [key: string]: any;
}

export interface Venda {
  data: string;
  valor?: number; // ou preco, dependendo do seu model
  categoria?: string;
  [key: string]: any;
}

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

export interface DashboardChartData {
  salesExpensesData: SalesExpensesDataPoint[];
  cumulativeCashFlowData: CumulativeCashFlowDataPoint[];
}

// Nome dos meses
const monthNames: { [key: string]: string } = {
  '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
  '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
  '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
};

// Type guards
const isGasto = (item: unknown): item is Gasto => {
  return !!item && typeof item === 'object' && 'preco' in item;
};

const isVenda = (item: unknown): item is Venda => {
  return !!item && typeof item === 'object' && 'valor' in item;
};

export const useDashboardChartsData = (
  filteredGastos: Gasto[],
  filteredVendas: Venda[],
  initialInvestment: number,
  selectedYear: string,
  aggregationType: 'daily' | 'monthly' | 'yearly',
  selectedMonth?: string
): DashboardChartData => {
  return useMemo(() => {
    const periodMap = new Map<string, { totalSales: number; totalExpenses: number; netCashFlow: number }>();

    // Inicializa períodos
    if (aggregationType === 'monthly') {
      for (let m = 1; m <= 12; m++) {
        const monthKey = `${selectedYear}-${m.toString().padStart(2, '0')}`;
        periodMap.set(monthKey, { totalSales: 0, totalExpenses: 0, netCashFlow: 0 });
      }
    } else if (aggregationType === 'daily' && selectedMonth) {
      const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dayKey = `${selectedYear}-${selectedMonth}-${d.toString().padStart(2, '0')}`;
        periodMap.set(dayKey, { totalSales: 0, totalExpenses: 0, netCashFlow: 0 });
      }
    }

    const allTransactions: Array<Gasto | Venda> = [...filteredGastos, ...filteredVendas]
      .filter(item => item && typeof item === 'object' && 'data' in item)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    allTransactions.forEach(item => {
      if (!item) return;
      const date = new Date(item.data);
      let key = '';

      if (aggregationType === 'daily' && selectedMonth) {
        if (date.getFullYear().toString() !== selectedYear ||
          (date.getMonth() + 1).toString().padStart(2, '0') !== selectedMonth) return;
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      } else if (aggregationType === 'monthly') {
        if (date.getFullYear().toString() !== selectedYear) return;
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
        key = date.getFullYear().toString();
      }

      const current = periodMap.get(key) || { totalSales: 0, totalExpenses: 0, netCashFlow: 0 };

      if (isGasto(item)) {
        const valor = item.preco ?? 0;
        current.totalExpenses += Math.abs(valor);
        current.netCashFlow -= Math.abs(valor);
      } else if (isVenda(item)) {
        const valor = item.valor ?? 0;
        current.totalSales += valor;
        current.netCashFlow += valor;
      }

      periodMap.set(key, current);
    });

    const sortedKeys = Array.from(periodMap.keys()).sort((a, b) => a.localeCompare(b));

    const salesExpensesData: SalesExpensesDataPoint[] = [];
    const cumulativeCashFlowData: CumulativeCashFlowDataPoint[] = [];

    let cumulative = initialInvestment;
    if (initialInvestment !== 0) {
      const initialLabel = aggregationType === 'monthly' ? `Mês Anterior ${selectedYear}` : (parseInt(selectedYear) - 1).toString();
      cumulativeCashFlowData.push({
        period: initialLabel,
        cumulativeCashFlow: initialInvestment,
        netCashFlow: initialInvestment
      });
    }

    sortedKeys.forEach(key => {
      const values = periodMap.get(key)!;
      let displayPeriod = '';

      if (aggregationType === 'daily') {
        const [, monthStr, dayStr] = key.split('-');
        displayPeriod = `${parseInt(dayStr, 10).toString().padStart(2, '0')}/${monthNames[monthStr] || monthStr}`;
      } else if (aggregationType === 'monthly') {
        const [year, monthStr] = key.split('-');
        displayPeriod = `${monthNames[monthStr] || monthStr} ${year}`;
      } else {
        displayPeriod = key;
      }

      salesExpensesData.push({
        period: displayPeriod,
        totalSales: values.totalSales,
        totalExpenses: values.totalExpenses
      });

      cumulative += values.netCashFlow;
      cumulativeCashFlowData.push({
        period: displayPeriod,
        cumulativeCashFlow: cumulative,
        netCashFlow: values.netCashFlow
      });
    });

    return { salesExpensesData, cumulativeCashFlowData };
  }, [filteredGastos, filteredVendas, initialInvestment, selectedYear, aggregationType, selectedMonth]);
};
