// hooks/useCategoryModels.ts
import { useState } from "react";
import { categoryServiceCrud } from "../services/categoryServiceCrud";

export const useCategoryModels = () => {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModelsByCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const data = await categoryServiceCrud.getModelsByCategory(categoryId);
      setModels(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des modèles");
    } finally {
      setLoading(false);
    }
  };

  return {
    models,
    loading,
    error,
    fetchModelsByCategory,
  };
};
