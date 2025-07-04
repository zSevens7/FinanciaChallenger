import { useState, useEffect, useCallback, useMemo } from "react";
import {
  aggregateByPeriod,
  aggregateByCategory,
  aggregateByTipoDespesa,
  prepareChartData,
} from "../services/agreggation";

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

  useEffect(() => {
    setPageHeader(
      "Gastos",
      <ActionButtons
        onAdicionarGasto={handleAdicionarGasto}
        onLimparDados={handleLimparDadosGastos}
      />
    );
    return () => setPageHeader(null, null);
  }, [setPageHeader, handleAdicionarGasto, handleLimparDadosGastos]);

  // Determine o tipo de agregação para os gráficos baseados nos filtros
  const aggregationType: 'daily' | 'monthly' | 'yearly' = useMemo(() => {
    if (month && year) return 'daily'; // Se mês e ano selecionados, agrega por dia
    if (year) return 'monthly'; // Se apenas ano selecionado, agrega por mês
    return 'yearly'; // Se nenhum filtro, agrega por ano (ou seja, o próprio `aggregateByPeriod` deve ser capaz de lidar com isso, mas estamos passando 'monthly' para ele se não tiver ano, o que não faz muito sentido... vamos revisar o `aggregateByPeriod` também para ter certeza que ele lida com 'yearly')
  }, [year, month]);


  const filtered = useMemo(() => {
    // A filtragem deve ser mais rigorosa aqui para corresponder à agregação
    // A lógica de agregação do ChartData fará sua própria filtragem de dados brutos
    // para o período correto (ano/mês) e agrupará.
    // Esta 'filtered' array é para a tabela e sumário, então ela deve continuar filtrando
    // os dados completos para o período exato selecionado.
    return gastos.filter((g) => {
      const gDate = new Date(g.data);
      const gYear = gDate.getFullYear().toString();
      const gMonth = (gDate.getMonth() + 1).toString().padStart(2, '0');

      const matchesYear = !year || gYear === year;
      const matchesMonth = !month || gMonth === month; // Se month não estiver selecionado, passa em true.

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

  // ATENÇÃO: As chamadas para aggregateByPeriod AGORA DEVEM PASSAR aggregationType!
  // E o `aggregateByPeriod` precisa estar pronto para receber 'yearly'
  const periodAgg = useMemo(
    () => aggregateByPeriod(gastos, year, month, aggregationType), // Passa gastos completos, year, month e aggregationType
    [gastos, year, month, aggregationType]
  );
  
  const catAgg = useMemo(
    () => aggregateByCategory(filtered), // Categoria e tipo de despesa são sempre sobre os dados filtrados para a tabela/KPIs
    [filtered]
  );
  const tipoAgg = useMemo(
    () => aggregateByTipoDespesa(filtered), // Categoria e tipo de despesa são sempre sobre os dados filtrados para a tabela/KPIs
    [filtered]
  );

  return (
    <PageContainer>
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-6">
        <SummarySection totalAcumulado={totalAcum} />

        <FilterControls
          selectedYear={year}
          setSelectedYear={(y) => {
            setYear(y);
            setMonth(""); // Limpa o mês ao mudar o ano
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

        {/* Renderiza os gráficos apenas se houver dados filtrados */}
        {filtered.length > 0 && (
          <>
            <ChartsDisplay
              sectionTitle="Evolução dos Gastos"
              charts={[
                {
                  id: "evolucao-periodo",
                  title: "Total de Gastos (R$)",
                  chartType: "bar", // Ou "line" para evolução, dependendo da sua preferência
                  // Ao preparar os dados, passamos o aggregationType
                  ...prepareChartData(periodAgg, "Total de Gastos (R$)", "bar", aggregationType),
                },
              ]}
              gridCols="max-w-4xl mx-auto"
            />

            <ChartsDisplay
              sectionTitle="Análise por Categoria"
              charts={[
                {
                  id: "categoria-valor",
                  title: "Valor Total (R$)",
                  chartType: "bar",
                  ...prepareChartData(catAgg, "Valor Total (R$)", "bar", 'monthly'), // Agregação por Categoria/TipoDespesa não muda com daily/monthly de período, mas o prepareChartData precisa do parâmetro. Colocar um padrão ou criar um novo 'aggregationType' para esses. Por enquanto, 'monthly' é um placeholder.
                },
                {
                  id: "categoria-distribuicao",
                  title: "Distribuição (%)",
                  chartType: "pie",
                  ...prepareChartData(catAgg, "Distribuição (%)", "pie", 'monthly'), // placeholder
                },
              ]}
            />

            <ChartsDisplay
              sectionTitle="Análise por Tipo de Despesa"
              charts={[
                {
                  id: "tipo-valor",
                  title: "Valor Total (R$)",
                  chartType: "bar",
                  ...prepareChartData(tipoAgg, "Valor Total (R$)", "bar", 'monthly'), // placeholder
                },
                {
                  id: "tipo-distribuicao",
                  title: "Distribuição (%)",
                  chartType: "pie",
                  ...prepareChartData(tipoAgg, "Distribuição (%)", "pie", 'monthly'), // placeholder
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