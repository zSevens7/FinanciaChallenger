import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importe o useNavigate

const LoginPage: React.FC = () => {
  // 1. Gerenciamento de estado dos campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 1. Estado para a mensagem de erro
  const navigate = useNavigate(); // Hook para redirecionamento

  // 2. Função para lidar com o envio do formulário
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Evita o recarregamento da página

    // Lógica de validação simples (mock)
    if (email === "teste@exemplo.com" && password === "senha123") {
      setError(""); // Limpa qualquer erro anterior
      console.log("Login bem-sucedido!");
      // Em uma aplicação real, você faria a chamada para a API aqui
      // Por agora, vamos simular o redirecionamento para o dashboard
      navigate("/dashboard");
    } else {
      // 3. Define a mensagem de erro
      setError("Usuário ou senha inválidos. Por favor, tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-200 via-cyan-400 to-blue-900">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            FinanciaChallenger
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Bem-vindo de volta 👋 Faça login na sua conta
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Exibição da mensagem de erro */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Entrar
            </button>
          </form>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <Link to="/register" className="hover:underline">
              Criar conta
            </Link>
            <Link to="/forgot-password" className="hover:underline">
              Esqueceu a senha?
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

export default LoginPage;