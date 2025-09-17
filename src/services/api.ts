import axios from "axios";

const API_BASE_URL = "https://sevenscash.sevensreview.com.br/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: { "Content-Type": "application/json" } // <--- aqui
});

// Interceptor de request para debug
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🟡 Fazendo requisição para: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('🟡 Headers:', config.headers);

    return config;
  },
  (error) => {
    console.error('🔴 Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response
api.interceptors.response.use(
  (response) => {
    console.log('🟢 Resposta recebida:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('🔴 Erro na resposta:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
