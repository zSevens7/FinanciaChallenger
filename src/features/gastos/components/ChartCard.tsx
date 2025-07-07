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
  // Se for gráfico de pizza e isFullWidth falso, fica pequeno; senão ocupa largura total
  const containerWidthClass =
    chartType === "pie" && !isFullWidth ? "w-72" : "w-full";

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
          <div className="relative w-full h-full max-w-[350px] max-h-[350px]">
            <Pie data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};
