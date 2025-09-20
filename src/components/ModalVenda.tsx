import { useState } from "react";
import { useVendas } from "../contexts/VendasContext";
import { VendaInput } from "../types/index";

interface ModalVendaProps {
  onClose?: () => void;
  onSave?: (vendaData: VendaInput) => Promise<void>;
}

function ModalVenda({ onClose, onSave }: ModalVendaProps) {
  const { addVenda } = useVendas();

  const [inputVenda, setInputVenda] = useState<VendaInput>({
    data: new Date().toISOString().split("T")[0],
    descricao: "",
    preco: 0,
    tipoVenda: "produto",
    comentario: "",
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
      const payload: VendaInput = {
        ...inputVenda,
        valor: inputVenda.preco, // compatibilidade backend
      };

      if (onSave) {
        await onSave(payload);
      } else {
        await addVenda(payload);
      }

      // Reset do formulário
      setInputVenda({
        data: new Date().toISOString().split("T")[0],
        descricao: "",
        preco: 0,
        tipoVenda: "produto",
        comentario: "",
      });

      setError("");
      if (onClose) onClose();
    } catch (err) {
      console.error("Erro ao salvar venda:", err);
      setError("Erro ao adicionar venda. Tente novamente.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto z-50">
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
            placeholder="Ex: Venda de serviço"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="preco" className="block text-green-600 mb-1">
            Valor (R$)
          </label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={inputVenda.preco}
            onChange={handleChange}
            placeholder="Digite o valor"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-green-600"
          />
        </div>

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
