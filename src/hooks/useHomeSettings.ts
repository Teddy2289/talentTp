import { useState, useEffect } from "react";
import {
  settingsService,
  type HomeSettings,
  type Slide,
} from "../services/settingsService";

export const useHomeSettings = () => {
  const [settings, setSettings] = useState<HomeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSectionSettings("home");
      setSettings(response.data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: HomeSettings) => {
    try {
      setLoading(true);
      const response = await settingsService.updateHomeSettings(newSettings);
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

  const addSlide = (newSlide: Omit<Slide, "order">) => {
    if (!settings) return;

    const slides = [...settings.slides];
    const newOrder =
      slides.length > 0 ? Math.max(...slides.map((s) => s.order)) + 1 : 1;

    const slide: Slide = {
      ...newSlide,
      order: newOrder,
      is_active: newSlide.is_active !== undefined ? newSlide.is_active : true,
    };

    setSettings({
      ...settings,
      slides: [...slides, slide],
    });
  };

  const updateSlide = (index: number, updates: Partial<Slide>) => {
    if (!settings) return;

    const slides = [...settings.slides];
    slides[index] = { ...slides[index], ...updates };

    setSettings({
      ...settings,
      slides,
    });
  };

  const removeSlide = (index: number) => {
    if (!settings || settings.slides.length <= 1) return;

    const slides = settings.slides.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      slides: slides.map((slide, i) => ({ ...slide, order: i + 1 })),
    });
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
