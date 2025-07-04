import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface SalesExpensesChartProps {
  // O 'data' virá do nosso hook useDashboardChartsData
  // Cada ponto terá um 'period' (ex: "2025-01"), 'totalSales' e 'totalExpenses'
  data: Array<{ period: string; totalSales: number; totalExpenses: number }>;
}

const SalesExpensesChart: React.FC<SalesExpensesChartProps> = ({ data }) => {
  // Definição de cores que combinam com o tema roxo e branco
  const salesColor = '#673AB7'; // Roxo principal para Vendas
  const expensesColor = '#9C27B0'; // Roxo um pouco diferente/magenta para Despesas
  const gridStrokeColor = '#E0E0E0'; // Cor para as linhas de grade
  const textColor = '#333'; // Cor padrão do texto

  return (
    // ResponsiveContainer garante que o gráfico se ajusta ao tamanho do contêiner pai
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {/* CartesianGrid para linhas de grade */}
        <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
        
        {/* Eixo X: Período (meses/anos) */}
        <XAxis dataKey="period" stroke={textColor} />
        
        {/* Eixo Y: Valores monetários */}
        <YAxis 
          stroke={textColor} 
          tickFormatter={(value: number) => `R$ ${value.toFixed(0)}`} // Formata os valores do eixo Y
        />
        
        {/* Tooltip: Exibe informações ao passar o mouse */}
        <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
        
        {/* Legenda: Identifica as barras do gráfico */}
        <Legend />
        
        {/* Barras para Total Vendas */}
        <Bar 
          dataKey="totalSales" 
          name="Total Vendas" // Nome para a legenda e tooltip
          fill={salesColor} // Cor da barra
        />
        
        {/* Barras para Total Despesas */}
        <Bar 
          dataKey="totalExpenses" 
          name="Total Despesas" // Nome para a legenda e tooltip
          fill={expensesColor} // Cor da barra
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesExpensesChart;