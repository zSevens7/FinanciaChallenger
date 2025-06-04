import type { ChartData, ChartOptions } from "chart.js"
import { monthNames } from "../utils/index"
import type { Gasto } from "../types"

export function aggregateByPeriod(
  gastos: Gasto[],
  selectedYear: string,
  selectedMonth: string
) {
  const agg: Record<string, number> = {}
  gastos.forEach(({ data, preco = 0 }) => {
    const [year, month, day] = data.split("-")
    let key = year
    if (selectedYear) {
      key = selectedMonth ? day : month
    }
    agg[key] = (agg[key] || 0) + (preco ?? 0)
  })
  return agg
}

// Agrupa total por categoria
export function aggregateByCategory(gastos: Gasto[]) {
  const agg: Record<string, number> = {}
  gastos.forEach(({ categoria, preco = 0 }) => {
    agg[categoria] = (agg[categoria] || 0) + (preco ?? 0)
  })
  return agg
}

// Agrupa total por tipo de despesa
export function aggregateByTipoDespesa(gastos: Gasto[]) {
  const agg: Record<string, number> = {}
  gastos.forEach(({ tipoDespesa, preco = 0 }) => {
    agg[tipoDespesa] = (agg[tipoDespesa] || 0) + (preco ?? 0)
  })
  return agg
}

// Prepara dados e opções para Chart.js (barra ou pizza conforme `label` opcional)
export function prepareChartData(
  agg: Record<string, number>,
  label?: string
): {
  data: ChartData<"bar" | "pie">
  options: ChartOptions<"bar" | "pie">
} {
  const keys = Object.keys(agg).sort((a, b) => {
    // tenta ordenar numericamente
    const na = parseInt(a, 10), nb = parseInt(b, 10)
    return !isNaN(na) && !isNaN(nb) ? na - nb : a.localeCompare(b)
  })

  const labels = keys.map(k =>
    // converte mês/dia para texto amigável quando cabível
    monthNames[k] || k
  )
  const values = keys.map(k => agg[k])

  // paleta simples para barras/pizza
  const palette = [
  "#E6E6FA",
  "#D8BFD8", 
  "#DDA0DD", 
  "#BA55D3", 
  "#9932CC", 
  "#8A2BE2", 
  "#6A0DAD", 
  "#4B0082", 
]
  const backgroundColor = values.map((_, i) => palette[i % palette.length])
  const borderColor = backgroundColor.map(c => c.replace(/0+$/, "1"))

  return {
    data: {
      labels,
      datasets: [
        {
          label: label || "",
          data: values,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
      },
      scales: {
        ...(label
          ? { // eixo Y apenas em charts de barra
              y: { beginAtZero: true },
            }
          : {}),
      },
    },
  }
}
