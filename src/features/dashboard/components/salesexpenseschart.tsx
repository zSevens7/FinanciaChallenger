import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface ChartDataItem {
  name: string; // Ex: "Receita", "Despesas", "Lucro Líquido", "Investimento"
  value: number;
}

interface SalesExpensesChartProps {
  data: ChartDataItem[];
}

const SalesExpensesChart: React.FC<SalesExpensesChartProps> = ({ data }) => {
  const salesColor = "#673AB7"; // Cor principal para Vendas
  const expensesColor = "#9C27B0"; // Cor para Despesas
  const gridStrokeColor = "#E0E0E0";
  const textColor = "#333";

  // Como agora o data é ChartDataItem[], vamos mapear os valores
  // para duas barras: "Receita" e "Despesas"
  const formattedData = [
    {
      name: "Receita",
      value: data.find(d => d.name.toLowerCase() === "receita")?.value || 0
    },
    {
      name: "Despesas",
      value: data.find(d => d.name.toLowerCase() === "despesas")?.value || 0
    },
    {
      name: "Lucro Líquido",
      value: data.find(d => d.name.toLowerCase() === "lucro líquido")?.value || 0
    },
    {
      name: "Investimento",
      value: data.find(d => d.name.toLowerCase() === "investimento")?.value || 0
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
        <XAxis dataKey="name" stroke={textColor} />
        <YAxis
          stroke={textColor}
          tickFormatter={(value: number) => `R$ ${value.toFixed(0)}`}
        />
        <Tooltip
          formatter={(value: number) => `R$ ${value.toFixed(2)}`}
        />
        <Legend />
        <Bar dataKey="value" name="Valor" fill={salesColor} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesExpensesChart;
