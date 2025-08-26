// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleEffect from '../components/ui/tittle';
import { PenIcon, KeyRound, LogOut } from 'lucide-react';

// Importe os modais
import EditProfileModal from '../features/profile/EditProfileModal';
import ChangePasswordModal from '../features/profile/ChangePasswordModal';

type User = {
    name: string;
    email: string;
    memberSince: string;
};

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    // Simula dados do usuário por enquanto
    const [user, setUser] = useState<User>({
        name: "Gabriel Teperino",
        email: "gabriel.teperino@example.com",
        memberSince: "26 de Agosto de 2025",
    });

    // Estados para controlar a visibilidade dos modais
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    // Funções para abrir/fechar os modais
    const handleEditProfile = () => setIsEditModalOpen(true);
    const handleChangePassword = () => setIsChangePasswordModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleCloseChangePasswordModal = () => setIsChangePasswordModalOpen(false);

    // Lógica para salvar o perfil (simulada)
    const handleSaveProfile = (updatedUser: Partial<User>) => {
        console.log("Salvando perfil...", updatedUser);
        setUser({ ...user, ...updatedUser }); // <-- Correção aqui
    };

    // Lógica para mudar a senha (simulada)
    const handleSavePassword = (newPassword: string) => {
        console.log("Senha alterada com sucesso!", newPassword);
        // Futuramente, aqui você faria a chamada para o backend
        // E talvez mostrasse uma mensagem de sucesso para o usuário
    };

    const handleLogout = () => {
        console.log("Logout bem-sucedido!");
        navigate('/');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <TitleEffect baseTitle="Perfil" icon="👤" />
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Meu Perfil</h1>
                
                {/* Seção de Informações do Usuário */}
                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Nome</label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">{user.name}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Membro desde</label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">{user.memberSince}</p>
                    </div>
                </div>
                
                {/* Seção de Ações */}
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

            {/* Renderização condicional dos modais */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSaveProfile}
                user={user}
            />

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={handleCloseChangePasswordModal}
                onChangePassword={handleSavePassword}
            />
        </div>
    );
};

export default ProfilePage;