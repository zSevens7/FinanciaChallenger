import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Importa o hook useAuth

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth(); // Obtém a função login e o estado user do contexto

  // 1. Redireciona o usuário se ele já estiver logado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // 2. Função para lidar com o envio do formulário (agora assíncrona)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Limpa qualquer erro anterior

    // 3. Usa a função login do contexto em vez da lógica hardcoded
    const success = await login(email, password);

    if (success) {
      console.log("Login bem-sucedido!");
      // O useEffect acima irá lidar com o redirecionamento
    } else {
      setError("Usuário ou senha inválidos. Por favor, tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-200 via-cyan-400 to-blue-900">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            SevensCash
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