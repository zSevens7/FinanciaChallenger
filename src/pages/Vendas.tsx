// src/pages/Vendas.tsx

import { useState, useEffect, useCallback, useMemo } from "react";
import ModalVenda from "../components/ModalVenda";
import ConfirmModal from "../components/ConfirmModal";
import PageContainer from "../features/vendas/PageContainer";

import { HeaderActionButtons } from "../features/vendas/ActionButtons";

import { FilterControls } from "../features/vendas/FilterControls";
import { Pagination } from "../features/vendas/Pagination";
import { SummarySection } from "../features/vendas/SummarySection";
import { VendasTable } from "../features/vendas/VendasTable";
import { ChartsDisplay } from "../features/vendas/ChartDisplay";

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

import { getUniqueYears, getUniqueMonthsForYear } from "../utils";
// Importe SOMENTE o tipo AggregationType se necessário para uma variável,
// mas as funções aggregateSalesByPeriod e prepareChartData já sabem seus tipos de parâmetros.
import { aggregateSalesByCourseType, aggregateSalesByPeriod, prepareChartData, AggregationType } from "../services/agreggation";
import type { Venda } from "../types/index";

// Remova esta linha se você já importou AggregationType do services/agreggation.
// export type AggregationType = 'daily' | 'monthly' | 'yearly' | 'category' | 'type';

import { usePageHeader } from "../contexts/HeaderContext";

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

const Vendas = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [allVendas, setAllVendas] = useState<Venda[]>([] );
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { setPageHeader } = usePageHeader();

  const refreshVendas = useCallback(() => {
    const data = JSON.parse(localStorage.getItem("vendas") || "[]") as Venda[];
    data.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    setAllVendas(data);
  }, []);

  useEffect(() => {
    refreshVendas();
  }, [refreshVendas]);

  const closeModal = () => {
    setShowModal(false);
    refreshVendas();
  };

  const clearData = () => {
    localStorage.removeItem("vendas");
    setAllVendas([]);
    setShowConfirm(false);
  };

  const handleAdicionarVenda = useCallback(() => setShowModal(true), []);
  const handleLimparDadosVendas = useCallback(() => setShowConfirm(true), []);

  useEffect(() => {
    setPageHeader(
      "Vendas",
      <HeaderActionButtons
        onAdicionarVenda={handleAdicionarVenda}
        onLimparDadosVendas={handleLimparDadosVendas}
      />
    );
    return () => setPageHeader(null, null);
  }, [setPageHeader, handleAdicionarVenda, handleLimparDadosVendas]);

  const uniqueYears = useMemo(() => getUniqueYears(allVendas), [allVendas]);
  const uniqueMonths = useMemo(() => {
    if (!selectedYear) return [];
    return getUniqueMonthsForYear(allVendas, selectedYear);
  }, [allVendas, selectedYear]);

  // Determine the aggregation type based on selected filters FOR PERIOD-BASED AGGREGATION
  // This type needs to match what aggregateSalesByPeriod expects
  const periodAggregationType: 'daily' | 'monthly' | 'yearly' = useMemo(() => {
    if (selectedYear && selectedMonth) return 'daily';
    if (selectedYear) return 'monthly';
    return 'yearly';
  }, [selectedYear, selectedMonth]);


  const filteredVendas = useMemo(() => {
    return allVendas.filter(venda => {
      // Use Date object for robust parsing, then extract year/month
      const dateObj = new Date(venda.data);
      const year = dateObj.getFullYear().toString();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed

      const matchesYear = selectedYear ? year === selectedYear : true;
      const matchesMonth = selectedMonth ? month === selectedMonth : true;

      return matchesYear && matchesMonth;
    });
  }, [allVendas, selectedYear, selectedMonth]);

  const totalFilteredVendas = filteredVendas.length;
  const totalPages = Math.ceil(totalFilteredVendas / itemsPerPage);

  const paginatedVendas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVendas.slice(startIndex, endIndex);
  }, [filteredVendas, currentPage, itemsPerPage]);

  const totalAcumuladoLucro = useMemo(() => {
    return filteredVendas.reduce((sum, venda) => sum + (venda.valorFinal ?? 0), 0);
  }, [filteredVendas]);

  // Use allVendas (unfiltered) for period aggregation, let the aggregation function filter by year/month internally
  const salesByPeriodAgg = useMemo(
    () => aggregateSalesByPeriod(allVendas, selectedYear, selectedMonth, periodAggregationType), // Use periodAggregationType here
    [allVendas, selectedYear, selectedMonth, periodAggregationType]
  );

  // For course type, use filteredVendas as it represents the current table view
  const salesByCourseTypeAgg = useMemo(
    () => aggregateSalesByCourseType(filteredVendas),
    [filteredVendas]
  );

  // Now, prepareChartData for period sales needs the aggregationType
  const chartDataPeriodSales = useMemo(() => {
    return prepareChartData(
        salesByPeriodAgg,
        selectedYear && !selectedMonth ? `Vendas Mensais em ${selectedYear} (R$)` : 'Evolução de Vendas (R$)',
        selectedYear && !selectedMonth ? "bar" : "line",
        periodAggregationType // Pass the periodAggregationType here, which is of type AggregationType
    );
  }, [salesByPeriodAgg, selectedYear, selectedMonth, periodAggregationType]);

  // For course type charts, pass a default aggregation type, as they are not time-based
  // Now, 'category' is a valid AggregationType because it was exported and imported correctly
  const chartDataCourseType = useMemo(() =>
    prepareChartData(salesByCourseTypeAgg, "Vendas por Tipo de Curso (R$)", "bar", 'category')
  , [salesByCourseTypeAgg]);

  const chartDataCourseTypePie = useMemo(() =>
    prepareChartData(salesByCourseTypeAgg, "Distribuição por Tipo de Curso (%)", "pie", 'category')
  , [salesByCourseTypeAgg]);


  return (
    <PageContainer>
      {showModal && <ModalVenda onClose={closeModal} />}

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={clearData}
        title="Confirmar Limpeza de Dados de Vendas"
        message="Tem certeza que deseja apagar todos os dados de vendas? Esta ação não poderá ser desfeita."
      />

      <SummarySection title="Total de Lucro" totalAcumulado={totalAcumuladoLucro} />

      <FilterControls
        selectedYear={selectedYear}
        setSelectedYear={(y) => {
          setSelectedYear(y);
          setSelectedMonth(""); // Clear month when year changes
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

      <VendasTable vendas={paginatedVendas} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {filteredVendas.length > 0 && (
        <>
          <ChartsDisplay
            sectionTitle="Evolução das Vendas"
            charts={[
              {
                id: "evolucao-vendas",
                title: "Total de Vendas por Período (R$)",
                chartType: selectedYear && !selectedMonth ? "bar" : "line",
                data: chartDataPeriodSales.data,
                options: chartDataPeriodSales.options,
              },
            ]}
            gridCols="max-w-4xl mx-auto"
            className="mt-8"
          />

          <ChartsDisplay
            sectionTitle="Análise por Tipo de Curso"
            charts={[
              {
                id: "vendas-tipo-valor",
                title: "Valor Total por Tipo de Curso (R$)",
                chartType: "bar",
                data: chartDataCourseType.data,
                options: chartDataCourseType.options,
              },
              {
                id: "vendas-tipo-distribuicao",
                title: "Distribuição por Tipo de Curso (%)",
                chartType: "pie",
                data: chartDataCourseTypePie.data,
                options: chartDataCourseTypePie.options,
              },
            ]}
          />
        </>
      )}
    </PageContainer>
  );
};

export default Vendas;