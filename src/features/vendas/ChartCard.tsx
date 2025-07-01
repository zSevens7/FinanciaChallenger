
import { Bar, Pie, Line } from 'react-chartjs-2' // <-- IMPORTAR 'Line' AQUI!

// Importar e registrar os elementos do Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement, // <-- REGISTRAR 'LineElement' AQUI!
  TimeScale    // <-- REGISTRAR 'TimeScale' AQUI!
} from 'chart.js'

// Registro dos elementos do Chart.js (faça apenas UMA VEZ globalmente ou no seu arquivo Chart.js de configuração)
// Se você já tem isso em outro lugar (ex: um arquivo de configuração do Chart.js), pode remover daqui.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement, // <-- Adicionar
  TimeScale    // <-- Adicionar
)

interface ChartCardProps {
  title: string
  chartType: "bar" | "pie" | "line" // <-- ATUALIZAR ESTA LINHA PARA INCLUIR 'line'!
  data: any
  options: any
}

export const ChartCard = ({ title, chartType, data, options }: ChartCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">{title}</h3>
      <div className="relative w-full h-64 flex justify-center items-center"> {/* Container para o gráfico */}
        {chartType === 'bar' && <Bar data={data} options={options} />}
        {chartType === 'pie' && <Pie data={data} options={options} />}
        {chartType === 'line' && <Line data={data} options={options} />} {/* <-- ADICIONAR ESTA LINHA! */}
        {data.datasets[0]?.data.length === 0 && (
          <p className="absolute text-center text-gray-500">Nenhum dado para exibir.</p>
        )}
      </div>
    </div>
  )
}