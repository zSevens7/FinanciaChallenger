// src/services/agreggation.ts

import type { ChartData, ChartOptions } from "chart.js";
import { monthNames } from "../utils/index";
import type { Gasto } from "../types/index";
import type { Venda } from "../types/index";

export type AggregationType = 'daily' | 'monthly' | 'yearly' | 'category' | 'type';

// --- Funções de Agregação para GASTOS ---
export function aggregateByPeriod(
  items: Gasto[],
  selectedYear: string,
  selectedMonth: string,
  aggregationType: 'daily' | 'monthly' | 'yearly'
): Record<string, number> {
  // ✅ CORREÇÃO: Verificação de segurança para items
  if (!items || !Array.isArray(items)) {
    return {};
  }

  const agg: Record<string, number> = {};

  if (aggregationType === 'monthly') {
    for (let i = 1; i <= 12; i++) {
      const monthKey = i.toString().padStart(2, '0');
      agg[monthKey] = 0;
    }
  } else if (aggregationType === 'daily' && selectedMonth) {
    const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = day.toString().padStart(2, '0');
      agg[dayKey] = 0;
    }
  }

  items.forEach(({ data, preco = 0 }) => {
    // ✅ CORREÇÃO: Verificação de segurança para data
    if (!data) return;
    
    const [year, month, day] = data.split("-");
    let key: string;

    if (aggregationType === 'daily') {
      if (selectedYear && year !== selectedYear) return;
      if (selectedMonth && month !== selectedMonth) return;
      key = day;
    } else if (aggregationType === 'monthly') {
      if (selectedYear && year !== selectedYear) return;
      key = month;
    } else { // aggregationType === 'yearly'
      key = year;
    }

    // ✅ CORREÇÃO: Verificação de segurança para key
    if (key) {
      agg[key] = (agg[key] || 0) + (preco ?? 0);
    }
  });
  return agg;
}

export function aggregateByCategory(items: Gasto[]): Record<string, number> {
  // ✅ CORREÇÃO: Verificação de segurança para items
  if (!items || !Array.isArray(items)) {
    return {};
  }

  const agg: Record<string, number> = {};
  items.forEach(({ categoria, preco = 0 }) => {
    // ✅ CORREÇÃO: Verificação de segurança para categoria
    if (categoria) {
      agg[categoria] = (agg[categoria] || 0) + (preco ?? 0);
    }
  });
  return agg;
}

export function aggregateByTipoDespesa(items: Gasto[]): Record<string, number> {
  // ✅ CORREÇÃO: Verificação de segurança para items
  if (!items || !Array.isArray(items)) {
    return {};
  }

  const agg: Record<string, number> = {};
  items.forEach(({ tipoDespesa, preco = 0 }) => {
    // ✅ CORREÇÃO: Verificação de segurança para tipoDespesa
    if (tipoDespesa) {
      agg[tipoDespesa] = (agg[tipoDespesa] || 0) + (preco ?? 0);
    }
  });
  return agg;
}

// --- Funções de Agregação para VENDAS ---
export function aggregateSalesByCourseType(vendas: Venda[]): Record<string, number> {
  // ✅ CORREÇÃO: Verificação de segurança para vendas
  if (!vendas || !Array.isArray(vendas)) {
    return {};
  }

  const agg: Record<string, number> = {};
  vendas.forEach(venda => {
    const type = venda.tipoVenda || "Outros";
    agg[type] = (agg[type] || 0) + (venda.preco ?? 0);
  });
  return agg;
}

