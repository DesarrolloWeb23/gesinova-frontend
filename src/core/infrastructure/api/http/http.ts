import axios from 'axios'
import { showSessionModal } from "@/ui/components/SessionModalManager";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const http = axios.create({
  baseURL: `${baseURL}`, // Ajusta si tu backend cambia
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

http.interceptors.request.use(
  async (config) => {
    const excludedRoutes = ["/auth/login", "/auth/refresh", "/auth/verify-mfa", "/auth/logout", "/auth/reset-password"];

    
      // Evita aplicar el interceptor en rutas excluidas
      if (excludedRoutes.some((route) => config.url?.includes(route))) {
        return config;
      }

      try {
          
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          if (!token) {
          const response = await axios.post(
            `${baseURL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newToken = response.data.data.accessToken;
          if (localStorage.getItem("rememberMe") === "true") {
            localStorage.setItem("token", newToken);
          }
          else {
            sessionStorage.setItem("token", newToken);
          }

          config.headers.Authorization = `Bearer ${newToken}`;
          return config;
        }

        config.headers.Authorization = `Bearer ${token}`;
        return config;
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(error);
      }
  },
  (error) => Promise.reject(error)
);



http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    

    if (error.response?.status === 429) {
      //corregir  ya que la api va a responder con la estructura de ApiErrorDTO
      const type = 'Error de negocio';
      const path = originalRequest.url; 
      const timestamp = new Date().toISOString();
      const message = error.response?.data?.message || "Demasiadas peticiones. Intenta más tarde.";

      error.response.data = { message };
      error.response.data.path = path;
      error.response.data.error = type;
      error.response.data.timestamp = timestamp;
      error.response.data.status = error.response?.status;
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const shouldRenew = await showSessionModal();
      if (shouldRenew) {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) {
            const response = await axios.post(
              `${baseURL}/auth/refresh`,
              {},
              { withCredentials: true }
            );
    
            const newToken = response.data.data.accessToken ;

            if (localStorage.getItem("rememberMe") === "true") {
              localStorage.setItem("token", newToken);
            }
            else {
              sessionStorage.setItem("token", newToken);
            }

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return http(originalRequest);

        } catch (refreshError) {
          localStorage.removeItem("token");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      } else {
        // logout();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);  
  }
);

export default http;