import { ChartCard } from "./ChartCard"

interface ChartInfo {
  id: string
  title: string
  chartType: "bar" | "pie"
  data: any
  options: any
}

interface ChartsDisplayProps {
  sectionTitle: string
  charts: ChartInfo[]
  gridCols?: string
}

export const ChartsDisplay = ({
  sectionTitle,
  charts,
  gridCols = "lg:grid-cols-2",
}: ChartsDisplayProps) => {
  if (!charts.length) return null
  const layout = charts.length === 1
    ? "max-w-4xl mx-auto"
    : `grid grid-cols-1 ${gridCols} gap-6`

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {sectionTitle}
      </h2>
      <div className={layout}>
        {charts.map(c => (
          <ChartCard
            key={c.id}
            title={c.title}
            chartType={c.chartType}
            data={c.data}
            options={c.options}
          />
        ))}
      </div>
    </section>
  )
}
