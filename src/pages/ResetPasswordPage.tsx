import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// Interface para a resposta da API
interface ResetPasswordResponse {
  message: string;
}

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!token) {
      setError("Token de recuperação inválido.");
      setIsLoading(false);
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      // Adicionando a tipagem genérica para a resposta
      const response = await api.post<ResetPasswordResponse>("/auth/reset-password", {
        token,
        newPassword
      });
      
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao redefinir senha.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-cyan-400 to-blue-900">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Token Inválido
          </h1>
          <p className="text-gray-600 text-center mb-6">
            O link de recuperação é inválido ou expirou.
          </p>
          <div className="text-center">
            <Link to="/forgot-password" className="text-indigo-600 hover:underline">
              Solicitar novo link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-200 via-cyan-400 to-blue-900">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Redefinir Senha
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Digite sua nova senha abaixo.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isLoading ? "Processando..." : "Redefinir Senha"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
              {message}
            </div>
          )}

          <div className="text-center mt-4 text-sm text-gray-600">
            <Link to="/login" className="hover:underline text-indigo-600">
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-white text-sm">
        Feito por <span className="font-semibold">Gabriel Teperino Percegoni Figueira</span> •{" "}
        <a
          href="https://github.com/zSevens7"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-200"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default ResetPasswordPage;