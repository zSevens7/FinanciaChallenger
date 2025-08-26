import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Importa o hook useAuth

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth(); // Obtém a função de registro do contexto

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Limpa erros anteriores

    // 1. Validações básicas no frontend (ainda são importantes!)
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    
    // 2. Chama a função de registro do contexto
    const success = await register({ name, email, password });

    if (success) {
      console.log("Usuário registrado com sucesso!");
      navigate("/"); // Redireciona para a página de login após o registro
    } else {
      // 3. Define a mensagem de erro com base no retorno do contexto
      setError("Erro ao registrar. O e-mail pode já estar em uso.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-200 via-cyan-400 to-blue-900">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Criar sua conta
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Junte-se ao FinanciaChallenger hoje mesmo!
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* ... os campos Nome, Email, Senha e Confirmar Senha permanecem os mesmos ... */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nome
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            
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

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Registrar
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link to="/login" className="hover:underline">
              Entrar
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

export default RegisterPage;