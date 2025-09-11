// types/category.ts
export interface Categorie {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  models?: any[]; // Modèles associés
}

export interface CreateCategorie {
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateCategorie {
  name?: string;
  slug?: string;
  description?: string;
  is_active?: boolean;
}
