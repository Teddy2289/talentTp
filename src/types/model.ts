import type { Categorie } from "./category";

// types/model.ts
export interface ModelCategorie {
  id: number;
  modelId: number;
  categorieId: number;
  created_at: Date;
  model?: Model;
  categorie?: Categorie;
}

export interface Model {
  id: number;
  prenom: string;
  age: number;
  nationalite: string;
  passe_temps: string;
  citation: string;
  domicile: string;
  photo?: string;
  localisation: string;
  created_at: Date;
  updated_at: Date;
  categories?: ModelCategorie[];
  categoryIds?: number[];
}

export type CreateModel = Omit<Model, "id" | "createdAt" | "updatedAt">;
export type UpdateModel = Partial<CreateModel>;
