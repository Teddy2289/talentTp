// hooks/useGeneralSettings.ts
import { useState, useEffect } from "react";
import { settingsApi } from "../core/settingsApi";

export interface GeneralSettings {
  siteTitle: string;
  siteDescription: string;
  instagramLink: string;
  socialTitle: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}

export const useGeneralSettings = () => {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // hooks/useGeneralSettings.ts
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.getSectionSettings("general");

      let raw = response.data;
      if (response.data?.data?.settings) {
        raw = response.data.data.settings;
      }

      // 🔑 Normalisation backend -> frontend
      const normalized: GeneralSettings = {
        siteTitle: raw.site_title || "",
        siteDescription: raw.site_subtitle || "", // <== subtitle au lieu de description
        socialTitle: raw.social_title || "",
        facebookUrl: raw.facebook_url || "",
        twitterUrl: raw.twitter_url || "",
        instagramUrl: raw.instagram_url || "",
        linkedinUrl: raw.linkedin_url || "",
        youtubeUrl: raw.youtube_url || "",
        instagramLink: raw.instagram_url || "", // doublon pour compatibilité
      };

      setSettings(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: GeneralSettings) => {
    try {
      setLoading(true);

      const payload = {
        site_title: newSettings.siteTitle,
        site_subtitle: newSettings.siteDescription, // attention: subtitle
        social_title: newSettings.socialTitle,
        facebook_url: newSettings.facebookUrl,
        twitter_url: newSettings.twitterUrl,
        instagram_url: newSettings.instagramUrl,
        linkedin_url: newSettings.linkedinUrl,
        youtube_url: newSettings.youtubeUrl,
      };

      const response = await settingsApi.updateGeneralSettings(payload);

      let raw = response.data;
      if (response.data?.data?.settings) {
        raw = response.data.data.settings;
      }

      const normalized: GeneralSettings = {
        siteTitle: raw.site_title || "",
        siteDescription: raw.site_subtitle || "",
        socialTitle: raw.social_title || "",
        facebookUrl: raw.facebook_url || "",
        twitterUrl: raw.twitter_url || "",
        instagramUrl: raw.instagram_url || "",
        linkedinUrl: raw.linkedin_url || "",
        youtubeUrl: raw.youtube_url || "",
        instagramLink: raw.instagram_url || "",
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
