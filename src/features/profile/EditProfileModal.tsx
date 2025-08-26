// src/features/profile/EditProfileModal.tsx
import React, { useState } from 'react';

// Props para o modal, incluindo a função de fechar e os dados do usuário
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: { name: string; email: string }) => void;
  user: {
    name: string;
    email: string;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave, user }) => {
  // Estado local para os campos de edição
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    // Chama a função onSave com os novos dados
    onSave({ name, email });
    onClose(); // Fecha o modal após salvar
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
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
              className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;