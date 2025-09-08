// hooks/useLogoSettings.ts
import { useState, useEffect } from "react";
import { settingsApi } from "../core/settingsApi";

export interface LogoSettings {
  logoType: "image" | "text";
  logoImage?: string;
  logoText?: string;
  logoSlogan?: string;
}

export const useLogoSettings = () => {
  const [settings, setSettings] = useState<LogoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.getSectionSettings("logo");

      let raw = response.data;
      if (response.data?.data?.settings) {
        raw = response.data.data.settings;
      }

      // Normalisation backend -> frontend
      const normalized: LogoSettings = {
        logoType: raw.logo_type || "image",
        logoImage: raw.logo_image || "",
        logoText: raw.logo_text || "",
        logoSlogan: raw.logo_slogan || "",
      };

      setSettings(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: LogoSettings) => {
    try {
      setLoading(true);

      // frontend -> backend
      const payload = {
        logo_type: newSettings.logoType,
        logo_image: newSettings.logoImage,
        logo_text: newSettings.logoText,
        logo_slogan: newSettings.logoSlogan,
      };

      const response = await settingsApi.updateLogoSettings(payload);

      let raw = response.data;
      if (response.data?.data?.settings) {
        raw = response.data.data.settings;
      }

      const normalized: LogoSettings = {
        logoType: raw.logo_type || "image",
        logoImage: raw.logo_image || "",
        logoText: raw.logo_text || "",
        logoSlogan: raw.logo_slogan || "",
      };

      setSettings(normalized);
      return { success: true, data: normalized };
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
