// src/types/index.ts

// ----------------- BASE -----------------
// Tipo base para transações com valor monetário
export interface TransacaoMonetaria {
  data: string;        // formato "YYYY-MM-DD"
  descricao: string;
  preco: number;       // usado no frontend
  valor?: number;      // usado para compatibilidade com backend (opcional)
}

// ----------------- VENDAS -----------------

// Venda principal
export interface Venda extends TransacaoMonetaria {
  id: string;
  tipoVenda: "salario" | "produto" | "servico";
  comentario?: string;   // opcional
  categoria?: string;    // opcional, compatível com backend
  nomeCliente?: string;  // opcional
  origem?: string;       // opcional
}

// Tipo usado para criar/editar vendas (sem id)
export type VendaInput = Omit<Venda, "id"> & {
  preco: number;                 // garante que o frontend continue usando 'preco'
  tipoVenda?: "salario" | "produto" | "servico"; // opcional para criação
  comentario?: string;           // opcional
  categoria: string;             // obrigatório para backend
  nomeCliente?: string;          // opcional
  origem?: string;               // opcional
};

// ----------------- GASTOS -----------------

export interface Gasto extends TransacaoMonetaria {
  id: string;
  categoria: string;       // Ex: moradia, transporte
  tipoDespesa: string;     // Ex: fixo_essencial, extraordinario
  nome?: string;           // opcional
  tipo?: string;           // opcional
}

// ----------------- PROPS DE COMPONENTES -----------------

export interface ActionButtonsProps {
  onAdicionarGasto: () => void;
  onLimparDados: () => void;
}

export interface ModalGastoProps {
  onClose: () => void;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ExpenseDetailsProps {
  expenses: Gasto[];
}

export interface FilterControlsProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  uniqueYears: string[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  setCurrentPage: (page: number) => void;
}

export interface GastosTableProps {
  gastos: Gasto[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ChartCardProps {
  title: string;
  chartType: "bar" | "pie";
  data: any;
  options: any;
}

export interface SummarySectionProps {
  totalAcumulado: number;
}

export interface ChartsDisplayProps {
  sectionTitle: string;
  charts: {
    id: string;
    title: string;
    chartType: "bar" | "pie";
    data: any;
    options: any;
  }[];
  gridCols?: string;
}
