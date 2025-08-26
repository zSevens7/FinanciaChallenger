import { useState } from "react";
// ✅ CORREÇÃO: Importe Gasto e GastoInput do seu arquivo de tipos, se existir, para maior consistência
// Se não, mantenha a importação do GastosContext
import { Gasto } from "../types/index";

interface ModalGastoProps {
  onClose?: () => void;
  onSave: (newGasto: Omit<Gasto, 'id'>) => void; // ✅ ADICIONADO: Prop onSave para passar o novo gasto
}

// Omitindo 'id' para a entrada, já que o contexto o gerará
type GastoInput = Omit<Gasto, "id">;

function ModalGasto({ onClose, onSave }: ModalGastoProps) { // ✅ ADICIONADO: Prop onSave
  const [inputGasto, setInputGasto] = useState<GastoInput>({
    descricao: "", 
    preco: 0, // ✅ CORREÇÃO: Mudado de 'valor' para 'preco' para consistência
    data: new Date().toISOString().split("T")[0],
    categoria: "",
    tipo: "", 
    nome: "", // ✅ ADICIONADO: Propriedade 'nome'
    tipoDespesa: "", // ✅ ADICIONADO: Propriedade 'tipoDespesa'
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputGasto((prev) => ({
      ...prev,
      [name]: name === 'preco' ? parseFloat(value) : value, // ✅ CORREÇÃO: Mudado de 'valor' para 'preco'
    }));
  };

  const handleSave = () => {
    // ✅ CORREÇÃO: Validação alterada para usar 'preco'
    if (
      !inputGasto.data ||
      !inputGasto.descricao.trim() ||
      !inputGasto.preco ||
      isNaN(inputGasto.preco) ||
      inputGasto.preco <= 0 ||
      !inputGasto.categoria ||
      !inputGasto.tipo
    ) {
      setError("Por favor, preencha todos os campos corretamente e com valores válidos.");
      return;
    }
    
    // ✅ CORREÇÃO: Gasto enviado com a propriedade 'preco'
    const newGasto: Omit<Gasto, 'id'> = {
        ...inputGasto,
        nome: inputGasto.descricao, // Adicionando 'nome'
        tipoDespesa: inputGasto.tipo, // Adicionando 'tipoDespesa'
        preco: inputGasto.preco > 0 ? inputGasto.preco : 0, // Garantindo que o preco não seja negativo
    };

    onSave(newGasto); // ✅ CORREÇÃO: Chama a função onSave recebida por props
    
    // Limpe os campos do formulário
    setInputGasto({
      descricao: "",
      preco: 0,
      data: new Date().toISOString().split("T")[0],
      categoria: "",
      tipo: "",
      nome: "",
      tipoDespesa: "",
    });
    
    // Feche o modal
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all relative">
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Campo Data */}
        <div className="mb-4">
          <label htmlFor="data" className="block text-red-500 mb-1 font-medium">Data</label>
          <input
            type="date"
            id="data"
            name="data"
            value={inputGasto.data}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Campo Nome do Gasto */}
        <div className="mb-4">
          <label htmlFor="descricao" className="block text-red-500 mb-1 font-medium">Nome do Gasto</label>
          <input
            type="text"
            id="descricao"
            name="descricao"
            value={inputGasto.descricao}
            onChange={handleChange}
            placeholder="Digite o nome"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Campo Preço */}
        <div className="mb-4">
          <label htmlFor="preco" className="block text-red-500 mb-1 font-medium">Preço (R$)</label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={inputGasto.preco === 0 ? "" : inputGasto.preco}
            onChange={handleChange}
            placeholder="Digite o preço"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Campo Categoria */}
        <div className="mb-4">
          <label htmlFor="categoria" className="block text-red-500 mb-1 font-medium">Categoria</label>
          <select
            id="categoria"
            name="categoria"
            value={inputGasto.categoria}
            onChange={handleChange}
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
          <label htmlFor="tipo" className="block text-red-500 mb-1 font-medium">Tipo de Despesa</label>
          <select
            id="tipo"
            name="tipo"
            value={inputGasto.tipo}
            onChange={handleChange}
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