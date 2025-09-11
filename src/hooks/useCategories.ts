// hooks/useCategories.ts
import { useEffect, useState } from "react";
import { categoryServiceCrud } from "../services/categoryServiceCrud";
import type {
  Categorie,
  CreateCategorie,
  UpdateCategorie,
} from "../types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryServiceCrud.getAll();
      setCategories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: CreateCategorie) => {
    try {
      const newCategory = await categoryServiceCrud.create(category);
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err: any) {
      throw new Error(err.message || "Erreur lors de la création");
    }
  };

  const updateCategory = async (id: number, category: UpdateCategorie) => {
    try {
      const updated = await categoryServiceCrud.update(id, category);
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err: any) {
      throw new Error(err.message || "Erreur lors de la mise à jour");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await categoryServiceCrud.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      throw new Error(err.message || "Erreur lors de la suppression");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
