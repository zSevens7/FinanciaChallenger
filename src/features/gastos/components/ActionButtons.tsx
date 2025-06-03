interface ActionButtonsProps {
  onAdicionarGasto: () => void
  onLimparDados: () => void
}

export const ActionButtons = ({ onAdicionarGasto, onLimparDados }: ActionButtonsProps) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
    <button
      onClick={onAdicionarGasto}
      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
    >
      Adicionar Gasto
    </button>
    <button
      onClick={onLimparDados}
      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
    >
      Limpar Dados
    </button>
  </div>
)
