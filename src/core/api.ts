import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Configuration de base de l'API
const API_BASE_URL = "http://localhost:3000/api";

// Création de l'instance axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log des requêtes en développement
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        config
      );
    }

    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ API Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log des réponses en développement
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.status} ${response.config.url}`,
        response.data
      );
    }

    return response;
  },
  (error) => {
    // Gestion centralisée des erreurs
    if (process.env.NODE_ENV === "development") {
      console.error(
        "❌ API Response Error:",
        error.response?.data || error.message
      );
    }

    // Gestion des erreurs HTTP
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Non authentifié - rediriger vers login
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;

        case 403:
          // Non autorisé
          console.error("Accès refusé");
          break;

        case 404:
          // Ressource non trouvée
          console.error("Ressource non trouvée");
          break;

        case 500:
          // Erreur serveur
          console.error("Erreur interne du serveur");
          break;

        default:
          console.error(
            `Erreur HTTP ${status}:`,
            data?.message || "Erreur inconnue"
          );
      }
    } else if (error.request) {
      // Erreur réseau
      console.error("Erreur réseau - Le serveur ne répond pas");
    } else {
      // Erreur inconnue
      console.error("Erreur inconnue:", error.message);
    }

    return Promise.reject(error);
  }
);

// Fonctions utilitaires pour les requêtes API
export const apiClient = {
  // GET
  get: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.get<T>(url, config);
  },

  // POST
  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, data, config);
  },

  // PUT
  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.put<T>(url, data, config);
  },

  // PATCH
  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.patch<T>(url, data, config);
  },

  // DELETE
  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.delete<T>(url, config);
  },

  // UPLOAD (pour les fichiers)
  upload: <T>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },
};

// Export de l'instance axios pour des utilisations spécifiques
export default api;
