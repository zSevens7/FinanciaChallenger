import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Lógica de validação básica do e-mail
    if (!email) {
      setError("Por favor, insira seu e-mail.");
      setMessage(""); // Limpa a mensagem de sucesso se houver um erro
      return;
    }
    
    // Simula a lógica de recuperação de senha
    // Em uma aplicação real, aqui você faria uma chamada para a API.
    setError(""); // Limpa qualquer erro anterior
    setMessage("Um link de recuperação de senha foi enviado para seu e-mail.");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-200 via-cyan-400 to-blue-900">
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Recuperar Senha
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Insira o e-mail associado à sua conta.
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

            {/* Exibição da mensagem de erro ou sucesso */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Enviar Link
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            <Link to="/login" className="hover:underline">
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