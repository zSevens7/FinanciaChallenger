import { ChartCard } from "./ChartCard";

interface ChartInfo {
  id: string;
  title: string;
  chartType: "bar" | "pie";
  data: any;
  options: any;
}

interface ChartsDisplayProps {
  sectionTitle: string;
  charts: ChartInfo[];
  gridCols?: string;
}

export const ChartsDisplay = ({
  sectionTitle,
  charts,
  gridCols = "lg:grid-cols-2",
}: ChartsDisplayProps) => {
  if (!charts.length) return null;

  const mainGridContainerClasses = `
    grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 ${gridCols}
    gap-6
    mx-auto
    w-full
  `;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 pt-8 text-center">
        {sectionTitle}
      </h2>
      <div className={mainGridContainerClasses}>
        {charts.map((c, index) => {
          if (charts.length === 1 && c.id === "evolucao-periodo") {
            return (
              <div
                key={c.id}
                className={`
                  col-span-full
                  max-w-5xl mx-auto
                  w-full
                  h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px]
                  flex items-center justify-center
                `}
              >
                <ChartCard
                  title={c.title}
                  chartType={c.chartType}
                  data={c.data}
                  options={c.options}
                />
              </div>
            );
          } else if (charts.length === 2) {
            const isBarChart = c.chartType === "bar";
            const isPieChart = c.chartType === "pie";

            // Renderizar ambos juntos dentro de um grid container único por par
            if (index === 0) {
          const barChart = charts[0];
          const pieChart = charts[1];

                    return (
                      <div
                        key={"chart-pair-" + barChart.id + "-" + pieChart.id}
                        className="col-span-full max-w-5xl mx-auto w-full h-auto flex flex-col md:flex-row gap-6"
                      >
                        <div className="flex-1 min-h-[350px] flex items-center justify-center">
                          <ChartCard
                            title={barChart.title}
                            chartType={barChart.chartType}
                            data={barChart.data}
                            options={barChart.options}
                          />
                        </div>
                        <div className="w-full md:w-[320px] min-h-[350px] flex items-center justify-center">
                          <ChartCard
                            title={pieChart.title}
                            chartType={pieChart.chartType}
                            data={pieChart.data}
                            options={pieChart.options}
                          />
                        </div>
                      </div>
                    );
                  }

            // Pula a segunda porque já renderizou o par todo no índice 0
            else {
              return null;
            }
          }

          return (
            <div
              key={c.id}
              className={`
                w-full
                h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]
                flex items-center justify-center
              `}
            >
              <ChartCard
                title={c.title}
                chartType={c.chartType}
                data={c.data}
                options={c.options}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