export function aggregateSalesByPeriod(
  vendas: Venda[],
  selectedYear: string,
  selectedMonth: string,
  aggregationType: 'daily' | 'monthly' | 'yearly'
): Record<string, number> {
  // ✅ CORREÇÃO: Verificação de segurança para vendas
  if (!vendas || !Array.isArray(vendas)) {
    return {};
  }

  const agg: Record<string, number> = {};

  if (aggregationType === 'monthly') {
    for (let i = 1; i <= 12; i++) {
      const monthKey = i.toString().padStart(2, '0');
      agg[monthKey] = 0;
    }
  } else if (aggregationType === 'daily' && selectedMonth) {
    const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = day.toString().padStart(2, '0');
      agg[dayKey] = 0;
    }
  }

  vendas.forEach(venda => {
    // ✅ CORREÇÃO: Verificação de segurança para data
    if (!venda.data) return;
    
    const [year, month, day] = venda.data.split("-");
    let key: string;

    if (aggregationType === 'daily') {
      if (selectedYear && year !== selectedYear) return;
      if (selectedMonth && month !== selectedMonth) return;
      key = day;
    } else if (aggregationType === 'monthly') {
      if (selectedYear && year !== selectedYear) return;
      key = month;
    } else { // aggregationType === 'yearly'
      key = year;
    }

    // ✅ CORREÇÃO: Verificação de segurança para key
    if (key) {
      agg[key] = (agg[key] || 0) + (venda.preco ?? 0);
    }
  });

  return agg;
}

// --- Função Genérica para Preparar Dados e Opções do Gráfico ---
export function prepareChartData(
  agg: Record<string, number>,
  label: string,
  chartType: "bar" | "pie" | "line",
  aggregationType: AggregationType
): {
  data: ChartData<"bar" | "pie" | "line">;
  options: ChartOptions<"bar" | "pie" | "line">;
} {
  // ✅ CORREÇÃO: Verificação de segurança para agg
  if (!agg || typeof agg !== 'object') {
    // Retorna estrutura vazia se agg for inválido
    return {
      data: { labels: [], datasets: [] },
      options: {}
    };
  }

  const keys = Object.keys(agg).sort((a, b) => {
    const na = parseInt(a, 10);
    const nb = parseInt(b, 10);

    if (!isNaN(na) && !isNaN(nb) && ['daily', 'monthly', 'yearly'].includes(aggregationType)) {
        return na - nb;
    }
    return a.localeCompare(b);
  });

  const labels = keys.map(k => {
    if (aggregationType === 'monthly') {
      return monthNames[k] || k;
    } else if (aggregationType === 'daily') {
      return k;
    } else if (aggregationType === 'yearly') {
        return k;
    }
    return k;
  });
  
  const values = keys.map(k => agg[k]);

  const palette = [
    "#00b894", // verde
    "#0984e3", // azul
    "#fdcb6e", // amarelo
    "#d63031", // vermelho
    "#6c5ce7", // roxo
    "#e17055", // laranja
    "#2d3436", // cinza escuro
    "#fab1a0", // rosa claro
  ];

  const backgroundColors = values.map((_, i) => palette[i % palette.length]);
  const borderColors = backgroundColors.map(c => c);

  const chartOptions: ChartOptions<"bar" | "pie" | "line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: '#333',
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== undefined) {
                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            } else if (context.parsed !== undefined && chartType === 'pie') {
                const total = context.dataset.data.reduce((sum: number, current: number) => sum + current, 0);
                const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(2) + '%' : '0.00%';
                label = `${context.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed)} (${percentage})`;
            }
            return label;
          }
        }
      },
    },
    scales: chartType === "bar" || chartType === "line" ? {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valor (R$)',
          color: '#333',
        },
        ticks: {
          color: '#333',
          callback: function(value: any) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        title: {
          display: true,
          text: (
            aggregationType === 'daily' ? 'Dia do Mês' :
            (aggregationType === 'monthly' ? 'Mês' :
            (aggregationType === 'yearly' ? 'Ano' :
            (aggregationType === 'category' ? 'Tipo de Venda' :
            (aggregationType === 'type' ? 'Tipo de Despesa' : 'Item'))))
          ),
          color: '#333',
        },
        ticks: {
          color: '#333',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
    } : undefined,
  };

  return {
    data: {
      labels,
      datasets: [
        {
          label: label,
          data: values,
          backgroundColor: chartType === "pie" ? backgroundColors : backgroundColors[0],
          borderColor: chartType === "pie" ? borderColors : borderColors[0],
          borderWidth: 1,
        },
      ],
    },
    options: chartOptions,
  };
}