import { useState, useEffect } from "react";
import {
  settingsService,
  type GeneralSettings,
} from "../services/settingsService";

export const useGeneralSettings = () => {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSectionSettings("general");
      setSettings(response.data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: GeneralSettings) => {
    try {
      setLoading(true);
      const response = await settingsService.updateGeneralSettings(newSettings);
      setSettings(response.data.settings);
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
    loadSettings();
  }, []);

  return { settings, loading, error, saveSettings, refresh: loadSettings };
};
