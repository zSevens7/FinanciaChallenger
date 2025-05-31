import { useState, useEffect } from "react";
import ModalGasto from "../components/ModalGasto";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Registra os componentes do ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Gasto {
  id: number;
  preco: number | null;
  categoria: string;
  tipoDespesa: string;
  data: string; // formato "yyyy-mm-dd"
}

const Gastos = () => {
  const [showModal, setShowModal] = useState(false);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Limita a 5 linhas por página

  // Carrega os dados salvos do localStorage
  const refreshGastos = () => {
    const data = JSON.parse(localStorage.getItem("gastos") || "[]") as Gasto[];
    setGastos(data);
  };

  useEffect(() => {
    refreshGastos();
  }, []);

  // Fecha o modal e atualiza os dados
  const closeModal = () => {
    setShowModal(false);
    refreshGastos();
  };

  // Botão para limpar os dados do localStorage (útil para testes)
  const clearData = () => {
    localStorage.removeItem("gastos");
    setGastos([]);
  };

  // Formata a data de "yyyy-mm-dd" para "dd/mm/yyyy"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Extrai anos e meses únicos para os filtros
  const uniqueYears = Array.from(
    new Set(gastos.map((gasto) => gasto.data.split("-")[0]))
  );
  const uniqueMonths = selectedYear
    ? Array.from(
        new Set(
          gastos
            .filter((gasto) => gasto.data.split("-")[0] === selectedYear)
            .map((gasto) => gasto.data.split("-")[1])
        )
      )
    : [];

  // Filtra os gastos conforme os filtros selecionados
  const filteredGastos = gastos.filter((gasto) => {
    const [year, month] = gasto.data.split("-");
    if (selectedYear && year !== selectedYear) return false;
    if (selectedMonth && month !== selectedMonth) return false;
    return true;
  });

  // --- Paginação ---
  const totalPages = Math.ceil(filteredGastos.length / rowsPerPage);
  const paginatedGastos = filteredGastos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // --- Agregação para o Gráfico de Total de Gastos ---
  const aggregateGastos = () => {
    const aggregation: { [key: string]: number } = {};
    filteredGastos.forEach((gasto) => {
      const [year, month, day] = gasto.data.split("-");
      let key = "";
      if (selectedYear && selectedMonth) {
        key = day;
      } else if (selectedYear) {
        key = month; // Aqui virá "01", "02", etc.
      } else {
        key = year;
      }
      aggregation[key] = (aggregation[key] || 0) + (gasto.preco || 0);
    });
    return aggregation;
  };

  const aggregatedData = aggregateGastos();

  // Objeto para mapear números de meses para nomes em português
  const monthNames: { [key: string]: string } = {
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    "10": "Outubro",
    "11": "Novembro",
    "12": "Dezembro",
  };

  // Prepara os rótulos para o gráfico de Total de Gastos
  const rawLabels = Object.keys(aggregatedData).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  const chartLabels = rawLabels.map((label) => {
    if (selectedYear && !selectedMonth) {
      return monthNames[label] || label;
    }
    return label;
  });
  const chartDataValues = chartLabels.map(
    (_, index) => aggregatedData[rawLabels[index]]
  );

  // Cria arrays de cores condizentes com os valores para Total de Gastos
  const backgroundColors = chartDataValues.map((value) =>
    value >= 0 ? "rgba(0,128,0,0.4)" : "rgba(255,0,0,0.4)"
  );
  const borderColors = chartDataValues.map((value) =>
    value >= 0 ? "rgba(0,128,0,1)" : "rgba(255,0,0,1)"
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total de Gastos (R$)",
        data: chartDataValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  // --- Agregação para Gráficos por Categoria ---
  const aggregateByCategory = () => {
    const aggregation: { [categoria: string]: number } = {};
    filteredGastos.forEach((gasto) => {
      aggregation[gasto.categoria] = (aggregation[gasto.categoria] || 0) + (gasto.preco || 0);
    });
    return aggregation;
  };

  const aggregatedByCategory = aggregateByCategory();
  const categoryLabels = Object.keys(aggregatedByCategory);
  const categoryValues = Object.values(aggregatedByCategory);

  // Dados para gráfico de barras por Categoria
  const categoryBarData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Valor Total por Categoria (R$)",
        data: categoryValues,
        backgroundColor: "rgba(54,162,235,0.4)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
    ],
  };

  // Dados para gráfico de pizza por Categoria
  const categoryPieData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Distribuição por Categoria (%)",
        data: categoryValues,
        backgroundColor: [
          "rgba(255,99,132,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(75,192,192,0.6)",
          "rgba(153,102,255,0.6)",
          "rgba(255,159,64,0.6)",
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54,162,235,1)",
          "rgba(255,206,86,1)",
          "rgba(75,192,192,1)",
          "rgba(153,102,255,1)",
          "rgba(255,159,64,1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // --- Agregação para Gráficos por Tipo de Despesa ---
  const aggregateByTipo = () => {
    const aggregation: { [tipo: string]: number } = {};
    filteredGastos.forEach((gasto) => {
      aggregation[gasto.tipoDespesa] = (aggregation[gasto.tipoDespesa] || 0) + (gasto.preco || 0);
    });
    return aggregation;
  };

  const aggregatedByTipo = aggregateByTipo();
  const tipoLabels = Object.keys(aggregatedByTipo);
  const tipoValues = Object.values(aggregatedByTipo);

  // Dados para gráfico de barras por Tipo de Despesa
  const tipoBarData = {
    labels: tipoLabels,
    datasets: [
      {
        label: "Valor Total por Tipo de Despesa (R$)",
        data: tipoValues,
        backgroundColor: "rgba(153,102,255,0.4)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
      },
    ],
  };

  // Dados para gráfico de pizza por Tipo de Despesa
  const tipoPieData = {
    labels: tipoLabels,
    datasets: [
      {
        label: "Distribuição por Tipo de Despesa (%)",
        data: tipoValues,
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,159,64,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
        ],
        borderColor: [
          "rgba(75,192,192,1)",
          "rgba(255,159,64,1)",
          "rgba(255,99,132,1)",
          "rgba(54,162,235,1)",
          "rgba(255,206,86,1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 p-4">
      <div className="mx-auto bg-white rounded-lg shadow-md p-6 w-full max-w-6xl">
        
        <h1 className="text-center text-2xl font-bold mb-4">Gastos</h1>
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            Adicionar Gasto
          </button>
          <button
            onClick={clearData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Limpar Dados
          </button>
        </div>

        {/* Filtros dinâmicos */}
        <div className="flex gap-4 mb-4 justify-center">
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedMonth("");
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Selecione o Ano</option>
            {uniqueYears.sort().map((year) => (
              <option key={year} value={year}>
                {year}
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
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Selecione o Mês</option>
              {uniqueMonths.sort().map((month) => (
                <option key={month} value={month}>
                  {monthNames[month] || month}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Total Acumulado */}
        <div className="mb-4 text-center">
          <strong>
            Total Acumulado: R${" "}
            {filteredGastos
              .reduce((acc, gasto) => acc + (gasto.preco || 0), 0)
              .toFixed(2)}
          </strong>
        </div>

        {showModal && <ModalGasto onClose={closeModal} />}

        {/* Tabela com Paginação */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm  overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border text-center">Data</th>
                <th className="p-2 border text-center">Preço (R$)</th>
                <th className="p-2 border text-center">Categoria</th>
                <th className="p-2 border text-center">Tipo de Despesa</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGastos.length > 0 ? (
                paginatedGastos.map((gasto, idx) => {
                  const isLast = idx === paginatedGastos.length - 1;
                  return (
                    <tr key={gasto.id} className="border-t">
                      <td className={`p-2 border text-center ${isLast ? "rounded-bl-lg" : ""}`}>{formatDate(gasto.data)}</td>
                      <td className="p-2 border text-center">
                        {gasto.preco != null ? gasto.preco.toFixed(2) : "0.00"}
                      </td>
                      <td className="p-2 border text-center">{gasto.categoria}</td>
                      <td className={`p-2 border text-center ${isLast ? "rounded-br-lg" : ""}`}>{gasto.tipoDespesa}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="p-2 border text-center rounded-b-lg" colSpan={4}>
                    Nenhum dado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((curr) => Math.max(curr - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-300"
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((curr) => Math.min(curr + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-gray-300"
            >
              Próxima
            </button>
          </div>
        )}

        {/* Gráfico de Gastos (Total) */}
        <div className="mt-8">
          <h2 className="text-center text-xl font-bold mb-4">Gráfico de Gastos</h2>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Total de Gastos" },
                },
              }}
            />
          </div>
        </div>

        {/* Gráficos por Categoria */}
        <div className="mt-8">
          <h2 className="text-center text-xl font-bold mb-4">Gráficos por Categoria</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <Bar
                data={categoryBarData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Valor Total por Categoria" },
                  },
                }}
              />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <Pie
                data={categoryPieData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Distribuição (%) por Categoria" },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Gráficos por Tipo de Despesa */}
        <div className="mt-8">
          <h2 className="text-center text-xl font-bold mb-4">Gráficos por Tipo de Despesa</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <Bar
                data={tipoBarData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Valor Total por Tipo de Despesa" },
                  },
                }}
              />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <Pie
                data={tipoPieData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Distribuição (%) por Tipo de Despesa" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gastos;