import { useState } from "react";

interface ModalGastoProps {
  onClose?: () => void;
}

function ModalGasto({ onClose }: ModalGastoProps) {
  const [dataGasto, setDataGasto] = useState(""); // Campo Data agora vem primeiro
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipoDespesa, setTipoDespesa] = useState("");

  const handleSave = () => {
    const novoGasto = {
      id: Date.now(),
      preco: parseFloat(preco),
      categoria,
      tipoDespesa,
      data: dataGasto,
    };

    // Obtém os gastos já salvos ou retorna um array vazio caso ainda não existam
    const gastosExistentes = JSON.parse(localStorage.getItem("gastos") || "[]");
    const novosGastos = [...gastosExistentes, novoGasto];

    localStorage.setItem("gastos", JSON.stringify(novosGastos));

    // Limpa os campos do formulário
    setDataGasto("");
    setPreco("");
    setCategoria("");
    setTipoDespesa("");

    // Fecha o modal se a função onClose for fornecida
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-96 shadow-lg">
        <h2 className="text-center text-purple-600 text-2xl font-bold mb-6">
          Adicionar Gasto
        </h2>

        {/* Campo Data */}
        <div className="mb-6">
          <label htmlFor="data" className="block text-purple-600 mb-1">
            Data
          </label>
          <input
            type="date"
            id="data"
            value={dataGasto}
            onChange={(e) => setDataGasto(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Preço */}
        <div className="mb-4">
          <label htmlFor="preco" className="block text-purple-600 mb-1">
            Preço
          </label>
          <input
            type="number"
            id="preco"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Digite o preço (R$)"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Categoria */}
        <div className="mb-4">
          <label htmlFor="categoria" className="block text-purple-600 mb-1">
            Categoria
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          >
            <option value="">Selecione a categoria</option>
            <option value="luz">Luz</option>
            <option value="agua">Água</option>
            <option value="aluguel">Aluguel</option>
            <option value="internet">Internet</option>
            <option value="folha_pagamento">Folha de Pagamento</option>
            <option value="vale_transporte">Vale Transporte</option>
            <option value="imposto_sobre_folha">Imposto sobre Folha</option>
          </select>
        </div>

        {/* Campo Tipo de Despesa */}
        <div className="mb-6">
          <label htmlFor="tipoDespesa" className="block text-purple-600 mb-1">
            Tipo de Despesa
          </label>
          <select
            id="tipoDespesa"
            value={tipoDespesa}
            onChange={(e) => setTipoDespesa(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          >
            <option value="">Selecione o tipo</option>
            <option value="fixo">Fixo</option>
            <option value="variavel">Variável</option>
          </select>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalGasto;