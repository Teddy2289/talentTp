// services/modelServiceCrud.ts
import { apiClient } from "../core/api"; // ton axios configuré
import type { Model, CreateModel, UpdateModel } from "../types/model";

const API_URL = "/models";

export const modelServiceCrud = {
  async getAll(): Promise<Model[]> {
    const { data } = await apiClient.get<{ data: Model[] }>(API_URL);
    return data.data;
  },

  async getById(id: number): Promise<Model> {
    const { data } = await apiClient.get<{ data: Model }>(`${API_URL}/${id}`);
    return data.data;
  },

  async create(model: CreateModel, photo?: File): Promise<Model> {
    const formData = new FormData();
    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (photo) formData.append("photo", photo);

    const { data } = await apiClient.upload<{ data: Model }>(API_URL, formData);
    return data.data;
  },

  async update(id: number, model: UpdateModel, photo?: File): Promise<Model> {
    const formData = new FormData();
    Object.entries(model).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (photo) formData.append("photo", photo);

    const { data } = await apiClient.put<{ data: Model }>(
      `${API_URL}/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`${API_URL}/${id}`);
  },
};
