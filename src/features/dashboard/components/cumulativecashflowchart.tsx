import React from "react";
import {
  AreaChart,
  Area,
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

interface CumulativeCashFlowChartProps {
  data: ChartDataItem[];
}

const CumulativeCashFlowChart: React.FC<CumulativeCashFlowChartProps> = ({ data }) => {
  const lineColor = "#673AB7";
  const areaFillColor = "#9C27B0";
  const zeroLineStroke = "#E0E0E0";
  const tooltipBgColor = "white";
  const tooltipBorderColor = "#ccc";
  const textColor = "#333";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div
          style={{
            backgroundColor: tooltipBgColor,
            border: `1px solid ${tooltipBorderColor}`,
            padding: "10px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <p style={{ color: textColor, margin: 0, marginBottom: "5px" }}>{`Categoria: ${item.name}`}</p>
          <p style={{ color: lineColor, margin: 0 }}>{`Valor: R$ ${item.value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={zeroLineStroke} />
        <XAxis dataKey="name" stroke={textColor} />
        <YAxis
          stroke={textColor}
          tickFormatter={(value: number) => `R$ ${value.toFixed(0)}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        <defs>
          <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={areaFillColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={areaFillColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dataKey="value"
          name="Saldo Líquido"
          stroke={lineColor}
          fillOpacity={1}
          fill="url(#colorCumulative)"
          activeDot={{ stroke: lineColor, strokeWidth: 2, r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CumulativeCashFlowChart;
