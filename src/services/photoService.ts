import axios from "axios";
import type { Photo } from "../types/photoType";

const API_URL = "http://localhost:3000/api/photos";

export const photoService = {
  // Dans photoService.ts
  getAll: async (token?: string): Promise<Photo[]> => {
    const res = await axios.get(API_URL, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data.data;
  },

  create: async (formData: FormData, token: string): Promise<Photo> => {
    const res = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  update: async (
    id: number,
    formData: FormData,
    token: string
  ): Promise<Photo> => {
    const res = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  delete: async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getById: async (id: number, token?: string): Promise<Photo> => {
    const res = await axios.get(`${API_URL}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data.data;
  },
};
