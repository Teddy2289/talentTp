export interface Model {
  id: number;
  prenom: string;
  nationalite: string;
  age?: number;
  passe_temps?: string;
  citation?: string;
  domicile?: string;
  profession?: string;
  localisation?: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateModel = Omit<Model, "id" | "createdAt" | "updatedAt">;
export type UpdateModel = Partial<CreateModel>;
