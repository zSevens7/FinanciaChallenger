import { monthNames } from "../../../utils"
import type { FilterControlsProps } from "../../../types"

export const FilterControls = ({
  selectedYear,
  setSelectedYear,
  uniqueYears,
  selectedMonth,
  setSelectedMonth,
  uniqueMonths,
  setCurrentPage,
}: FilterControlsProps) => (

  <section className="mb-8 p-4 bg-purple-50 rounded-lg shadow">
    <h2 className="text-xl font-semibold text-purple-700 mb-3 text-center">
      Filtros
    </h2>
    <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center items-center">
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
  </section>
);