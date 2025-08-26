// src/features/profile/ChangePasswordModal.tsx
import React, { useState } from 'react';

// Props para o modal
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  // A função onChangePassword receberá a nova senha
  onChangePassword: (newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onChangePassword }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Limpa erros anteriores

    // Validação da senha
    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    // Chama a função para mudar a senha (simulada por enquanto)
    onChangePassword(newPassword);
    onClose(); // Fecha o modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Mudar Senha</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nova Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirmar Nova Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold text-white bg-purple-500 hover:bg-purple-600 transition"
            >
              Mudar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;