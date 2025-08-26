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
import {
  aggregateSalesByCourseType,
  aggregateSalesByPeriod,
  prepareChartData,
  AggregationType
} from "../services/agreggation";
import type { Venda } from "../types/index";

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
  const [allVendas, setAllVendas] = useState<Venda[]>([]);
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

const handleDeleteVenda = useCallback((id: string) => {
  const updatedVendas = allVendas.filter(venda => venda.id !== id);
  localStorage.setItem("vendas", JSON.stringify(updatedVendas));
  setAllVendas(updatedVendas);
}, [allVendas]);


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

  const periodAggregationType: 'daily' | 'monthly' | 'yearly' = useMemo(() => {
    if (selectedYear && selectedMonth) return 'daily';
    if (selectedYear) return 'monthly';
    return 'yearly';
  }, [selectedYear, selectedMonth]);

  const filteredVendas = useMemo(() => {
    return allVendas.filter(venda => {
      const dateObj = new Date(venda.data);
      const year = dateObj.getFullYear().toString();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

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
    return filteredVendas.reduce((sum, venda) => sum + venda.preco, 0);
  }, [filteredVendas]);

  const salesByPeriodAgg = useMemo(
    () => aggregateSalesByPeriod(allVendas, selectedYear, selectedMonth, periodAggregationType),
    [allVendas, selectedYear, selectedMonth, periodAggregationType]
  );

  const salesByCourseTypeAgg = useMemo(
    () => aggregateSalesByCourseType(filteredVendas),
    [filteredVendas]
  );

  const chartDataPeriodSales = useMemo(() => {
    return prepareChartData(
      salesByPeriodAgg,
      selectedYear && !selectedMonth ? `Vendas Mensais em ${selectedYear} (R$)` : 'Evolução de Vendas (R$)',
      selectedYear && !selectedMonth ? "bar" : "line",
      periodAggregationType
    );
  }, [salesByPeriodAgg, selectedYear, selectedMonth, periodAggregationType]);

  const chartDataCourseType = useMemo(() =>
    prepareChartData(salesByCourseTypeAgg, "Vendas por Tipo de Venda (R$)", "bar", 'category')
  , [salesByCourseTypeAgg]);

  const chartDataCourseTypePie = useMemo(() =>
    prepareChartData(salesByCourseTypeAgg, "Distribuição por Tipo de Venda (%)", "pie", 'category')
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Filtros de Ano/Mês */}
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

          {/* Botões de ação */}
          <HeaderActionButtons
            onAdicionarVenda={handleAdicionarVenda}
            onLimparDadosVendas={handleLimparDadosVendas}
          />
        </div>


      <VendasTable vendas={paginatedVendas} onDelete={handleDeleteVenda} />

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
            sectionTitle="Análise por Tipo de Venda"
            charts={[
              {
                id: "vendas-tipo-valor",
                title: "Valor Total por Tipo de Venda (R$)",
                chartType: "bar",
                data: chartDataCourseType.data,
                options: chartDataCourseType.options,
              },
              {
                id: "vendas-tipo-distribuicao",
                title: "Distribuição por Tipo de Venda (%)",
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
