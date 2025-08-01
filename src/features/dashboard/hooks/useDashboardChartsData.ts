import { useMemo } from 'react';
import type { Gasto, Venda } from '../../../hooks/useLocalStorageData'; // Ajuste o caminho se necessário. Verifique se Gasto e Venda são exportados.
import { monthNames } from '../../../utils'; // Ajuste o caminho se necessário. Verifique se monthNames é exportado.

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

interface DashboardChartData {
  salesExpensesData: SalesExpensesDataPoint[];
  cumulativeCashFlowData: CumulativeCashFlowDataPoint[];
}

export const useDashboardChartsData = (
  filteredGastos: Gasto[],
  filteredVendas: Venda[],
  initialInvestment: number, // Este já deve vir negativo se for um investimento
  selectedYear: string,
  aggregationType: 'daily' | 'monthly' | 'yearly',
  selectedMonth?: string
): DashboardChartData => {
  const data = useMemo(() => {
    const salesExpensesMap = new Map<string, { totalSales: number; totalExpenses: number; netCashFlow: number }>();

    // Combina gastos e vendas e ordena por data para garantir a acumulação correta
    const allTransactions: Array<Gasto | Venda> = [...filteredGastos, ...filteredVendas].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    );

    // Inicializa o map com todos os períodos relevantes para garantir que apareçam no gráfico, mesmo que sem dados
    if (aggregationType === 'monthly') {
      for (let i = 1; i <= 12; i++) {
        const monthKey = `${selectedYear}-${i.toString().padStart(2, '0')}`;
        salesExpensesMap.set(monthKey, { totalSales: 0, totalExpenses: 0, netCashFlow: 0 });
      }
    } else if (aggregationType === 'daily' && selectedMonth) {
      // O '0' no terceiro argumento de new Date para obter o último dia do mês é importante
      const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dayKey = `${selectedYear}-${selectedMonth}-${day.toString().padStart(2, '0')}`;
        salesExpensesMap.set(dayKey, { totalSales: 0, totalExpenses: 0, netCashFlow: 0 });
      }
    }
    // Para 'yearly', não precisamos inicializar aqui, pois os dados serão agregados por ano diretamente.

    // Processa todas as transações (vendas e despesas)
    allTransactions.forEach((item: Gasto | Venda) => {
      const date = new Date(item.data);
      let periodKey: string = '';

      if (aggregationType === 'daily' && selectedMonth) {
        if (
          date.getFullYear().toString() !== selectedYear ||
          (date.getMonth() + 1).toString().padStart(2, '0') !== selectedMonth
        ) {
          return; // Ignora transações fora do mês/ano selecionado para agregação diária
        }
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
          .getDate()
          .toString()
          .padStart(2, '0')}`;
      } else if (aggregationType === 'monthly') {
        if (date.getFullYear().toString() !== selectedYear) {
          return; // Ignora transações fora do ano selecionado para agregação mensal
        }
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
        // yearly
        periodKey = date.getFullYear().toString();
      }

      const current = salesExpensesMap.get(periodKey) || { totalSales: 0, totalExpenses: 0, netCashFlow: 0 };

      // Verifica se é um gasto ou venda e atualiza os totais
      if ('preco' in item) {
        current.totalExpenses += Math.abs(item.preco || 0);
        current.netCashFlow += (item.preco || 0);
      } else if ('valorFinal' in item) {
        current.totalSales += (item.valorFinal || 0);
        current.netCashFlow += (item.valorFinal || 0);
      }
      salesExpensesMap.set(periodKey, current);
    });

    // Ordena as chaves do map para garantir a ordem cronológica no gráfico
    const sortedPeriodKeys = Array.from(salesExpensesMap.keys()).sort((a, b) => a.localeCompare(b));

    const salesExpensesData: SalesExpensesDataPoint[] = [];
    const cumulativeCashFlowData: CumulativeCashFlowDataPoint[] = [];

    // ***** CORREÇÃO PRINCIPAL AQUI: Adiciona o ponto do investimento inicial como o PRIMEIRO ponto *****
    // Isso garante que o gráfico comece no valor do investimento inicial, se houver.
    if (initialInvestment !== 0) {
      let initialPeriodLabel: string;
      // Determina o rótulo do período para o ponto de investimento inicial, um período antes do primeiro dado.
      if (sortedPeriodKeys.length > 0) {
        const firstPeriodKey = sortedPeriodKeys[0];
        if (aggregationType === 'daily' && selectedMonth) {
          const [year, monthStr, dayStr] = firstPeriodKey.split('-').map(Number);
          const firstDate = new Date(year, monthStr - 1, dayStr);
          firstDate.setDate(firstDate.getDate() - 1); // Dia anterior ao primeiro dado
          const prevMonthPadded = (firstDate.getMonth() + 1).toString().padStart(2, '0'); // <-- CORREÇÃO AQUI
          initialPeriodLabel = `${firstDate.getDate().toString().padStart(2, '0')}/${monthNames[prevMonthPadded] || `Mês ${prevMonthPadded}`}`; // <-- CORREÇÃO AQUI
        } else if (aggregationType === 'monthly') {
          const [year, monthStr] = firstPeriodKey.split('-').map(Number);
          const firstDate = new Date(year, monthStr - 1); // Mês do primeiro dado
          firstDate.setMonth(firstDate.getMonth() - 1); // Mês anterior ao primeiro dado
          const prevMonthPadded = (firstDate.getMonth() + 1).toString().padStart(2, '0'); // <-- CORREÇÃO AQUI
          initialPeriodLabel = `${monthNames[prevMonthPadded] || `Mês ${prevMonthPadded}`} ${firstDate.getFullYear()}`; // <-- CORREÇÃO AQUI
        } else { // yearly
          initialPeriodLabel = (parseInt(selectedYear) - 1).toString(); // Ano anterior ao selecionado
        }
      } else {
        // Se não houver dados, o ponto inicial pode ser o ano anterior ou um rótulo genérico
        initialPeriodLabel = (parseInt(selectedYear) - 1).toString();
      }

      cumulativeCashFlowData.push({
        period: initialPeriodLabel,
        cumulativeCashFlow: initialInvestment,
        netCashFlow: initialInvestment // Útil para o tooltip indicar que é o investimento inicial
      });
    }

    // currentCumulative deve começar do último ponto adicionado (o investimento inicial, se houver)
    // ou de 0 se não houver investimento inicial e nenhum ponto foi adicionado ainda.
    let currentCumulative = cumulativeCashFlowData.length > 0
      ? cumulativeCashFlowData[cumulativeCashFlowData.length - 1].cumulativeCashFlow
      : 0;

    sortedPeriodKeys.forEach(periodKey => {
      const values = salesExpensesMap.get(periodKey)!;

      let displayPeriod: string;
      if (aggregationType === 'daily') {
        const [, monthStr, dayStr] = periodKey.split('-');
        // Aqui monthStr já é 'MM', então basta usá-lo diretamente
        displayPeriod = `${parseInt(dayStr, 10).toString().padStart(2, '0')}/${monthNames[monthStr] || `Mês ${monthStr}`}`; // <-- CORREÇÃO AQUI
      } else if (aggregationType === 'monthly') {
        const [year, monthStr] = periodKey.split('-');
        // Aqui monthStr já é 'MM', então basta usá-lo diretamente
        displayPeriod = `${monthNames[monthStr] || `Mês ${monthStr}`} ${year}`; // <-- CORREÇÃO AQUI
      } else {
        displayPeriod = periodKey; // Para agregação anual, o periodKey já é o ano
      }

      salesExpensesData.push({
        period: displayPeriod,
        totalSales: values.totalSales,
        totalExpenses: Math.abs(values.totalExpenses), // Garante que seja positivo para o gráfico de despesas
      });

      currentCumulative += values.netCashFlow; // Adiciona o fluxo líquido do período
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