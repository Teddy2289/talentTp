// hooks/useHomeSettings.ts
import { useState, useEffect } from "react";
import { settingsApi } from "../core/settingsApi";

export interface Slide {
  imageUrl: string;
  altText: string;
}

export interface HomeSettings {
  main_title: string;
  main_subtitle: string;
  show_social_in_hero: boolean;
  slides: Slide[];
}

export const useHomeSettings = () => {
  const [settings, setSettings] = useState<HomeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.getSectionSettings("home");
      const homeData = response.data;
      setSettings({
        main_title: homeData.main_title,
        main_subtitle: homeData.main_subtitle,
        show_social_in_hero: homeData.show_social_in_hero,
        slides: homeData.slides || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: HomeSettings) => {
    try {
      setLoading(true);
      const response = await settingsApi.updateHomeSettings(newSettings);
      setSettings(newSettings);
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

  const addSlide = (newSlide: Slide) => {
    if (!settings) return;
    setSettings({
      ...settings,
      slides: [...settings.slides, newSlide],
    });
  };

  const updateSlide = (index: number, updates: Partial<Slide>) => {
    if (!settings) return;
    const slides = [...settings.slides];
    if (index >= 0 && index < slides.length) {
      slides[index] = { ...slides[index], ...updates };
      setSettings({ ...settings, slides });
    }
  };

  const removeSlide = (index: number) => {
    if (!settings) return;
    const slides = settings.slides.filter((_, i) => i !== index);
    setSettings({ ...settings, slides });
  };

  const updateHero = (updates: Partial<HomeSettings>) => {
    if (!settings) return;
    setSettings({ ...settings, ...updates });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    saveSettings,
    addSlide,
    updateSlide,
    removeSlide,
    refresh: loadSettings,
    updateHero,
  };
};
