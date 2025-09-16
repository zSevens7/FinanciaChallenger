// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleEffect from '../components/ui/tittle';
import { PenIcon, KeyRound, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // <- Contexto

import EditProfileModal from '../features/profile/EditProfileModal';
import ChangePasswordModal from '../features/profile/ChangePasswordModal';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  // Estados para controlar os modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const handleEditProfile = () => setIsEditModalOpen(true);
  const handleChangePassword = () => setIsChangePasswordModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleCloseChangePasswordModal = () => setIsChangePasswordModalOpen(false);

  const handleLogout = () => {
    logout();
    console.log("Logout bem-sucedido!");
    navigate('/'); // redireciona para login
  };

  // Se não houver usuário carregado, exibe loading
  if (!user) return <p>Carregando...</p>;

  // Mapeia user do contexto para o formato esperado pelos modais
  const mappedUser = { name: user.username, email: user.email };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <TitleEffect baseTitle="Perfil" icon="👤" />

      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Meu Perfil</h1>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nome</label>
            <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              {mappedUser.name}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              {mappedUser.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleEditProfile}
            className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            <PenIcon className="w-5 h-5" />
            <span>Editar Perfil</span>
          </button>

          <button
            onClick={handleChangePassword}
            className="w-full flex items-center justify-center space-x-2 bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition duration-300"
          >
            <KeyRound className="w-5 h-5" />
            <span>Mudar Senha</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Modais */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={async (updatedUser) => {
          const success = await updateProfile(updatedUser.name, updatedUser.email);
          if (success) handleCloseEditModal();
        }}
        user={mappedUser}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={handleCloseChangePasswordModal}
        onChangePassword={(newPassword) => console.log("Senha alterada:", newPassword)}
      />
    </div>
  );
};

export default ProfilePage;
