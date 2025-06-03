import { Bar, Pie } from "react-chartjs-2"

interface ChartCardProps {
  title: string
  chartType: "bar" | "pie"
  data: any
  options: any
}

export const ChartCard = ({
  title,
  chartType,
  data,
  options,
}: ChartCardProps) => (
  <div className="bg-white rounded-lg shadow-lg p-4">
    <h3 className="text-lg font-semibold mb-3 text-center">{title}</h3>
    {chartType === "bar"
      ? <Bar data={data} options={options}/>
      : <Pie data={data} options={options}/>}
  </div>
)
