import { monthNames } from "../../../utils"

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

export const FilterControls = ({
  selectedYear,
  setSelectedYear,
  uniqueYears,
  selectedMonth,
  setSelectedMonth,
  uniqueMonths,
  setCurrentPage,
}: FilterControlsProps) => (
  // Removido o <section> e o <h2> do título "Filtros"
  // O contêiner agora é um div simples com classes de layout.
  // flex: torna o div um contêiner flexível
  // flex-col sm:flex-row: empilha em colunas em mobile, e em linha a partir de sm (tablet/desktop)
  // gap-4: espaçamento entre os selects
  // mb-6: margem inferior para separar de outros elementos
  // justify-start: alinha os itens flexíveis ao início do contêiner (canto esquerdo)
  // items-center: alinha verticalmente ao centro
  // p-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow: Mantém os estilos de fundo e sombra
  <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-start items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow">
    {/* O título <h2> "Filtros" foi removido daqui */}
    <select
      value={selectedYear}
      onChange={(e) => {
        setSelectedYear(e.target.value);
        setSelectedMonth("");
        setCurrentPage(1);
      }}
      className="p-2 border border-purple-300 rounded-md w-full sm:w-auto bg-white focus:ring-purple-500 focus:border-purple-500"
    >
      <option value="">Todos os Anos</option>
      {uniqueYears.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
    {selectedYear && (
      <select
        value={selectedMonth}
        onChange={(e) => {
          setSelectedMonth(e.target.value);
          setCurrentPage(1);
        }}
        className="p-2 border border-purple-300 rounded-md w-full sm:w-auto bg-white focus:ring-purple-500 focus:border-purple-500"
      >
        <option value="">Todos os Meses</option>
        {uniqueMonths.map((m) => (
          <option key={m} value={m}>
            {monthNames[m] || m}
          </option>
        ))}
      </select>
    )}
  </div>
);