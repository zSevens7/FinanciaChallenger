// src/utils/financialCalculations.ts

// --- DEFINIÇÕES DE TIPO ATUALIZADAS ---
// Agora compatíveis com a estrutura dos Contexts
export interface Gasto {
    id: string;
    data: string;
    preco: number; // ✅ CORREÇÃO: Propriedade alterada para 'preco'
    tipo: string;
    descricao?: string;
    comentario?: string;
}

export interface Venda {
    id: string;
    data: string;
    valor: number; // Propriedade 'valor'
    categoria: string;
    descricao: string;

    // ✅ Adicionado para compatibilidade com useDashboardChartsData
    tipoVenda?: string; // padrão "venda"
    preco?: number;     // igual a valor
}

export interface CashFlowPeriod {
    period: string; // Ex: "2024-10" ou "2024"
    netCashFlow: number;
}


// --- FUNÇÕES DE CÁLCULO FINANCEIRO ---

/**
 * Agrega vendas e gastos em um fluxo de caixa líquido por período (mês ou ano).
 * @param gastos - Array de objetos de gastos. O valor 'preco' já deve ser negativo.
 * @param vendas - Array de objetos de vendas.
 * @param periodType - Agrupamento por 'monthly' ou 'yearly'.
 * @returns Um array de objetos de fluxo de caixa, ordenado por período.
 */
export const aggregateCashFlows = (
    gastos: Gasto[],
    vendas: Venda[],
    periodType: 'monthly' | 'yearly'
): CashFlowPeriod[] => {
    const cashFlowMap = new Map<string, number>();

    // 1. Agregar VENDAS (entradas de caixa)
    vendas.forEach(v => {
        const date = new Date(v.data);
        const period = periodType === 'monthly'
            ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
            : date.getFullYear().toString();

        const valor = v.valor; 
        cashFlowMap.set(period, (cashFlowMap.get(period) || 0) + valor);
    });

    // 2. Agregar GASTOS (saídas de caixa)
    gastos.forEach(g => {
        const date = new Date(g.data);
        const period = periodType === 'monthly'
            ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
            : date.getFullYear().toString();

        const preco = g.preco; // ✅ CORREÇÃO: O valor agora é 'preco'
        cashFlowMap.set(period, (cashFlowMap.get(period) || 0) + preco);
    });

    // 3. Converter o Map para um array e ordenar por período
    const cashFlows: CashFlowPeriod[] = Array.from(cashFlowMap.entries())
        .map(([period, netCashFlow]) => ({ period, netCashFlow }))
        .sort((a, b) => a.period.localeCompare(b.period));

    console.log('Dados agregados de Fluxo de Caixa (aggregateCashFlows):', cashFlows); // DEBUG
    return cashFlows;
};

/**
 * Calcula a Taxa Interna de Retorno (TIR) para uma série de fluxos de caixa.
 * @param cashFlows - Array de fluxos de caixa periódicos.
 * @param initialInvestment - O investimento inicial (valor positivo).
 * @returns A TIR como uma porcentagem (ex: 0.15 para 15%).
 */
export const calculateTIR = (
    cashFlows: CashFlowPeriod[],
    initialInvestment: number
): number => {
    console.log('Iniciando cálculo de TIR...'); // DEBUG
    console.log('    initialInvestment para TIR:', initialInvestment); // DEBUG
    console.log('    cashFlows para TIR:', cashFlows); // DEBUG

    // Create the numerical cash flow array, starting with the negative initial investment
    const numericalCashFlows = [-initialInvestment, ...cashFlows.map(cf => cf.netCashFlow)];
    console.log('    numericalCashFlows para TIR:', numericalCashFlows); // DEBUG
    
    // Implementation of IRR (iteration method)
    const maxIterations = 1000;
    const precision = 1.0e-6;
    let guess = 0.1; // Initial guess of 10%

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let derivative = 0;
        
        for (let t = 0; t < numericalCashFlows.length; t++) {
            npv += numericalCashFlows[t] / Math.pow(1 + guess, t);
            if (t > 0) { // Derivative for t=0 is 0
                derivative -= (t * numericalCashFlows[t]) / Math.pow(1 + guess, t + 1);
            }
        }
        
        // Avoid division by zero for derivative
        if (derivative === 0) {
            console.warn('    Derivada é zero, TIR não pode ser calculada.'); // DEBUG
            return NaN;
        }

        const newGuess = guess - npv / derivative;
        
        console.log(`    Iteração ${i}: guess=${guess}, npv=${npv}, derivative=${derivative}, newGuess=${newGuess}`); // DEBUG

        if (Math.abs(newGuess - guess) < precision) {
            console.log('    TIR Convergiu:', newGuess); // DEBUG
            return newGuess;
        }
        guess = newGuess;
    }
    
    console.warn('    TIR não convergiu após', maxIterations, 'iterações.'); // DEBUG
    return NaN; // Return NaN if it doesn't converge
};

/**
 * Calcula o período de Payback Simples.
 * @param cashFlows - Array de fluxos de caixa periódicos.
 * @param initialInvestment - O investimento inicial (valor positivo).
 * @returns O número de períodos para recuperar o investimento, ou 'Nunca' se não for recuperado.
 */
export const calculatePayback = (
    cashFlows: CashFlowPeriod[],
    initialInvestment: number
): number | string => {
    console.log('Iniciando cálculo de Payback...'); // DEBUG
    console.log('    initialInvestment para Payback:', initialInvestment); // DEBUG
    console.log('    cashFlows para Payback:', cashFlows); // DEBUG

    let cumulativeCashFlow = -initialInvestment;
    console.log('    cumulativeCashFlow inicial:', cumulativeCashFlow); // DEBUG
    
    for (let i = 0; i < cashFlows.length; i++) {
        cumulativeCashFlow += cashFlows[i].netCashFlow;
        console.log(`    Período ${cashFlows[i].period}: netCashFlow=${cashFlows[i].netCashFlow}, cumulativeCashFlow=${cumulativeCashFlow}`); // DEBUG
        if (cumulativeCashFlow >= 0) {
            console.log('    Payback encontrado no período:', i + 1); // DEBUG
            return i + 1;
        }
    }

    console.log('    Investimento não recuperado dentro dos períodos fornecidos.'); // DEBUG
    return 'Não recuperado'; // If the loop finishes and the value is still negative
};