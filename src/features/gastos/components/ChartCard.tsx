// ChartCard.tsx
import { Bar, Pie } from "react-chartjs-2";

export interface ChartCardProps {
  title: string;
  chartType: "bar" | "pie";
  data: any;
  options: any;
  isFullWidth?: boolean; // prop opcional para controlar largura
}

export const ChartCard = ({
  title,
  chartType,
  data,
  options,
  isFullWidth = false,
}: ChartCardProps) => {
  // Se isFullWidth for true, ChartCard sempre ocupa a largura total do seu pai.
  // A lógica `w-72` só é aplicada se isFullWidth for false.
  const containerWidthClass = isFullWidth ? "w-full" : (chartType === "pie" ? "w-72" : "w-full");

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 h-full flex flex-col justify-between ${containerWidthClass}`}
    >
      <h3 className="text-lg font-semibold mb-3 text-center">{title}</h3>

      <div className="flex-1 flex items-center justify-center">
        {chartType === "bar" ? (
          <div className="relative w-full h-full">
            <Bar data={data} options={options} />
          </div>
        ) : (
          // Ajuste o max-w e max-h para permitir que o círculo do gráfico de pizza cresça
          <div className="relative w-full h-full max-w-[400px] max-h-[400px]"> {/* <-- AUMENTADO AQUI */}
            <Pie data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};