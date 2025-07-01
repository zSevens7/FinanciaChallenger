
import { Bar, Pie, Line } from 'react-chartjs-2'; // <-- IMPORTAR 'Line' AQUI!

// Importe e registre o Chart.js aqui se não estiver fazendo isso globalmente
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
  LineElement,
  TimeScale
} from 'chart.js';

// REGISTRO DOS ELEMENTOS DO CHART.JS: MUITO IMPORTANTE!
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  TimeScale
);


interface ChartItem {
  id: string;
  title: string;
  chartType: 'bar' | 'pie' | 'line';
  data: any;
  options: any;
}

interface ChartsDisplayProps {
  sectionTitle: string;
  charts: ChartItem[];
  gridCols?: string;
  className?: string; // <-- **ADICIONE ESTA LINHA AQUI!** Tornando-a opcional.
}

export const ChartsDisplay = ({ sectionTitle, charts, gridCols = "grid-cols-1 md:grid-cols-2", className }: ChartsDisplayProps) => { // <-- Certifique-se de que 'className' é desestruturado aqui
  return (
    // Aplique a classe aqui ao elemento raiz do componente.
    // Usamos template literals para combinar as classes existentes com a nova prop.
    <section className={`mb-8 p-4 bg-gray-50 rounded-lg shadow-lg ${className || ''}`}>
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-6 border-b pb-3 border-purple-300">
        {sectionTitle}
      </h2>
      <div className={`grid gap-6 ${gridCols}`}>
        {charts.map((chart) => (
          <div key={chart.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">{chart.title}</h3>
            <div className="relative w-full h-64 flex justify-center items-center">
                {chart.chartType === 'bar' && <Bar data={chart.data} options={chart.options} />}
                {chart.chartType === 'pie' && <Pie data={chart.data} options={chart.options} />}
                {chart.chartType === 'line' && <Line data={chart.data} options={chart.options} />}
            </div>
            {chart.data.datasets[0]?.data.length === 0 && (
              <p className="text-center text-gray-500 mt-4">Nenhum dado para exibir.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};