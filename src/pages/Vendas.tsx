import { useState, useEffect, useMemo } from "react";
import ModalVenda from "../components/ModalVenda";
import ConfirmModal from "../components/ConfirmModal";
import PageContainer from "../features/vendas/PageContainer";
import { HeaderActionButtons } from "../features/vendas/ActionButtons";
import { FilterControls } from "../features/vendas/FilterControls";
import { Pagination } from "../features/vendas/Pagination";
import { SummarySection } from "../features/vendas/SummarySection";
import { VendasTable } from "../features/vendas/VendasTable";
import { ChartsDisplay } from "../features/vendas/ChartDisplay";
import { useVendas } from "../contexts/VendasContext";
import { usePageHeader } from "../contexts/HeaderContext";
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
import {
  aggregateSalesByCourseType,
  aggregateSalesByPeriod,
  prepareChartData,
} from "../services/agreggation";
import { VendaInput } from "../types/index";

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
  const { vendas, addVenda, deleteVenda, refreshVendas } = useVendas();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { setPageHeader } = usePageHeader();

  useEffect(() => {
    refreshVendas();
  }, []);

  useEffect(() => {
    setPageHeader(
      "Vendas",
      <HeaderActionButtons
        onAdicionarVenda={() => setShowModal(true)}
        onLimparDadosVendas={() => setShowConfirm(true)}
      />
    );
    return () => setPageHeader(null, null);
  }, [setPageHeader]);

  const closeModal = () => setShowModal(false);

  const clearData = async () => {
    alert("Funcionalidade de limpar todos os dados não está implementada no backend");
    setShowConfirm(false);
  };

  const handleSaveVenda = async (vendaData: VendaInput) => {
    try {
      await addVenda(vendaData);
      setShowModal(false);
      setCurrentPage(1);
    } catch (err) {
      console.error("Erro ao adicionar venda:", err);
    }
  };

  const handleDeleteVenda = async (id: string) => {
    try {
      await deleteVenda(id);
    } catch (err) {
      console.error("Erro ao deletar venda:", err);
    }
  };

  const uniqueYears = useMemo(() => getUniqueYears(vendas), [vendas]);
  const uniqueMonths = useMemo(() => {
    if (!selectedYear) return [];
    return getUniqueMonthsForYear(vendas, selectedYear);
  }, [vendas, selectedYear]);

  const periodAggregationType: "daily" | "monthly" | "yearly" = useMemo(() => {
    if (selectedYear && selectedMonth) return "daily";
    if (selectedYear) return "monthly";
    return "yearly";
  }, [selectedYear, selectedMonth]);

  const filteredVendas = useMemo(() => {
    return vendas.filter((venda) => {
      const dateObj = new Date(venda.data);
      const year = dateObj.getFullYear().toString();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");

      const matchesYear = selectedYear ? year === selectedYear : true;
      const matchesMonth = selectedMonth ? month === selectedMonth : true;

      return matchesYear && matchesMonth;
    });
  }, [vendas, selectedYear, selectedMonth]);

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
    () =>
      aggregateSalesByPeriod(
        filteredVendas,
        selectedYear,
        selectedMonth,
        periodAggregationType
      ),
    [filteredVendas, selectedYear, selectedMonth, periodAggregationType]
  );

  const salesByCourseTypeAgg = useMemo(
    () => aggregateSalesByCourseType(filteredVendas),
    [filteredVendas]
  );

  const chartDataPeriodSales = useMemo(() => {
    return prepareChartData(
      salesByPeriodAgg,
      selectedYear && !selectedMonth
        ? `Vendas Mensais em ${selectedYear} (R$)`
        : "Evolução de Vendas (R$)",
      selectedYear && !selectedMonth ? "bar" : "line",
      periodAggregationType
    );
  }, [salesByPeriodAgg, selectedYear, selectedMonth, periodAggregationType]);

  const chartDataCourseType = useMemo(
    () =>
      prepareChartData(
        salesByCourseTypeAgg,
        "Vendas por Tipo de Venda (R$)",
        "bar",
        "category"
      ),
    [salesByCourseTypeAgg]
  );

  const chartDataCourseTypePie = useMemo(
    () =>
      prepareChartData(
        salesByCourseTypeAgg,
        "Distribuição por Tipo de Venda (%)",
        "pie",
        "category"
      ),
    [salesByCourseTypeAgg]
  );

  return (
    <PageContainer>
      {showModal && <ModalVenda onClose={closeModal} onSave={handleSaveVenda} />}

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={clearData}
        title="Confirmar Limpeza de Dados de Vendas"
        message="Tem certeza que deseja apagar todos os dados de vendas? Esta ação não poderá ser desfeita."
      />

      <SummarySection title="Total de Lucro" totalAcumulado={totalAcumuladoLucro} />

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

        <HeaderActionButtons
          onAdicionarVenda={() => setShowModal(true)}
          onLimparDadosVendas={() => setShowConfirm(true)}
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

          
        /<ChartsDisplay
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
