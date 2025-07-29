import { useState } from "react";
import type { Gasto } from "../types";

interface ModalGastoProps {
  onClose?: () => void;
}

function ModalGasto({ onClose }: ModalGastoProps) {
  const [dataGasto, setDataGasto] = useState(new Date().toISOString().split("T")[0]);
  const [nomeGasto, setNomeGasto] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipoDespesa, setTipoDespesa] = useState("");

  const handleSave = () => {
    if (
      !dataGasto ||
      !nomeGasto.trim() ||
      !preco ||
      isNaN(parseFloat(preco)) ||
      parseFloat(preco) <= 0 ||
      !categoria ||
      !tipoDespesa
    ) {
      alert("Por favor, preencha todos os campos corretamente e com valores válidos.");
      return;
    }

    const precoNum = parseFloat(preco);
    const precoNegativo = precoNum > 0 ? precoNum * -1 : precoNum;

    const novoGasto: Gasto = {
      id: Date.now(),
      data: dataGasto,
      nome: nomeGasto.trim(),
      preco: precoNegativo,
      categoria,
      tipoDespesa,
    };

    const gastosExistentes = JSON.parse(localStorage.getItem("gastos") || "[]") as Gasto[];
    const novosGastos = [...gastosExistentes, novoGasto];

    localStorage.setItem("gastos", JSON.stringify(novosGastos));

    setDataGasto(new Date().toISOString().split("T")[0]);
    setNomeGasto("");
    setPreco("");
    setCategoria("");
    setTipoDespesa("");

    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all relative">

        {/* Botão de Fechar "X" */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl font-bold focus:outline-none"
            aria-label="Fechar"
          >
            ×
          </button>
        )}

        <h2 className="text-red-500 text-2xl font-bold mb-6 text-center">
          Adicionar Gasto
        </h2>

        {/* Campo Data */}
        <div className="mb-4">
          <label htmlFor="data" className="block text-red-500 mb-1 font-medium">
            Data
          </label>
          <input
            type="date"
            id="data"
            value={dataGasto}
            onChange={(e) => setDataGasto(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Campo Nome do Gasto */}
        <div className="mb-4">
          <label htmlFor="nomeGasto" className="block text-red-500 mb-1 font-medium">
            Nome do Gasto
          </label>
          <input
            type="text"
            id="nomeGasto"
            value={nomeGasto}
            onChange={(e) => setNomeGasto(e.target.value)}
            placeholder="Digite o nome"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Campo Preço */}
        <div className="mb-4">
          <label htmlFor="preco" className="block text-red-500 mb-1 font-medium">
            Preço (R$)
          </label>
          <input
            type="number"
            id="preco"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Digite o preço"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Campo Categoria */}
        <div className="mb-4">
          <label htmlFor="categoria" className="block text-red-500 mb-1 font-medium">
            Categoria
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-red-500 bg-white"
          >
            <option value="">Selecione a categoria</option>
            <option value="moradia">Moradia (Aluguel, Condomínio)</option>
            <option value="contas_casa">Contas (Luz, Água, Gás)</option>
            <option value="internet_telefone">Internet e Telefone</option>
            <option value="impostos_taxas">Impostos e Taxas</option>
            <option value="investimentos_poupanca">Investimentos</option>
            <option value="dividas_emprestimos">Dívidas/Empréstimos</option>
            <option value="folha_pagamento">Folha de Pagamento (Empresarial)</option>
            <option value="vale_transporte">Vales Transporte (Empresarial)</option>
            <option value="imposto_sobre_folha">Imposto sobre Folha (Empresarial)</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        {/* Campo Tipo de Despesa */}
        <div className="mb-6">
          <label htmlFor="tipoDespesa" className="block text-red-500 mb-1 font-medium">
            Tipo de Despesa
          </label>
          <select
            id="tipoDespesa"
            value={tipoDespesa}
            onChange={(e) => setTipoDespesa(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-red-500 bg-white"
          >
            <option value="">Selecione o tipo</option>
            <option value="fixo_essencial">Fixo Essencial</option>
            <option value="fixo_nao_essencial">Fixo Não Essencial</option>
            <option value="variavel_essencial">Variável Essencial</option>
            <option value="variavel_nao_essencial">Variável Não Essencial</option>
            <option value="investimento">Investimento</option>
            <option value="extraordinario">Extraordinário/Inesperado</option>
            <option value="recorrente">Recorrente (Assinaturas)</option>
            <option value="unico">Único</option>
            <option value="outro_tipo">Outro Tipo</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleSave}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalGasto;
