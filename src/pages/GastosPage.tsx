import { useState, useEffect, useCallback, useMemo } from "react";
import ConfirmModal from "../components/ConfirmModal";
import PageContainer from "../features/gastos/components/PageContainer";
import { ActionButtons } from "../features/gastos/components/ActionButtons";
import { FilterControls } from "../features/gastos/components/FilterControls";
import { Pagination } from "../features/gastos/components/Pagination";
import { SummarySection } from "../features/gastos/components/SummarysSection";
import { GastosTable } from "../features/gastos/components/GastosTable";
import { ChartsDisplay } from "../features/gastos/components/ChartsDisplay";
import { useGastos } from "../contexts/GastosContext";
import { usePageHeader } from "../contexts/HeaderContext";
import ModalGasto from "../components/ModalGasto";
import type { Gasto } from "../types";

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
} from "chart.js";

import { getUniqueYears, getUniqueMonthsForYear } from "../utils";
import { aggregateByCategory, aggregateByPeriod, prepareChartData } from "../services/agreggation";

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

const GastosPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { gastos, addGasto, deleteGasto, removeAllGastos } = useGastos();

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { setPageHeader } = usePageHeader();

  const handleAdicionarGasto = useCallback(() => setShowModal(true), []);
  const handleLimparDados = useCallback(() => setShowConfirm(true), []);

  const clearData = async () => {
    removeAllGastos();
    setShowConfirm(false);
  };

  const handleDeleteGasto = useCallback(
    async (id: string) => {
      try {
        await deleteGasto(id);
      } catch (err) {
        console.error("Erro ao deletar gasto:", err);
      }
    },
    [deleteGasto]
  );

  const handleSaveGasto = useCallback(
    async (newGasto: Omit<Gasto, "id">) => {
      try {
        await addGasto(newGasto);
        setShowModal(false);
      } catch (err) {
        console.error("Erro ao adicionar gasto:", err);
      }
    },
    [addGasto]
  );

  // Botões do header memoizados para evitar recriação a cada render
  const headerButtons = useMemo(
    () => (
      <ActionButtons
        onAdicionarGasto={handleAdicionarGasto}
        onLimparDados={handleLimparDados}
      />
    ),
    [handleAdicionarGasto, handleLimparDados]
  );

  useEffect(() => {
    setPageHeader("Gastos", headerButtons);
    return () => setPageHeader(null, null);
  }, [setPageHeader, headerButtons]);

  const uniqueYears = useMemo(() => getUniqueYears(gastos), [gastos]);
  const uniqueMonths = useMemo(() => {
    if (!selectedYear) return [];
    return getUniqueMonthsForYear(gastos, selectedYear);
  }, [gastos, selectedYear]);

  const periodAggregationType: "daily" | "monthly" | "yearly" = useMemo(() => {
    if (selectedYear && selectedMonth) return "daily";
    if (selectedYear) return "monthly";
    return "yearly";
  }, [selectedYear, selectedMonth]);

  const filteredGastos = useMemo(() => {
    return gastos.filter((gasto) => {
      if (!gasto.data) return false;
      try {
        const dateObj = new Date(gasto.data);
        if (isNaN(dateObj.getTime())) return false;

        const year = dateObj.getFullYear().toString();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");

        const matchesYear = selectedYear ? year === selectedYear : true;
        const matchesMonth = selectedMonth ? month === selectedMonth : true;

        return matchesYear && matchesMonth;
      } catch {
        return false;
      }
    });
  }, [gastos, selectedYear, selectedMonth]);

  const totalFilteredGastos = filteredGastos.length;
  const totalPages = Math.ceil(totalFilteredGastos / itemsPerPage);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedGastos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGastos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGastos, currentPage, itemsPerPage]);

  const totalAcumuladoGasto = useMemo(() => {
    return filteredGastos.reduce((sum, gasto) => sum + (gasto.preco || 0), 0);
  }, [filteredGastos]);

  const expensesByPeriodAgg = useMemo(
    () => aggregateByPeriod(gastos, selectedYear, selectedMonth, periodAggregationType),
    [gastos, selectedYear, selectedMonth, periodAggregationType]
  );

  const expensesByCategoryAgg = useMemo(
    () => aggregateByCategory(filteredGastos),
    [filteredGastos]
  );

  const chartDataPeriodExpenses = useMemo(() => {
    return prepareChartData(
      expensesByPeriodAgg,
      selectedYear && !selectedMonth
        ? `Gastos Mensais em ${selectedYear} (R$)`
        : "Evolução dos Gastos (R$)",
      selectedYear && !selectedMonth ? "bar" : "line",
      periodAggregationType
    );
  }, [expensesByPeriodAgg, selectedYear, selectedMonth, periodAggregationType]);

  const chartDataCategoryExpenses = useMemo(
    () => prepareChartData(expensesByCategoryAgg, "Gastos por Categoria (R$)", "bar", "category"),
    [expensesByCategoryAgg]
  );

  const chartDataCategoryExpensesPie = useMemo(
    () =>
      prepareChartData(
        expensesByCategoryAgg,
        "Distribuição por Categoria (%)",
        "pie",
        "category"
      ),
    [expensesByCategoryAgg]
  );

  return (
    <PageContainer>
      {showModal && (
        <ModalGasto onClose={() => setShowModal(false)} />
      )}

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={clearData}
        title="Confirmar Limpeza de Dados de Gastos"
        message="Tem certeza que deseja apagar todos os dados de gastos? Esta ação não poderá ser desfeita."
      />

      <SummarySection totalAcumulado={totalAcumuladoGasto} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <FilterControls
          selectedYear={selectedYear}
          setSelectedYear={(y) => {
            setSelectedYear(y);
            setSelectedMonth("");
            setCurrentPage(1);
          }}
          uniqueYears={uniqueYears}
          selectedMonth={selectedMonth}
          setSelectedMonth={(m) => {
            setSelectedMonth(m);
            setCurrentPage(1);
          }}
          uniqueMonths={uniqueMonths}
          setCurrentPage={setCurrentPage}
        />
        <ActionButtons
          onAdicionarGasto={handleAdicionarGasto}
          onLimparDados={handleLimparDados}
        />
      </div>

      <GastosTable gastos={paginatedGastos} onDelete={handleDeleteGasto} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {filteredGastos.length > 0 && (
        <>
          <ChartsDisplay
            sectionTitle="Evolução dos Gastos"
            charts={[
              {
                id: "evolucao-gastos",
                title: "Total de Gastos por Período (R$)",
                chartType: selectedYear && !selectedMonth ? "bar" : "line",
                data: chartDataPeriodExpenses.data,
                options: chartDataPeriodExpenses.options,
              },
            ]}
            gridCols="max-w-4xl mx-auto"
          />

          <ChartsDisplay
            sectionTitle="Análise por Categoria"
            charts={[
              {
                id: "gastos-categoria-valor",
                title: "Valor Total por Categoria (R$)",
                chartType: "bar",
                data: chartDataCategoryExpenses.data,
                options: chartDataCategoryExpenses.options,
              },
              {
                id: "gastos-categoria-distribuicao",
                title: "Distribuição por Categoria (%)",
                chartType: "pie",
                data: chartDataCategoryExpensesPie.data,
                options: chartDataCategoryExpensesPie.options,
              },
            ]}
          />
        </>
      )}
    </PageContainer>
  );
};

export default GastosPage;
