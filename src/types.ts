export interface Gasto {
  id: number
  nome: string
  preco: number | null
  categoria: string
  tipoDespesa: string
  data: string 
}

// Props para os botões de ação
export interface ActionButtonsProps {
  onAdicionarGasto: () => void
  onLimparDados: () => void
}

// Props para o modal de novo gasto
export interface ModalGastoProps {
  onClose: () => void
}

// Props para modal de confirmação
export interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onClose: () => void
  onConfirm: () => void
}

export interface ExpenseDetailsProps {
  expenses: Gasto[];
}

// Props para controles de filtro de data
export interface FilterControlsProps {
  selectedYear: string
  setSelectedYear: (year: string) => void
  uniqueYears: string[]
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  uniqueMonths: string[]
  setCurrentPage: (page: number) => void
}

// Props para tabela de gastos
export interface GastosTableProps {
  gastos: Gasto[]
}

// Props para paginação
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Props para cards de gráfico
export interface ChartCardProps {
  title: string
  chartType: "bar" | "pie"
  data: any
  options: any
}

// Props para seção de resumo (total acumulado)
export interface SummarySectionProps {
  totalAcumulado: number
}

// Props para componente que exibe múltiplos gráficos
export interface ChartsDisplayProps {
  sectionTitle: string
  charts: {
    id: string
    title: string
    chartType: "bar" | "pie"
    data: any
    options: any
  }[]
  gridCols?: string
}
