import { useState, useEffect } from "react";
import ModalVenda from "../components/ModalVenda";
import PageContainer from "../features/gastos/components/PageContainer";

interface Venda {
  id: number;
  data: string;
  tipoCurso: string;
  nomeCliente: string;
  email: string;
  telefone: string;
  valorBruto: number | null;
  desconto: number | null;
  imposto: number | null;
  comissao: number | null;
  valorFinal: number | null;
}

const Vendas = () => {
  const [showModal, setShowModal] = useState(false);
  const [vendas, setVendas] = useState<Venda[]>([]);

  // Função para carregar os dados salvos no localStorage
  const refreshVendas = () => {
    const data = JSON.parse(localStorage.getItem("vendas") || "[]") as Venda[];
    setVendas(data);
  };

  useEffect(() => {
    refreshVendas();
  }, []);

  // Fecha o modal e atualiza os dados
  const closeModal = () => {
    setShowModal(false);
    refreshVendas();
  };

  // Função para limpar os dados do localStorage (para ambiente de testes)
  const clearData = () => {
    localStorage.removeItem("vendas");
    setVendas([]);
  };

  // Função para formatar a data de "yyyy-mm-dd" para "dd/mm/yyyy"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <PageContainer>
      <h1 className="p-6 font-bold text-2xl text-purple-600 border-b border-purple-600 mb-7 ">Vendas</h1>
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-purple-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:grey-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-100"
        >
          Adicionar Venda
        </button>
        <button
          onClick={clearData}
          className="w-full sm:w-auto bg-red-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl hover:grey-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-100"
        >
          Limpar Dados
        </button>
      </div>

      {showModal && <ModalVenda onClose={closeModal} />}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Data</th>
              <th className="p-2 border">Tipo Curso</th>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border hidden min-[601px]:table-cell">Email</th>
              <th className="p-2 border hidden min-[801px]:table-cell">Telefone</th>
              <th className="p-2 border hidden min-[601px]:table-cell">Valor Bruto (R$)</th>
              <th className="p-2 border hidden min-[1001px]:table-cell">Desconto (R$)</th>
              <th className="p-2 border hidden min-[1001px]:table-cell">Imposto (R$)</th>
              <th className="p-2 border hidden min-[1001px]:table-cell">Comissão (R$)</th>
              <th className="p-2 border">Valor Final (R$)</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length > 0 ? (
              vendas.map((venda) => (
                <tr key={venda.id} className="border-t">
                  <td className="p-2 border">{formatDate(venda.data)}</td>
                  <td className="p-2 border">{venda.tipoCurso}</td>
                  <td className="p-2 border">{venda.nomeCliente}</td>
                  <td className="p-2 border hidden min-[601px]:table-cell">
                    {venda.email}
                  </td>
                  <td className="p-2 border hidden min-[801px]:table-cell">
                    {venda.telefone}
                  </td>
                  <td className="p-2 border hidden min-[601px]:table-cell">
                    {venda.valorBruto != null ? venda.valorBruto.toFixed(2) : "0.00"}
                  </td>
                  <td className="p-2 border hidden min-[1001px]:table-cell">
                    {venda.desconto != null ? venda.desconto.toFixed(2) : "0.00"}
                  </td>
                  <td className="p-2 border hidden min-[1001px]:table-cell">
                    {venda.imposto != null ? venda.imposto.toFixed(2) : "0.00"}
                  </td>
                  <td className="p-2 border hidden min-[1001px]:table-cell">
                    {venda.comissao != null ? venda.comissao.toFixed(2) : "0.00"}
                  </td>
                  <td className="p-2 border">
                    {venda.valorFinal != null ? venda.valorFinal.toFixed(2) : "0.00"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan={10}>
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};

export default Vendas;