import { useState, useEffect } from "react";
import { type AboutSettings } from "../services/settingsService";
import { modelService, type Model } from "../services/modelService";
import { settingsApi } from "../core/settingsApi";

export const useAboutSettings = () => {
  const [settings, setSettings] = useState<AboutSettings | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Charger les paramètres de la section "about"
      const settingsResponse = await settingsApi.getSectionSettings("about");
      const aboutSettings = settingsResponse.data;
      setSettings(aboutSettings);

      // 2. Charger tous les modèles disponibles
      const modelsData = await modelService.getAllModels();
      console.log("Modèles chargés:", modelsData);
      setModels(modelsData);

      // 3. Si un modèle est sélectionné, charger ses infos détaillées
      if (aboutSettings?.selected_model_id) {
        try {
          const modelData = await modelService.getModel(
            aboutSettings.selected_model_id
          );
          console.log("Modèle sélectionné chargé:", modelData);
          setSelectedModel(modelData);
        } catch (modelError) {
          console.warn("Modèle sélectionné introuvable:", modelError);
          setSelectedModel(null);
        }
      } else {
        setSelectedModel(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AboutSettings) => {
    try {
      setLoading(true);

      // PUT vers /settings/about
      const response = await settingsApi.updateAboutSettings(newSettings);

      // Mettre à jour les settings locaux
      setSettings(response.data.settings || response.data);

      // Mettre à jour le modèle sélectionné si nécessaire
      if (newSettings.selected_model_id) {
        const modelData = await modelService.getModel(
          newSettings.selected_model_id
        );
        setSelectedModel(modelData);
      } else {
        setSelectedModel(null);
      }

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur de sauvegarde";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Dans useAboutSettings.ts
  const uploadModelImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/model", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'upload");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Erreur upload:", error);
      throw new Error("Échec de l'upload de l'image");
    }
  };

  // Modifiez la fonction updateModel
  const updateModel = async (model: Model, imageFile?: File) => {
    try {
      setLoading(true);

      let modelData = { ...model };

      // Si une nouvelle image est fournie, l'uploader
      if (imageFile) {
        const imageUrl = await uploadModelImage(imageFile);
        modelData = { ...modelData, photo: imageUrl };
      }

      const response = await modelService.updateModel(modelData.id, modelData);

      // Mettre à jour le modèle dans la liste
      setModels((prev) =>
        prev.map((m) => (m.id === modelData.id ? modelData : m))
      );

      // Mettre à jour le modèle sélectionné si c'est le même
      if (selectedModel?.id === modelData.id) {
        setSelectedModel(modelData);
      }

      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur de mise à jour";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    models,
    selectedModel,
    loading,
    error,
    saveSettings,
    refresh: loadData,
    updateModel,
  };
};
