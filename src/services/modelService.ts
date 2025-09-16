// services/modelService.ts
import { apiClient } from "./../core/api";

export interface Model {
  id: number;
  prenom: string;
  age: number;
  nationalite: string;
  passe_temps: string;
  citation: string;
  domicile: string;
  profession: string;
  localisation: string;
  photo: string;
  created_at: string;
  updated_at: string;
}

class ModelService {
  // Récupérer tous les modèles
  async getAllModels(): Promise<Model[]> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: Model[];
      count: number;
    }>("/models");
    return response.data.data;
  }

  // Récupérer un modèle par ID
  async getModel(id: number): Promise<Model> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: Model;
    }>(`/models/${id}`);
    return response.data.data;
  }

  // Créer un nouveau modèle
  async createModel(
    modelData: Omit<Model, "id" | "created_at" | "updated_at">
  ): Promise<Model> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Model;
    }>("/models", modelData);
    return response.data.data;
  }

  // Mettre à jour un modèle
  async updateModel(id: number, modelData: Partial<Model>): Promise<Model> {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: Model;
    }>(`/models/${id}`, modelData);
    return response.data.data;
  }

  // Supprimer un modèle
  async deleteModel(id: number): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/models/${id}`);
    return { success: response.data.success };
  }

  // Uploader une photo
  async uploadPhoto(modelId: number, file: File): Promise<Model> {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Model;
    }>(`/models/${modelId}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  }

  // 🔹 Récupérer tous les modèles (doublon, mais avec même structure que getAllModels)
  async getModels(): Promise<Model[]> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: Model[];
      count: number;
    }>("/models");
    return response.data.data;
  }

  // 🔹 Récupérer les clients d'un modèle
  async getModelClients(modelId: number): Promise<any[]> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: any[];
    }>(`/clients/models/${modelId}/clients`);
    return response.data.data;
  }

  // 🔹 Récupérer les conversations d'un client
  async getClientConversations(clientId: number): Promise<any[]> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: any[];
    }>(`/conversations/client/${clientId}`);
    return response.data.data;
  }
}

export const modelService = new ModelService();
