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
  gridCols = "lg:grid-cols-2", // Mantém o padrão flexível para telas grandes
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
                  // Para o gráfico de evolução, ele já é full width e grande por padrão.
                  isFullWidth={true} // Força a largura total para gráficos de barra únicos
                />
              </div>
            );
          } else if (charts.length === 2) {
            // Renderizar ambos juntos dentro de um grid container único por par
            if (index === 0) {
              const barChart = charts[0];
              const pieChart = charts[1];

              return (
                <div
                  key={"chart-pair-" + barChart.id + "-" + pieChart.id}
                  className="col-span-full max-w-6xl mx-auto w-full h-auto flex flex-col md:flex-row gap-6 items-stretch" // Adicionado max-w-6xl e items-stretch
                >
                  <div className="flex-1 min-h-[350px] md:min-h-[450px] flex items-center justify-center"> {/* Aumentado min-h para desktop */}
                    <ChartCard
                      title={barChart.title}
                      chartType={barChart.chartType}
                      data={barChart.data}
                      options={barChart.options}
                      isFullWidth={true} // Garante que o gráfico de barra ocupe o espaço disponível
                    />
                  </div>
                  {/*
                    Ajuste a largura do contêiner do gráfico de pizza aqui.
                    Em mobile (w-full), em desktop (md:w-1/2 ou md:w-[450px] por exemplo).
                    min-h ajuda a garantir que o card tenha uma altura mínima.
                  */}
                  <div className="w-full md:w-1/2 lg:w-[450px] min-h-[350px] md:min-h-[450px] flex items-center justify-center"> {/* <-- CORREÇÃO AQUI */}
                    <ChartCard
                      title={pieChart.title}
                      chartType={pieChart.chartType}
                      data={pieChart.data}
                      options={pieChart.options}
                      isFullWidth={true} // <-- Passa true para que o ChartCard não aplique w-72 fixo
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

          // Caso geral para gráficos únicos que não sejam "evolucao-periodo"
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
                // Ajuste para garantir que outros gráficos sejam full-width se necessário
                isFullWidth={c.chartType === "bar"} // Ou defina como true para todos os gráficos que devem expandir
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};