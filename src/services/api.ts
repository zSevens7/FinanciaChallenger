import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para adicionar token JWT a cada requisição
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar 401 (token expirado ou inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // Remove o token
      window.location.href = "/login"; // Redireciona para login
    }
    return Promise.reject(error);
  }
);

export default api;
