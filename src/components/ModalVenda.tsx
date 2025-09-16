import { useState } from "react";
import { useVendas } from "../contexts/VendasContext";
import { VendaInput } from "../types/index";

interface ModalVendaProps {
  onClose?: () => void;
  onSave?: (vendaData: VendaInput) => Promise<void>; // opcional, para usar se quiser sobrescrever addVenda
}

function ModalVenda({ onClose, onSave }: ModalVendaProps) {
  const { addVenda } = useVendas();

  const [inputVenda, setInputVenda] = useState<Omit<VendaInput, "valor">>({
    data: new Date().toISOString().split("T")[0],
    descricao: "",
    preco: 0,
    tipoVenda: "produto",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setInputVenda((prev) => ({
      ...prev,
      [name]: name === "preco" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    if (
      !inputVenda.data ||
      !inputVenda.descricao.trim() ||
      !inputVenda.preco ||
      isNaN(inputVenda.preco) ||
      inputVenda.preco <= 0 ||
      !inputVenda.tipoVenda
    ) {
      setError(
        "Por favor, preencha todos os campos corretamente e com valores válidos."
      );
      return;
    }

    try {
      // Payload para enviar ao backend
      const payload: VendaInput = {
        ...inputVenda,
        valor: inputVenda.preco, // valor obrigatório para backend
      };

      if (onSave) {
        await onSave(payload); // se onSave foi passado pelo parent
      } else {
        await addVenda(payload); // fallback: usa contexto
      }

      // reset form
      setInputVenda({
        data: new Date().toISOString().split("T")[0],
        descricao: "",
        preco: 0,
        tipoVenda: "produto",
      });

      setError("");
      if (onClose) onClose();
    } catch (err) {
      setError("Erro ao adicionar venda. Tente novamente.");
      console.error("Erro ao salvar venda:", err);
    }
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

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Data */}
        <div className="mb-4">
          <label htmlFor="dataVenda" className="block text-green-600 mb-1">
            Data
          </label>
          <input
            type="date"
            id="dataVenda"
            name="data"
            value={inputVenda.data}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Descrição */}
        <div className="mb-4">
          <label htmlFor="descricao" className="block text-green-600 mb-1">
            Descrição
          </label>
          <input
            type="text"
            id="descricao"
            name="descricao"
            value={inputVenda.descricao}
            onChange={handleChange}
            placeholder="Ex: Venda de curso online"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Valor */}
        <div className="mb-6">
          <label htmlFor="preco" className="block text-green-600 mb-1">
            Valor (R$)
          </label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={inputVenda.preco === 0 ? "" : inputVenda.preco}
            onChange={handleChange}
            placeholder="Digite o valor"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Tipo de Venda */}
        <div className="mb-4">
          <label htmlFor="tipoVenda" className="block text-green-600 mb-1">
            Tipo de Venda
          </label>
          <select
            id="tipoVenda"
            name="tipoVenda"
            value={inputVenda.tipoVenda}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          >
            <option value="salario">Salário</option>
            <option value="produto">Produto</option>
            <option value="servico">Serviço</option>
          </select>
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
