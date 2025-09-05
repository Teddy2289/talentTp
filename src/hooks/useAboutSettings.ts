import { useState, useEffect } from "react";
import {
  settingsService,
  type AboutSettings,
} from "../services/settingsService";
import { modelService, type Model } from "../services/modelService";

export const useAboutSettings = () => {
  const [settings, setSettings] = useState<AboutSettings | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger les paramètres
      const settingsResponse = await settingsService.getSectionSettings(
        "about"
      );
      setSettings(settingsResponse.data.settings);

      // Charger les modèles disponibles
      const modelsResponse = await modelService.getAllModels();
      setModels(modelsResponse.data);

      // Charger le modèle sélectionné si existant
      if (settingsResponse.data.settings.selected_model_id) {
        const modelResponse = await modelService.getModel(
          settingsResponse.data.settings.selected_model_id
        );
        setSelectedModel(modelResponse.data);
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
      const response = await settingsService.updateAboutSettings(newSettings);
      setSettings(response.data.settings);

      // Mettre à jour le modèle sélectionné
      if (newSettings.selected_model_id) {
        const modelResponse = await modelService.getModel(
          newSettings.selected_model_id
        );
        setSelectedModel(modelResponse.data);
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

  return {
    settings,
    models,
    selectedModel,
    loading,
    error,
    saveSettings,
    refresh: loadData,
  };
};
