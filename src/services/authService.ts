import axios from "axios";
import type { LoginResponse, RegisterData } from "../types/authType";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  },

  async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur d'inscription");
    }
  },

  async getProfile(): Promise<any> {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erreur de récupération du profil"
      );
    }
  },

  async verifyEmail(userId: number, token: string): Promise<LoginResponse> {
    try {
      const response = await api.get(
        `/auth/verify-email?userId=${userId}&token=${token}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erreur de vérification"
      );
    }
  },
};
