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
  async getAllModels(): Promise<{ data: Model[] }> {
    const response = await apiClient.get<Model[]>("/models");
    return { data: response.data };
  }

  // Récupérer un modèle par ID
  async getModel(id: number): Promise<{ data: Model }> {
    const response = await apiClient.get<Model>(`/models/${id}`);
    return { data: response.data };
  }

  // Créer un nouveau modèle
  async createModel(
    modelData: Omit<Model, "id" | "created_at" | "updated_at">
  ): Promise<{ data: Model }> {
    const response = await apiClient.post<Model>("/models", modelData);
    return { data: response.data };
  }

  // Mettre à jour un modèle
  async updateModel(
    id: number,
    modelData: Partial<Model>
  ): Promise<{ data: Model }> {
    const response = await apiClient.put<Model>(`/models/${id}`, modelData);
    return { data: response.data };
  }

  // Supprimer un modèle
  async deleteModel(id: number): Promise<{ success: boolean }> {
    await apiClient.delete(`/models/${id}`);
    return { success: true };
  }

  // Uploader une photo
  async uploadPhoto(modelId: number, file: File): Promise<{ data: Model }> {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await apiClient.upload<Model>(
      `/models/${modelId}/photo`,
      formData
    );
    return { data: response.data };
  }
}

export const modelService = new ModelService();
