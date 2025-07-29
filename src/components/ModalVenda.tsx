import { useState } from "react";

interface ModalVendaProps {
  onClose?: () => void;
}

function ModalVenda({ onClose }: ModalVendaProps) {
  const [dataVenda, setDataVenda] = useState("");
  const [tipoVenda, setTipoVenda] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const handleSave = () => {
    const novaVenda = {
      id: Date.now(),
      data: dataVenda,
      tipoVenda,
      descricao,
      preco: parseFloat(valor), // <-- Corrigido aqui
    };

    const vendasExistentes = JSON.parse(localStorage.getItem("vendas") || "[]");
    const novasVendas = [...vendasExistentes, novaVenda];
    localStorage.setItem("vendas", JSON.stringify(novasVendas));

    setDataVenda("");
    setTipoVenda("");
    setDescricao("");
    setValor("");

    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-green-600 hover:text-green-800 text-2xl font-bold focus:outline-none"
            aria-label="Fechar"
          >
            ×
          </button>
        )}

        <h2 className="text-center text-green-600 text-2xl font-bold mb-6">
          Adicionar Venda
        </h2>

        {/* Data da Venda */}
        <div className="mb-4">
          <label htmlFor="dataVenda" className="block text-green-600 mb-1">
            Data
          </label>
          <input
            type="date"
            id="dataVenda"
            value={dataVenda}
            onChange={(e) => setDataVenda(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Tipo da Venda */}
        <div className="mb-4">
          <label htmlFor="tipoVenda" className="block text-green-600 mb-1">
            Tipo da Venda
          </label>
          <select
            id="tipoVenda"
            value={tipoVenda}
            onChange={(e) => setTipoVenda(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          >
            <option value="">Selecione o tipo</option>
            <option value="salario">Salário</option>
            <option value="produto">Produto</option>
            <option value="servico">Serviço</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {/* Descrição */}
        <div className="mb-4">
          <label htmlFor="descricao" className="block text-green-600 mb-1">
            Descrição
          </label>
          <input
            type="text"
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Venda de curso online"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Valor */}
        <div className="mb-6">
          <label htmlFor="valor" className="block text-green-600 mb-1">
            Valor (R$)
          </label>
          <input
            type="number"
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Digite o valor"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalVenda;
