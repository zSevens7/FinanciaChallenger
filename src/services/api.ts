// src/services/api.ts
import axios from "axios";

const API_BASE_URL = "https://sevenscash.sevensreview.com.br";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Interceptor de request para debug
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

    // ❌ Removido redirecionamento automático para evitar loop
    // if (error.response?.status === 401) {
    //   localStorage.removeItem("token");
    //   if (!window.location.pathname.includes('/login')) {
    //     window.location.href = "/login";
    //   }
    // }

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