import { useState, useEffect, useCallback, useMemo } from "react";
import {
  aggregateByPeriod,
  aggregateByCategory,
  aggregateByTipoDespesa,
  prepareChartData,
} from "../services/agreggation";

// Importe o ActionButtons para Gastos (ele será usado aqui para ser passado para o contexto)
import { ActionButtons } from "../features/gastos/components/ActionButtons"; // Verifique o caminho correto

import { FilterControls } from "../features/gastos/components/FilterControls";
import { SummarySection } from "../features/gastos/components/SummarysSection";
import { GastosTable } from "../features/gastos/components/GastosTable";
import { Pagination } from "../features/gastos/components/Pagination";
import { ChartsDisplay } from "../features/gastos/components/ChartsDisplay";
// REMOVIDO: import { ExpenseDetails } from "../features/gastos/components/ExpenseDetails";
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

import { usePageHeader } from "../contexts/HeaderContext"; // Importa o hook do contexto

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
  const [gastos, setGastos] = useState<any[]>([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { setPageHeader } = usePageHeader(); // Usa o hook do contexto

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

  // Memoizando as funções com useCallback para evitar recriação desnecessária
  const handleAdicionarGasto = useCallback(() => setShowModal(true), []);
  const handleLimparDadosGastos = useCallback(() => setShowConfirm(true), []);

  // Define o conteúdo do cabeçalho quando o componente GastosPage é montado
  useEffect(() => {
    setPageHeader(
      "Gastos", // Título da página
      <ActionButtons // Componente de botões de ação para Gastos
        onAdicionarGasto={handleAdicionarGasto}
        onLimparDados={handleLimparDadosGastos} // Note a prop onLimparDados aqui
      />
    );

    // Limpa o conteúdo do cabeçalho quando o componente é desmontado
    return () => setPageHeader(null, null);
  }, [setPageHeader, handleAdicionarGasto, handleLimparDadosGastos]); // Dependências do useEffect


  const filtered = useMemo(() => {
    return gastos.filter((g) =>
      (!year || g.data.startsWith(year)) &&
      (!month || g.data.split("-")[1] === month)
    );
  }, [gastos, year, month]);

  const totalPages = Math.ceil(filtered.length / 5);
  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * 5, page * 5);
  }, [filtered, page]);

  const totalAcum = useMemo(() => {
    return filtered.reduce((sum, g) => sum + (g.preco || 0), 0);
  }, [filtered]);

  const periodAgg = useMemo(() => aggregateByPeriod(filtered, year, month), [filtered, year, month]);
  const catAgg = useMemo(() => aggregateByCategory(filtered), [filtered]);
  const tipoAgg = useMemo(() => aggregateByTipoDespesa(filtered), [filtered]);


  return (
    // O Header principal não é mais renderizado aqui, ele é o pai em App.tsx
    // e recebe as props via contexto.
    <PageContainer>
      {/* REMOVIDO: HeaderApp e ActionButtons não são mais necessários aqui */}
      {/* O conteúdo do cabeçalho é definido via usePageHeader acima */}

      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-6">

        {/* Seção de Sumário para Total Acumulado - AGORA EM PRIMEIRO */}
        <SummarySection totalAcumulado={totalAcum} />

        {/* Controles de Filtro - AGORA EM SEGUNDO */}
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

        {/* REMOVIDO: ExpenseDetails não é mais necessário */}
        {/* <ExpenseDetails expenses={paginated}/> */}

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
              <ChartsDisplay
                sectionTitle="Evolução dos Gastos"
                charts={[
                  {
                    id: "evolucao-periodo",
                    title: "Total de Gastos (R$)",
                    chartType: "bar",
                    ...prepareChartData(periodAgg, "Total de Gastos (R$)", "bar"),
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
                    ...prepareChartData(catAgg, "Valor Total (R$)", "bar"),
                  },
                  {
                    id: "categoria-distribuicao",
                    title: "Distribuição (%)",
                    chartType: "pie",
                    ...prepareChartData(catAgg, "Distribuição (%)", "pie"),
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
                    ...prepareChartData(tipoAgg, "Valor Total (R$)", "bar"),
                  },
                  {
                    id: "tipo-distribuicao",
                    title: "Distribuição (%)",
                    chartType: "pie",
                    ...prepareChartData(tipoAgg, "Distribuição (%)", "pie"),
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
      </div> {/* Fechamento da div com className="container mx-auto..." */}
    </PageContainer>
  );
};

export default GastosPage;