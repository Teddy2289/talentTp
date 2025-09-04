import axios from "axios";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/userTypes";

const API_URL = "http://localhost:3000/api/users";

export const userService = {
  // Récupérer tous les utilisateurs
  getAll: async (token: string): Promise<User[]> => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },

  // Récupérer un utilisateur par ID
  getById: async (id: number, token: string): Promise<User> => {
    const res = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },

  // Créer un nouvel utilisateur
  create: async (userData: CreateUserRequest, token: string): Promise<User> => {
    const res = await axios.post(API_URL, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },

  // Mettre à jour un utilisateur
  update: async (
    id: number,
    userData: UpdateUserRequest,
    token: string
  ): Promise<User> => {
    const res = await axios.put(`${API_URL}/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },

  // Supprimer un utilisateur
  delete: async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Rechercher des utilisateurs
  search: async (
    criteria: {
      email?: string;
      first_name?: string;
      last_name?: string;
      type?: string;
      is_verified?: boolean;
    },
    token: string
  ): Promise<User[]> => {
    const params = new URLSearchParams();

    if (criteria.email) params.append("email", criteria.email);
    if (criteria.first_name) params.append("first_name", criteria.first_name);
    if (criteria.last_name) params.append("last_name", criteria.last_name);
    if (criteria.type) params.append("type", criteria.type);
    if (criteria.is_verified !== undefined)
      params.append("is_verified", criteria.is_verified.toString());

    const res = await axios.get(`${API_URL}/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  },
};
