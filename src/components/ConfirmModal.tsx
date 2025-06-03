interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) => {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      {/* Container do modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm transform transition-all">
        {/* Título do modal */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        {/* Mensagem de confirmação */}
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        {/* Botões de ação */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose} // Fecha o modal ao clicar em Cancelar
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => { 
              onConfirm(); // Executa a ação de confirmação
              onClose();  
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
