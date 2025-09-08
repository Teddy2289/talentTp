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
  // Récupérer tous les modèles - CORRECTION
  async getAllModels(): Promise<Model[]> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: Model[];
      count: number;
    }>("/models");
    return response.data.data; // Retourne directement le tableau de modèles
  }

  // Récupérer un modèle par ID - CORRECTION
  async getModel(id: number): Promise<Model> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: Model;
    }>(`/models/${id}`);
    return response.data.data; // Retourne directement l'objet modèle
  }

  // Créer un nouveau modèle - CORRECTION
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

  // Mettre à jour un modèle - CORRECTION
  async updateModel(id: number, modelData: Partial<Model>): Promise<Model> {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: Model;
    }>(`/models/${id}`, modelData);
    return response.data.data;
  }

  // Supprimer un modèle - CORRECTION
  async deleteModel(id: number): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/models/${id}`);
    return { success: response.data.success };
  }

  // Uploader une photo - CORRECTION
  async uploadPhoto(modelId: number, file: File): Promise<Model> {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await apiClient.upload<{
      success: boolean;
      message: string;
      data: Model;
    }>(`/models/${modelId}/photo`, formData);
    return response.data.data;
  }
}

export const modelService = new ModelService();
