import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

// Interfaces para as respostas da API
interface ForgotPasswordResponse {
  message: string;
  debug_token?: string;
}

interface PasswordSupportResponse {
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      error: string;
    };
  };
  message: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"email" | "contact">("email");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!email) {
      setError("Por favor, insira seu e-mail.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", { email });
      setMessage(response.data.message);
      
      // Em desenvolvimento, mostre o token (remova em produção)
      if (response.data.debug_token) {
        console.log("Token de recuperação:", response.data.debug_token);
        setMessage(`${response.data.message} Token: ${response.data.debug_token}`);
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.error || error.message || "Erro ao processar solicitação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSupport = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!username) {
      setError("Por favor, insira seu nome de usuário.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<PasswordSupportResponse>("/auth/password-support", { 
        username,
        message: "Usuário não lembra do email associado à conta." 
      });
      setMessage(response.data.message);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.error || error.message || "Erro ao enviar solicitação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-200 via-cyan-400 to-blue-900">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Recuperar Senha
          </h1>
          
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === "email" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("email")}
            >
              Lembro meu e-mail
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === "contact" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("contact")}
            >
              Não lembro o e-mail
            </button>
          </div>

          {activeTab === "email" ? (
            <form className="space-y-4" onSubmit={handleEmailSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={isLoading}
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
                {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nome de usuário
                </label>
                <input
                  type="text"
                  placeholder="Seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={isLoading}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Ao enviar esta solicitação, nossa equipe de suporte entrará em contato 
                  para verificar sua identidade e ajudar na recuperação da conta.
                </p>
              </div>

              <button
                onClick={handleContactSupport}
                disabled={isLoading || !username}
                className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
                  isLoading || !username
                    ? "bg-gray-400 cursor-not-allowed text-gray-200" 
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isLoading ? "Enviando..." : "Solicitar Ajuda do Suporte"}
              </button>

              <div className="text-center text-sm text-gray-600 mt-4">
                <p>Ou entre em contato diretamente:</p>
                <a 
                  href="mailto:gabrielteperino@yahoo.com.br" 
                  className="text-indigo-600 hover:underline"
                >
                  gabrielteperino@yahoo.com.br
                </a>
              </div>
            </div>
          )}

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

export default ForgotPasswordPage;