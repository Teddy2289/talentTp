import { useEffect, useState } from "react";
import { modelServiceCrud } from "../services/modelServiceCrud";
import type { Model, CreateModel, UpdateModel } from "../types/model";

export const useModels = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const data = await modelServiceCrud.getAll();
      setModels(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des modèles");
    } finally {
      setLoading(false);
    }
  };

  const createModel = async (model: CreateModel, photo?: File) => {
    const newModel = await modelServiceCrud.create(model, photo);
    setModels((prev) => [...prev, newModel]);
  };

  const updateModel = async (id: number, model: UpdateModel, photo?: File) => {
    const updated = await modelServiceCrud.update(id, model, photo);
    setModels((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const deleteModel = async (id: number) => {
    await modelServiceCrud.remove(id);
    setModels((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    models,
    loading,
    error,
    fetchModels,
    createModel,
    updateModel,
    deleteModel,
  };
};
