import { useState } from "react";

interface ModalVendaProps {
  onClose?: () => void;
}

function ModalVenda({ onClose }: ModalVendaProps) {
  const [dataVenda, setDataVenda] = useState("");
  const [tipoCurso, setTipoCurso] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [valorBruto, setValorBruto] = useState("");
  const [desconto, setDesconto] = useState("");
  const [imposto, setImposto] = useState("");
  const [comissao, setComissao] = useState("");
  const [valorFinal, setValorFinal] = useState("");

  const handleSave = () => {
    const novaVenda = {
      id: Date.now(),
      data: dataVenda,
      tipoCurso,
      nomeCliente,
      email,
      telefone,
      valorBruto: parseFloat(valorBruto),
      desconto: parseFloat(desconto),
      imposto: parseFloat(imposto),
      comissao: parseFloat(comissao),
      valorFinal: parseFloat(valorFinal),
    };

    const vendasExistentes = JSON.parse(localStorage.getItem("vendas") || "[]");
    const novasVendas = [...vendasExistentes, novaVenda];
    localStorage.setItem("vendas", JSON.stringify(novasVendas));

    setDataVenda("");
    setTipoCurso("");
    setNomeCliente("");
    setEmail("");
    setTelefone("");
    setValorBruto("");
    setDesconto("");
    setImposto("");
    setComissao("");
    setValorFinal("");

    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto relative">
        
        {/* Botão Fechar */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-purple-600 hover:text-purple-800 text-2xl font-bold focus:outline-none"
            aria-label="Fechar"
          >
            ×
          </button>
        )}

        <h2 className="text-center text-purple-600 text-2xl font-bold mb-6">
          Adicionar Vendas
        </h2>

        {/* Campo Data */}
        <div className="mb-4">
          <label htmlFor="dataVenda" className="block text-purple-600 mb-1">
            Data
          </label>
          <input
            type="date"
            id="dataVenda"
            value={dataVenda}
            onChange={(e) => setDataVenda(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Tipo de Curso */}
        <div className="mb-4">
          <label htmlFor="tipoCurso" className="block text-purple-600 mb-1">
            Tipo de Curso
          </label>
          <select
            id="tipoCurso"
            value={tipoCurso}
            onChange={(e) => setTipoCurso(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          >
            <option value="">Selecione o tipo</option>
            <option value="online">Online</option>
            <option value="presencial">Presencial</option>
          </select>
        </div>

        {/* Campo Nome do Cliente */}
        <div className="mb-4">
          <label htmlFor="nomeCliente" className="block text-purple-600 mb-1">
            Nome do Cliente
          </label>
          <input
            type="text"
            id="nomeCliente"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            placeholder="Digite o nome completo"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-purple-600 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o email"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Telefone */}
        <div className="mb-4">
          <label htmlFor="telefone" className="block text-purple-600 mb-1">
            Telefone
          </label>
          <input
            type="tel"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Digite o telefone"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Valor Bruto */}
        <div className="mb-4">
          <label htmlFor="valorBruto" className="block text-purple-600 mb-1">
            Valor Bruto (R$)
          </label>
          <input
            type="number"
            id="valorBruto"
            value={valorBruto}
            onChange={(e) => setValorBruto(e.target.value)}
            placeholder="Digite o valor bruto"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Desconto */}
        <div className="mb-4">
          <label htmlFor="desconto" className="block text-purple-600 mb-1">
            Descontos Aplicados (R$)
          </label>
          <input
            type="number"
            id="desconto"
            value={desconto}
            onChange={(e) => setDesconto(e.target.value)}
            placeholder="Digite o desconto aplicado"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Imposto */}
        <div className="mb-4">
          <label htmlFor="imposto" className="block text-purple-600 mb-1">
            Impostos, Comissões e Taxas (R$)
          </label>
          <input
            type="number"
            id="imposto"
            value={imposto}
            onChange={(e) => setImposto(e.target.value)}
            placeholder="Digite o valor de impostos, comissões e taxas"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Comissão */}
        <div className="mb-4">
          <label htmlFor="comissao" className="block text-purple-600 mb-1">
            Comissão (R$)
          </label>
          <input
            type="number"
            id="comissao"
            value={comissao}
            onChange={(e) => setComissao(e.target.value)}
            placeholder="Digite a comissão"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Campo Valor Final */}
        <div className="mb-6">
          <label htmlFor="valorFinal" className="block text-purple-600 mb-1">
            Valor Final (R$)
          </label>
          <input
            type="number"
            id="valorFinal"
            value={valorFinal}
            onChange={(e) => setValorFinal(e.target.value)}
            placeholder="Digite o valor final da venda"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-600"
          />
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

export default ModalVenda;