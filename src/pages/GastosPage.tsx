import { useState, useEffect, useCallback } from "react"
import {
  aggregateByPeriod,
  aggregateByCategory,
  aggregateByTipoDespesa,
  prepareChartData,
} from "../services/agreggation"
import { ActionButtons } from "../features/gastos/components/ActionButtons"
import { FilterControls } from "../features/gastos/components/FilterControls"
import { SummarySection } from "../features/gastos/components/SummarysSection"
import { GastosTable } from "../features/gastos/components/GastosTable"
import { Pagination } from "../features/gastos/components/Pagination"
import { ChartsDisplay } from "../features/gastos/components/ChartsDisplay"
import { HeaderApp } from "../features/gastos/components/HeaderApp"
import ModalGasto from "../components/ModalGasto"
import  ConfirmModal  from "../components/ConfirmModal"
import { LineElement, TimeScale } from 'chart.js'
ChartJS.register(LineElement, TimeScale)
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
} from 'chart.js'

ChartJS.register(
  CategoryScale,   
  LinearScale,     
  BarElement,      
  PointElement,    
  ArcElement,      
  Title,
  Tooltip,
  Legend
)



export const GastosPage = () => {
  const [gastos, setGastos] = useState<any[]>([])
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const refresh = useCallback(() => {
    const data = JSON.parse(localStorage.getItem("gastos") || "[]")
    data.sort(
      (a: any, b: any) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
    )
    setGastos(data)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const clearAll = () => {
    localStorage.removeItem("gastos")
    setYear("")
    setMonth("")
    setPage(1)
    refresh()
  }

  // filtros, paginação e totais
  const filtered = gastos.filter((g) =>
    (!year || g.data.startsWith(year)) &&
    (!month || g.data.split("-")[1] === month)
  )
  const totalPages = Math.ceil(filtered.length / 5)
  const paginated = filtered.slice((page - 1) * 5, page * 5)
  const totalAcum = filtered.reduce((sum, g) => sum + (g.preco || 0), 0)

  // agregações para gráficos
  const periodAgg = aggregateByPeriod(filtered, year, month)
  const catAgg = aggregateByCategory(filtered)
  const tipoAgg = aggregateByTipoDespesa(filtered)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-50 p-4">
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-6">
        <HeaderApp />


        <ActionButtons
          onAdicionarGasto={() => setShowModal(true)}
          onLimparDados={() => setShowConfirm(true)}
        />

        <FilterControls
          selectedYear={year}
          setSelectedYear={(y) => {
            setYear(y)
            setMonth("")
            setPage(1)
          }}
          uniqueYears={[...new Set(gastos.map((g) => g.data.split("-")[0]))]}
          selectedMonth={month}
          setSelectedMonth={(m) => {
            setMonth(m)
            setPage(1)
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

        <SummarySection totalAcumulado={totalAcum} />

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
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
                  ...prepareChartData(periodAgg, "Total de Gastos (R$)"),
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
                  ...prepareChartData(catAgg, "Valor Total (R$)"),
                },
                {
                  id: "categoria-distribuicao",
                  title: "Distribuição (%)",
                  chartType: "pie",
                  ...prepareChartData(catAgg),
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
                  ...prepareChartData(tipoAgg, "Valor Total (R$)"),
                },
                {
                  id: "tipo-distribuicao",
                  title: "Distribuição (%)",
                  chartType: "pie",
                  ...prepareChartData(tipoAgg),
                },
              ]}
            />
          </>
        )}


        {showModal && (
          <ModalGasto
            onClose={() => {
              setShowModal(false)
              refresh()
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
    </div>
  )
}

export default GastosPage;
