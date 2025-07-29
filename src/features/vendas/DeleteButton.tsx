// src/features/vendas/DeleteButton.tsx
interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-red-600 hover:text-red-800 transition-colors focus:outline-none"
      aria-label="Deletar venda"
      title="Deletar venda"
    >
      🗑️
    </button>
  );
};
