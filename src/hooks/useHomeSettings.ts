import { useState, useEffect } from "react";
import { settingsApi } from "../core/settingsApi";
import imageCompression from "browser-image-compression";

export interface Slide {
  imageUrl: string;
  altText: string;
  // Supprimer le champ file pour éviter les problèmes
}

export interface HomeSettings {
  main_title: string;
  main_subtitle: string;
  show_social_in_hero: boolean;
  slides: Slide[];
}

// Options de compression
const compressionOptions = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  fileType: "image/jpeg",
};

export const useHomeSettings = () => {
  const [settings, setSettings] = useState<HomeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  const compressImage = async (file: File): Promise<string> => {
    try {
      setCompressing(true);
      const compressedFile = await imageCompression(file, compressionOptions);

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.error("Erreur de compression:", error);
      // Fallback: utiliser l'image originale
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    } finally {
      setCompressing(false);
    }
  };

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

  // Dans useHomeSettings.ts
  const saveSettings = async (newSettings: HomeSettings) => {
    try {
      setLoading(true);

      // Vérifier la taille des données avant envoi
      const jsonString = JSON.stringify(newSettings);
      const sizeInKB = new Blob([jsonString]).size / 1024;

      console.log("Taille des données:", sizeInKB.toFixed(2), "KB");

      if (sizeInKB > 50000) {
        // 50MB en KB
        throw new Error(
          "Les données sont trop volumineuses. Veuillez réduire le nombre ou la taille des images."
        );
      }

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

  // Nouvelle fonction pour gérer l'upload et la compression
  const handleImageUpload = async (index: number, file: File) => {
    try {
      setCompressing(true);
      const compressedImage = await compressImage(file);
      updateSlide(index, { imageUrl: compressedImage });
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error);
    } finally {
      setCompressing(false);
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
    loading: loading || compressing,
    error,
    saveSettings,
    addSlide,
    updateSlide,
    removeSlide,
    refresh: loadSettings,
    updateHero,
    compressing,
    handleImageUpload,
  };
};
