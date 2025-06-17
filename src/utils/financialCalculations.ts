// src/utils/financialCalculations.ts
import type { Gasto, Venda } from '../hooks/useLocalStorageData';

import { Finance } from 'financejs'; 

const finance = new Finance(); 

interface CashFlowPeriod {
  period: string; 
  netCashFlow: number;
}

export const aggregateCashFlows = (
  gastos: Gasto[],
  vendas: Venda[],
  periodType: 'monthly' | 'yearly'
): CashFlowPeriod[] => {
  const cashFlowMap = new Map<string, number>();

  vendas.forEach(v => {
    const date = new Date(v.data);
    let period: string;
    if (periodType === 'monthly') {
      period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } else {
      period = date.getFullYear().toString();
    }
    cashFlowMap.set(period, (cashFlowMap.get(period) || 0) + (v.valorFinal || 0));
  });

  gastos.forEach(g => {
    const date = new Date(g.data);
    let period: string;
    if (periodType === 'monthly') {
      period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } else {
      period = date.getFullYear().toString();
    }
    cashFlowMap.set(period, (cashFlowMap.get(period) || 0) - (g.preco || 0)); 
  });

  const cashFlows: CashFlowPeriod[] = Array.from(cashFlowMap.entries())
    .map(([period, netCashFlow]) => ({ period, netCashFlow }))
    .sort((a, b) => a.period.localeCompare(b.period)); 

  return cashFlows;
};


export const calculatePayback = (cashFlows: CashFlowPeriod[], initialInvestment: number): number => {
  if (initialInvestment >= 0) { 
    console.warn("Payback Warning: initialInvestment should be negative. Received:", initialInvestment);
    return Infinity; 
  }
  if (cashFlows.length === 0) return Infinity; 

  let cumulativeCashFlow = initialInvestment; 
  let periods = 0; 

  for (let i = 0; i < cashFlows.length; i++) {
    cumulativeCashFlow += cashFlows[i].netCashFlow;
    periods++;
    if (cumulativeCashFlow >= 0) {
      if (cashFlows[i].netCashFlow > 0) { 
        return periods - (cumulativeCashFlow / cashFlows[i].netCashFlow); 
      } else {
        return periods; 
      }
    }
  }
  return Infinity; 
};

export const calculateTIR = (cashFlows: CashFlowPeriod[], initialInvestment: number): number | null => {
  const numericalCashFlows = [initialInvestment, ...cashFlows.map(cf => cf.netCashFlow)];

  const hasPositiveFlow = numericalCashFlows.some(cf => cf > 0);
  const hasNegativeFlow = numericalCashFlows.some(cf => cf < 0);

  if (numericalCashFlows.length < 2 || !hasPositiveFlow || !hasNegativeFlow) {
    console.warn("TIR Warning: Fluxos de caixa insuficientes ou inválidos para calcular TIR. Valores:", numericalCashFlows);
    return null;
  }

  try {
    // Cria um array único contendo todos os fluxos de caixa e o guess
    const irrArguments = [...numericalCashFlows, 0.1];

    // CORREÇÃO: Usa Function.prototype.apply para chamar IRR com o array de argumentos.
    // Isso contorna as restrições de tipagem do operador spread para esta função específica.
    const tirPercentage = (finance.IRR as any).apply(finance, irrArguments);
    
    if (typeof tirPercentage === 'number' && !isNaN(tirPercentage) && isFinite(tirPercentage)) {
        return tirPercentage / 100; // Converte para decimal
    }
    console.warn("TIR Warning: O cálculo da TIR resultou em um valor inválido (NaN ou Infinito). Valores:", numericalCashFlows);
    return null;
  } catch (error) {
    console.error("Erro ao calcular TIR. Verifique a biblioteca 'financejs' e o padrão dos fluxos de caixa:", error);
    return null;
  }
};