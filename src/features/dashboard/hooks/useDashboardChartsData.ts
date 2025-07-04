// src/features/dashboard/hooks/useDashboardChartsData.ts
import { useMemo } from 'react';
import type { Gasto, Venda } from '../../../hooks/useLocalStorageData';
import { monthNames } from '../../../utils'; // Assuming this utility is correct

// Tipos específicos para cada gráfico
interface SalesExpensesDataPoint {
  period: string;
  totalSales: number;   // CORRECTED: back to camelCase
  totalExpenses: number; // CORRECTED: back to camelCase
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
  filteredGastos: Gasto[],
  filteredVendas: Venda[],
  initialInvestment: number,
  selectedYear: string,
  aggregationType: 'daily' | 'monthly' | 'yearly',
  selectedMonth?: string
): DashboardChartData => {

  const data = useMemo(() => {
    const salesExpensesMap = new Map<string, { totalSales: number; totalExpenses: number; netCashFlow: number }>();
    const allTransactions = [...filteredGastos, ...filteredVendas].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    // Initialize the map with all relevant periods to ensure they appear on the chart
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
    } else if (aggregationType === 'yearly') {
        // You might want to initialize for a range of years here if you need empty years to show
        // For now, it will only show years with data.
    }


    // Process all transactions (sales and expenses)
    allTransactions.forEach(item => {
      const date = new Date(item.data);
      let periodKey: string;

      if (aggregationType === 'daily' && selectedMonth) {
        if (date.getFullYear().toString() !== selectedYear || (date.getMonth() + 1).toString().padStart(2, '0') !== selectedMonth) {
          return;
        }
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      } else if (aggregationType === 'monthly') {
        if (date.getFullYear().toString() !== selectedYear) {
          return;
        }
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else { // yearly
        periodKey = date.getFullYear().toString();
      }

      const current = salesExpensesMap.get(periodKey) || { totalSales: 0, totalExpenses: 0, netCashFlow: 0 };

      if ('preco' in item) { // Is an expense
        current.totalExpenses += (item.preco || 0);
        current.netCashFlow -= (item.preco || 0);
      } else if ('valorFinal' in item) { // Is a sale
        current.totalSales += (item.valorFinal || 0);
        current.netCashFlow += (item.valorFinal || 0);
      }
      salesExpensesMap.set(periodKey, current);
    });

    // Sort the map keys
    const sortedPeriodKeys = Array.from(salesExpensesMap.keys()).sort((a, b) => {
      // Intelligent sorting for Year, Year-Month, Year-Month-Day
      return a.localeCompare(b);
    });

    const salesExpensesData: SalesExpensesDataPoint[] = [];
    const cumulativeCashFlowData: CumulativeCashFlowDataPoint[] = [];
    let currentCumulative = initialInvestment;

    // Populate the data arrays for the charts
    sortedPeriodKeys.forEach(periodKey => {
      const values = salesExpensesMap.get(periodKey)!;

      // Format 'period' for display on charts
      let displayPeriod: string;
      if (aggregationType === 'daily') {
        // periodKey is "YYYY-MM-DD", we want "DD/MM" or "DD/MêsNome"
        const [, monthNum, dayNum] = periodKey.split('-');
        displayPeriod = `${parseInt(dayNum, 10).toString().padStart(2, '0')}/${monthNames[monthNum]}`; // Ex: "01/Janeiro", "15/Janeiro"
      } else if (aggregationType === 'monthly') {
        // periodKey is "YYYY-MM", we want "MêsNome YYYY"
        const [year, monthNum] = periodKey.split('-');
        displayPeriod = `${monthNames[monthNum]} ${year}`; // Ex: "Janeiro 2024"
      } else { // yearly
        displayPeriod = periodKey; // Ex: "2024"
      }

      salesExpensesData.push({
        period: displayPeriod,
        totalSales: values.totalSales,       // CORRECTED: use totalSales
        totalExpenses: values.totalExpenses, // CORRECTED: use totalExpenses
      });

      currentCumulative += values.netCashFlow;
      cumulativeCashFlowData.push({
        period: displayPeriod,
        cumulativeCashFlow: currentCumulative,
        netCashFlow: values.netCashFlow,
      });
    });

    // Add initial point for Cumulative Cash Flow chart if there's an initial investment
    if (initialInvestment !== 0 && cumulativeCashFlowData.length > 0) {
        let initialPeriodLabel: string;
        if (aggregationType === 'daily' && selectedMonth) {
            // For daily, the "before" point could be the day before the first data point
            const firstPeriodSplit = sortedPeriodKeys[0].split('-'); // "YYYY-MM-DD"
            const firstDate = new Date(parseInt(firstPeriodSplit[0]), parseInt(firstPeriodSplit[1]) - 1, parseInt(firstPeriodSplit[2]));
            firstDate.setDate(firstDate.getDate() - 1); // Go back one day
            initialPeriodLabel = `${firstDate.getDate().toString().padStart(2, '0')}/${monthNames[(firstDate.getMonth() + 1).toString().padStart(2, '0')]}`;
        } else if (aggregationType === 'monthly') {
            const firstPeriodSplit = sortedPeriodKeys[0].split('-'); // "YYYY-MM"
            const year = parseInt(firstPeriodSplit[0]);
            const monthNum = parseInt(firstPeriodSplit[1], 10);

            if (monthNum === 1) { // If first month is January, go to previous December
                initialPeriodLabel = `${monthNames["12"]} ${year - 1}`;
            } else { // Go to previous month in the same year
                initialPeriodLabel = `${monthNames[(monthNum - 1).toString().padStart(2, '0')]} ${year}`;
            }
        } else { // yearly
            initialPeriodLabel = (parseInt(selectedYear) - 1).toString();
        }

        cumulativeCashFlowData.unshift({
            period: initialPeriodLabel,
            cumulativeCashFlow: initialInvestment
        });
    }

    return { salesExpensesData, cumulativeCashFlowData };

  }, [filteredGastos, filteredVendas, initialInvestment, selectedYear, aggregationType, selectedMonth]);

  return data;
};