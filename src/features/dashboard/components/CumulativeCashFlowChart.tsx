import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface CumulativeCashFlowChartProps {
  // O 'data' virá do nosso hook useDashboardChartsData
  // Cada ponto terá um 'period' (ex: "2025-01") e 'cumulativeCashFlow' (o saldo)
  // O 'netCashFlow' é opcional, mas útil para exibir no tooltip
  data: Array<{ period: string; cumulativeCashFlow: number; netCashFlow?: number }>;
}

const CumulativeCashFlowChart: React.FC<CumulativeCashFlowChartProps> = ({ data }) => {
  // Definição de cores que combinam com o tema roxo e branco
  const lineColor = '#673AB7'; // Roxo principal para a linha
  const areaFillColor = '#9C27B0'; // Roxo um pouco diferente para o preenchimento da área
  const zeroLineStroke = '#E0E0E0'; // Cor para a linha zero (neutra)
  const tooltipBgColor = 'white'; // Fundo do tooltip
  const tooltipBorderColor = '#ccc'; // Borda do tooltip
  const textColor = '#333'; // Cor padrão do texto

  // Customização do Tooltip para exibir informações mais detalhadas
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Encontra os valores de cumulativeCashFlow e netCashFlow dentro do payload
      const cumulative = payload.find((p: any) => p.dataKey === 'cumulativeCashFlow')?.value;
      const net = payload.find((p: any) => p.dataKey === 'netCashFlow')?.value;
      
      return (
        <div style={{ 
          backgroundColor: tooltipBgColor, 
          border: `1px solid ${tooltipBorderColor}`, 
          padding: '10px', 
          borderRadius: '4px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <p style={{ color: textColor, margin: 0, marginBottom: '5px' }}>{`Período: ${label}`}</p>
          {/* Exibe o fluxo líquido se disponível */}
          {net !== undefined && <p style={{ color: textColor, margin: 0, marginBottom: '5px' }}>{`Fluxo Líquido: R$ ${net.toFixed(2)}`}</p>}
          {/* Exibe o saldo acumulado */}
          <p style={{ color: lineColor, margin: 0 }}>{`Saldo Acumulado: R$ ${cumulative.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    // ResponsiveContainer garante que o gráfico se ajusta ao tamanho do contêiner pai
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {/* CartesianGrid para linhas de grade, ajudando na leitura */}
        <CartesianGrid strokeDasharray="3 3" stroke={zeroLineStroke} />
        
        {/* Eixo X: Período (meses/anos) */}
        <XAxis dataKey="period" stroke={textColor} />
        
        {/* Eixo Y: Saldo Acumulado */}
        <YAxis 
          stroke={textColor} 
          tickFormatter={(value: number) => `R$ ${value.toFixed(0)}`} // Formata os valores do eixo Y como moeda
        />
        
        {/* Tooltip: Exibe informações ao passar o mouse */}
        <Tooltip content={<CustomTooltip />} />
        
        {/* Legenda: Identifica as séries do gráfico */}
        <Legend />
        
        {/* Definição de gradiente para o preenchimento da área (opcional, para um visual mais suave) */}
        <defs>
          <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={areaFillColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={areaFillColor} stopOpacity={0}/>
          </linearGradient>
        </defs>

        {/* A série de dados principal para o saldo acumulado */}
        <Area 
          type="monotone" // Curva suave
          dataKey="cumulativeCashFlow" 
          name="Saldo Líquido Acumulado" // Nome para a legenda e tooltip
          stroke={lineColor} // Cor da linha
          fillOpacity={1} 
          fill="url(#colorCumulative)" // Preenchimento com o gradiente definido
          activeDot={{ stroke: lineColor, strokeWidth: 2, r: 5 }} // Ponto ativo no hover
        />
        
        {/* Você pode adicionar uma linha de referência para o eixo zero para destacar o payback
            <ReferenceLine y={0} stroke={accentColor} strokeDasharray="3 3" /> 
        */}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CumulativeCashFlowChart;