// services/categoryServiceCrud.ts
import { apiClient } from "../core/api";
import type {
  Categorie,
  CreateCategorie,
  UpdateCategorie,
} from "../types/category";

const API_URL = "/categories";

export const categoryServiceCrud = {
  async getAll(): Promise<Categorie[]> {
    const { data } = await apiClient.get<{ data: Categorie[] }>(API_URL);
    return data.data;
  },

  async getById(id: number): Promise<Categorie> {
    const { data } = await apiClient.get<{ data: Categorie }>(
      `${API_URL}/${id}`
    );
    return data.data;
  },

  async getBySlug(slug: string): Promise<Categorie> {
    const { data } = await apiClient.get<{ data: Categorie }>(
      `${API_URL}/slug/${slug}`
    );
    return data.data;
  },

  async create(category: CreateCategorie): Promise<Categorie> {
    const { data } = await apiClient.post<{ data: Categorie }>(
      API_URL,
      category
    );
    return data.data;
  },

  async update(id: number, category: UpdateCategorie): Promise<Categorie> {
    const { data } = await apiClient.put<{ data: Categorie }>(
      `${API_URL}/${id}`,
      category
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`${API_URL}/${id}`);
  },

  async getModelsByCategory(categoryId: number): Promise<any[]> {
    const { data } = await apiClient.get<{ data: any[] }>(
      `${API_URL}/${categoryId}/models`
    );
    return data.data;
  },

  async addModelToCategory(categoryId: number, modelId: number): Promise<void> {
    await apiClient.post(`${API_URL}/${categoryId}/models/${modelId}`);
  },

  async removeModelFromCategory(
    categoryId: number,
    modelId: number
  ): Promise<void> {
    await apiClient.delete(`${API_URL}/${categoryId}/models/${modelId}`);
  },
};
