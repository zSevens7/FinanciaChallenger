import { useState, useEffect } from "react";
import ModalGasto from "../components/ModalGasto";

interface Gasto {
  id: number;
  preco: number | null;
  categoria: string;
  tipoDespesa: string;
  data: string;
}

const Gastos = () => {
  const [showModal, setShowModal] = useState(false);
  const [gastos, setGastos] = useState<Gasto[]>([]);

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

  // Função para formatar a data do formato "yyyy-mm-dd" para "dd/mm/yyyy"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-4">
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

      {showModal && <ModalGasto onClose={closeModal} />}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Data</th>
              <th className="p-2 border">Preço (R$)</th>
              <th className="p-2 border">Categoria</th>
              <th className="p-2 border">Tipo de Despesa</th>
            </tr>
          </thead>
          <tbody>
            {gastos.length > 0 ? (
              gastos.map((gasto) => (
                <tr key={gasto.id} className="border-t">
                  <td className="p-2 border">{formatDate(gasto.data)}</td>
                  <td className="p-2 border">
                    {gasto.preco != null ? gasto.preco.toFixed(2) : "0.00"}
                  </td>
                  <td className="p-2 border">{gasto.categoria}</td>
                  <td className="p-2 border">{gasto.tipoDespesa}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan={4}>
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gastos;