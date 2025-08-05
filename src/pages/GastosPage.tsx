import { useState, useEffect, useCallback, useMemo } from "react";
import {
  aggregateByPeriod,
  aggregateByCategory,
  aggregateByTipoDespesa,
  prepareChartData,
} from "../services/agreggation"; // Certifique-se que prepareChartData existe e retorna { data, options }

import { ActionButtons } from "../features/gastos/components/ActionButtons";
import { FilterControls } from "../features/gastos/components/FilterControls";
import { SummarySection } from "../features/gastos/components/SummarysSection";
import { GastosTable } from "../features/gastos/components/GastosTable";
import { Pagination } from "../features/gastos/components/Pagination";
import { ChartsDisplay } from "../features/gastos/components/ChartsDisplay";
import ModalGasto from "../components/ModalGasto";
import ConfirmModal from "../components/ConfirmModal";

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
  TimeScale,
} from 'chart.js';
import PageContainer from "../features/gastos/components/PageContainer";

import { usePageHeader } from "../contexts/HeaderContext";

// Registro dos componentes do Chart.js
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

export const GastosPage = () => {
  const [gastos, setGastos] = useState<any[]>([]); // Considere usar um tipo mais específico como `Gasto[]`
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { setPageHeader } = usePageHeader();

  const refresh = useCallback(() => {
    const data = JSON.parse(localStorage.getItem("gastos") || "[]");
    data.sort(
      (a: any, b: any) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
    );
    setGastos(data);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const clearAll = () => {
    localStorage.removeItem("gastos");
    setYear("");
    setMonth("");
    setPage(1);
    refresh();
    setShowConfirm(false);
  };

  const handleAdicionarGasto = useCallback(() => setShowModal(true), []);
  const handleLimparDadosGastos = useCallback(() => setShowConfirm(true), []);



  // Determine o tipo de agregação para os gráficos baseados nos filtros
  const aggregationType: 'daily' | 'monthly' | 'yearly' = useMemo(() => {
    if (month && year) return 'daily';
    if (year) return 'monthly';
    return 'yearly'; // Ajuste 'prepareChartData' e 'aggregateByPeriod' para lidar com 'yearly'
  }, [year, month]);


  const filtered = useMemo(() => {
    return gastos.filter((g) => {
      const gDate = new Date(g.data);
      const gYear = gDate.getFullYear().toString();
      const gMonth = (gDate.getMonth() + 1).toString().padStart(2, '0');

      const matchesYear = !year || gYear === year;
      const matchesMonth = !month || gMonth === month;

      return matchesYear && matchesMonth;
    });
  }, [gastos, year, month]);

  const totalPages = Math.ceil(filtered.length / 5);
  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * 5, page * 5);
  }, [filtered, page]);

  const totalAcum = useMemo(() => {
    return filtered.reduce((sum, g) => sum + (g.preco || 0), 0);
  }, [filtered]);

  const periodAgg = useMemo(
    () => aggregateByPeriod(gastos, year, month, aggregationType),
    [gastos, year, month, aggregationType]
  );
  
  const catAgg = useMemo(
    () => aggregateByCategory(filtered),
    [filtered]
  );
  const tipoAgg = useMemo(
    () => aggregateByTipoDespesa(filtered),
    [filtered]
  );





  // --- OPÇÕES PADRÃO PARA GRÁFICOS DE BARRA ---
  // Essas opções serão sobrescritas ou mescladas com as de prepareChartData
  const defaultBarChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false, // CRÍTICO para que o gráfico preencha o contêiner
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 10, // Menor fonte para mobile
          },
          padding: 5,
        },
        grid: {
          display: false, // Remover linhas de grade verticais
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10, // Menor fonte para mobile
          },
        },
      },
    },
  }), []); // Memoiza para evitar recriação desnecessária

  // --- OPÇÕES PADRÃO PARA GRÁFICOS DE PIZZA ---
  const defaultPieChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false, // CRÍTICO para que o gráfico preencha o contêiner
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      title: { // Título para PIE charts
        display: true,
      }
    },
  }), []); // Memoiza para evitar recriação desnecessária


  return (
    <PageContainer>
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-6">
        <SummarySection totalAcumulado={totalAcum} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Filtros de Ano/Mês */}
              <FilterControls
                selectedYear={year}
                setSelectedYear={(y) => {
                  setYear(y);
                  setMonth("");
                  setPage(1);
                }}
                uniqueYears={[...new Set(gastos.map((g) => g.data.split("-")[0]))]}
                selectedMonth={month}
                setSelectedMonth={(m) => {
                  setMonth(m);
                  setPage(1);
                }}
                uniqueMonths={[
                  ...new Set(
                    gastos
                      .filter((g) => g.data.startsWith(year))
                      .map((g) => g.data.split("-")[1])
                  ),
                ]}
                setCurrentPage={setPage}
              />

              {/* Botões de ação */}
              <ActionButtons
                onAdicionarGasto={handleAdicionarGasto}
                onLimparDados={handleLimparDadosGastos}
              />
            </div>


        <section className="mb-8">
          <h2 className="text-xl mt-10 font-semibold mb-3">
            Detalhes dos Gastos
          </h2>
          <GastosTable gastos={paginated} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>

        {filtered.length > 0 && (
          <>
            {/* Gráfico com evolução ao longo do tempo (por período) */}
            <ChartsDisplay
              sectionTitle="Evolução dos Gastos"
              charts={[
                {
                  id: "evolucao-periodo",
                  title: "Total de Gastos ao Longo do Tempo",
                  chartType: "bar",
                  // Mesclar opções padrão com as específicas do prepareChartData
                  ...(() => {
                    const prepared = prepareChartData(periodAgg, "Total de Gastos (R$)", "bar", aggregationType);
                    return {
                      ...prepared,
                      options: {
                        ...defaultBarChartOptions,
                        ...prepared.options, // Sobrescrever com opções do prepareChartData se houver
                        plugins: {
                          ...defaultBarChartOptions.plugins,
                          ...prepared.options?.plugins,
                          title: { // Título específico para este gráfico
                            display: true,
                            text: 'Total de Gastos ao Longo do Tempo',
                          }
                        }
                      }
                    };
                  })(),
                },
              ]}
              // gridCols="max-w-4xl mx-auto" // Já está no ChartsDisplay
            />

            {/* Análise por Categoria */}
            <ChartsDisplay
              sectionTitle="Análise por Categoria"
              charts={[
                {
                  id: "categoria-valor",
                  title: "Total por Categoria (R$)",
                  chartType: "bar",
                  ...(() => {
                    const prepared = prepareChartData(catAgg, "Valor Total (R$)", "bar", 'category');
                    return {
                      ...prepared,
                      options: {
                        ...defaultBarChartOptions,
                        ...prepared.options,
                        plugins: {
                          ...defaultBarChartOptions.plugins,
                          ...prepared.options?.plugins,
                          title: {
                            display: true,
                            text: 'Total por Categoria (R$)',
                          }
                        }
                      }
                    };
                  })(),
                },
                {
                  id: "categoria-distribuicao",
                  title: "Distribuição por Categoria (%)",
                  chartType: "pie",
                  ...(() => {
                    const prepared = prepareChartData(catAgg, "Distribuição por Categoria (%)", "pie", 'monthly');
                    return {
                      ...prepared,
                      options: {
                        ...defaultPieChartOptions,
                        ...prepared.options,
                        plugins: {
                          ...defaultPieChartOptions.plugins,
                          ...prepared.options?.plugins,
                          title: {
                            display: true,
                            text: 'Distribuição por Categoria (%)',
                          }
                        }
                      }
                    };
                  })(),
                },
              ]}
            />

            {/* Análise por Tipo de Despesa */}
            <ChartsDisplay
              sectionTitle="Análise por Tipo de Despesa"
              charts={[
                {
                  id: "tipo-valor",
                  title: "Total por Tipo de Despesa (R$)",
                  chartType: "bar",
                  ...(() => {
                    const prepared = prepareChartData(tipoAgg, "Total por Tipo de Despesa (R$)", "bar", 'monthly');
                    return {
                      ...prepared,
                      options: {
                        ...defaultBarChartOptions,
                        ...prepared.options,
                        plugins: {
                          ...defaultBarChartOptions.plugins,
                          ...prepared.options?.plugins,
                          title: {
                            display: true,
                            text: 'Total por Tipo de Despesa (R$)',
                          }
                        }
                      }
                    };
                  })(),
                },
                {
                  id: "tipo-distribuicao",
                  title: "Distribuição por Tipo de Despesa (%)",
                  chartType: "pie",
                  ...(() => {
                    const prepared = prepareChartData(tipoAgg, "Distribuição por Tipo de Despesa (%)", "pie", 'monthly');
                    return {
                      ...prepared,
                      options: {
                        ...defaultPieChartOptions,
                        ...prepared.options,
                        plugins: {
                          ...defaultPieChartOptions.plugins,
                          ...prepared.options?.plugins,
                          title: {
                            display: true,
                            text: 'Distribuição por Tipo de Despesa (%)',
                          }
                        }
                      }
                    };
                  })(),
                },
              ]}
            />
          </>
        )}

        {showModal && (
          <ModalGasto
            onClose={() => {
              setShowModal(false);
              refresh();
            }}
          />
        )}

        <ConfirmModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={clearAll}
          title="Confirmar Limpeza de Dados"
          message="Deseja apagar todos os gastos? Esta ação não pode ser desfeita."
        />
      </div>
    </PageContainer>
  );
};

export default GastosPage;