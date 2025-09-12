// services/modelServiceCrud.ts
import { apiClient } from "../core/api";
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

    // Préparer le payload selon le format attendu par le backend
    const payload = this.preparePayload(model);

    // Ajouter tous les champs au FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "categoryIds" && Array.isArray(value)) {
          // Pour les categoryIds, ajouter chaque élément
          value.forEach((item) => {
            formData.append(`${key}[]`, item.toString());
          });
        } else {
          // Ajouter tous les autres champs
          formData.append(key, value.toString());
        }
      }
    });

    // Ajouter la photo si elle existe
    if (photo) {
      formData.append("photo", photo);
    }

    console.log("📤 Payload FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const { data } = await apiClient.upload<{ data: Model }>(API_URL, formData);
    return data.data;
  },

  async update(id: number, model: UpdateModel, photo?: File): Promise<Model> {
    const formData = new FormData();

    // Préparer le payload selon le format attendu par le backend
    const payload = this.preparePayload(model);

    // Ajouter tous les champs au FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "categoryIds" && Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item.toString());
          });
        } else {
          // Ajouter tous les autres champs
          formData.append(key, value.toString());
        }
      }
    });

    // Ajouter la photo si elle existe
    if (photo) {
      formData.append("photo", photo);
    }

    console.log("📤 Payload FormData (update):");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

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

  // services/modelServiceCrud.ts - Modifiez la méthode preparePayload
  preparePayload(model: CreateModel | UpdateModel): any {
    const payload: any = {};

    // Mapper tous les champs avec des valeurs par défaut
    payload.prenom = model.prenom !== undefined ? String(model.prenom) : "";
    payload.nationalite =
      model.nationalite !== undefined ? String(model.nationalite) : "";
    payload.passe_temps =
      model.passe_temps !== undefined ? String(model.passe_temps) : "";
    payload.citation =
      model.citation !== undefined ? String(model.citation) : "";
    payload.domicile =
      model.domicile !== undefined ? String(model.domicile) : "";
    payload.localisation =
      model.localisation !== undefined ? String(model.localisation) : "";

    // Gérer l'âge
    if (model.age !== undefined && model.age !== null) {
      payload.age = String(model.age);
    } else {
      payload.age = "";
    }

    // Gérer les categoryIds - s'assurer que ce sont des nombres
    if (Array.isArray(model.categoryIds)) {
      payload.categoryIds = model.categoryIds
        .map((id) => {
          if (typeof id === "string") {
            const parsed = parseInt(id, 10);
            return isNaN(parsed) ? null : parsed;
          }
          return id;
        })
        .filter((id): id is number => id !== null && !isNaN(id));
    } else {
      payload.categoryIds = [];
    }

    return payload;
  },
};
