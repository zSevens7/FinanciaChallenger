import { monthNames } from "../../utils";

// Props para controles de filtro de data
export interface FilterControlsProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  uniqueYears: string[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  uniqueMonths: string[];
  setCurrentPage: (page: number) => void;
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
  <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-start items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow">
    {/* Select de Ano */}
    <select
      value={selectedYear}
      onChange={(e) => {
        setSelectedYear(e.target.value);
        setSelectedMonth(""); // reseta o mês ao mudar o ano
        setCurrentPage(1); // reseta a paginação
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

    {/* Select de Mês, só aparece se houver um ano selecionado */}
    {selectedYear && (
      <select
        value={selectedMonth}
        onChange={(e) => {
          setSelectedMonth(e.target.value);
          setCurrentPage(1); // reseta a paginação ao mudar mês
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
