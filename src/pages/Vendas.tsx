// src/pages/Vendas.tsx

import { useState, useEffect, useCallback, useMemo } from "react";
import ModalVenda from "../components/ModalVenda";
import ConfirmModal from "../components/ConfirmModal";
import PageContainer from "../features/vendas/PageContainer";

// Importe o ActionButtons para Vendas (ele será usado aqui para ser passado para o contexto)
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

import { getUniqueYears, getUniqueMonthsForYear, monthNames } from "../utils";
import { aggregateSalesByCourseType, aggregateSalesByPeriod, prepareChartData } from "../services/agreggation";
import type { Venda } from "../types/index";

import { usePageHeader } from "../contexts/HeaderContext"; // Importa o hook do contexto

// Se você já registrou em ChartCard.tsx ou em um arquivo de configuração global, pode remover daqui.
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

  const { setPageHeader } = usePageHeader(); // Usa o hook do contexto

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

  // Memoizando as funções com useCallback para evitar recriação desnecessária
  const handleAdicionarVenda = useCallback(() => setShowModal(true), []);
  const handleLimparDadosVendas = useCallback(() => setShowConfirm(true), []);

  // Define o conteúdo do cabeçalho quando o componente Vendas é montado
  useEffect(() => {
    setPageHeader(
      "Vendas", // Título da página
      <HeaderActionButtons // Componente de botões de ação para Vendas
        onAdicionarVenda={handleAdicionarVenda}
        onLimparDadosVendas={handleLimparDadosVendas}
      />
    );

    // Limpa o conteúdo do cabeçalho quando o componente é desmontado
    return () => setPageHeader(null, null);
  }, [setPageHeader, handleAdicionarVenda, handleLimparDadosVendas]); // Dependências do useEffect


  const uniqueYears = useMemo(() => getUniqueYears(allVendas), [allVendas]);
  const uniqueMonths = useMemo(() => {
    if (!selectedYear) return [];
    return getUniqueMonthsForYear(allVendas, selectedYear);
  }, [allVendas, selectedYear]);

  const filteredVendas = useMemo(() => {
    return allVendas.filter(venda => {
      const year = venda.data.substring(0, 4);
      const month = venda.data.substring(5, 7);

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

  const salesByCourseTypeAgg = useMemo(() => aggregateSalesByCourseType(filteredVendas), [filteredVendas]);
  const salesByPeriodAgg = useMemo(() => aggregateSalesByPeriod(filteredVendas, selectedYear, selectedMonth), [filteredVendas, selectedYear, selectedMonth]);

  const chartDataCourseType = useMemo(() =>
    prepareChartData(salesByCourseTypeAgg, "Vendas por Tipo de Curso (R$)", "bar")
  , [salesByCourseTypeAgg]);

  const chartDataCourseTypePie = useMemo(() =>
    prepareChartData(salesByCourseTypeAgg, "Distribuição por Tipo de Curso (%)", "pie")
  , [salesByCourseTypeAgg]);

  const chartDataPeriodSales = useMemo(() => {
    const rawLabels = Object.keys(salesByPeriodAgg);
    const sortedLabels = rawLabels.sort((a, b) => {
        const na = parseInt(a, 10), nb = parseInt(b, 10);
        return !isNaN(na) && !isNaN(nb) ? na - nb : a.localeCompare(b);
    });
    const dataValues = sortedLabels.map(l => salesByPeriodAgg[l]);
    const formattedLabels = sortedLabels.map(l => monthNames[l] || l);

    return prepareChartData(
        sortedLabels.reduce((acc, _, index) => {
            acc[formattedLabels[index]] = dataValues[index];
            return acc;
        }, {} as Record<string, number>),
        selectedYear && !selectedMonth ? `Vendas Mensais em ${selectedYear} (R$)` : 'Evolução de Vendas por Ano/Mês (R$)',
        selectedYear && !selectedMonth ? "bar" : "line"
    );
  }, [salesByPeriodAgg, selectedYear, selectedMonth, monthNames]);


  return (
    // O Header principal não é mais renderizado aqui, ele é o pai em App.tsx
    // e recebe as props via contexto.
    <PageContainer>
      {/* REMOVIDO: HeaderApp e ActionButtons não são mais necessários aqui */}
      {/* O conteúdo do cabeçalho é definido via usePageHeader acima */}

      {showModal && <ModalVenda onClose={closeModal} />}

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={clearData}
        title="Confirmar Limpeza de Dados de Vendas"
        message="Tem certeza que deseja apagar todos os dados de vendas? Esta ação não poderá ser desfeita."
      />

    
      {/* 3. Seção de Sumário para Total Acumulado */}
      <SummarySection title="Total de Lucro" totalAcumulado={totalAcumuladoLucro} />


       {/* 4. Controles de Filtro */}
      <FilterControls
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        uniqueYears={uniqueYears}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        uniqueMonths={uniqueMonths}
        setCurrentPage={setCurrentPage}
      />

      {/* 5. Tabela de Vendas */}
      <VendasTable vendas={paginatedVendas} />

      {/* 6. Paginação da Tabela */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 7. Gráficos de Vendas  */}
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