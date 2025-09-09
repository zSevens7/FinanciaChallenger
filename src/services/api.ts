// services/api.ts
import axios from "axios";

const API_BASE_URL = "https://sevenscash.sevensreview.com.br/api"; // Substituído localhost pelo subdomínio

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor JWT permanece igual
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
