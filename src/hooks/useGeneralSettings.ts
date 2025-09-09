// hooks/useGeneralSettings.ts
import { useState, useEffect } from "react";
import { settingsApi } from "../core/settingsApi";

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
}

export interface GeneralSettings {
  site_title: string;
  site_subtitle?: string;
  associated_model_id?: number;
  show_navbar: boolean;
  social_title?: string;
  social_links: SocialLink[];
}

export const useGeneralSettings = () => {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.getSectionSettings("general");
      console.log("Response from API:", response);

      const raw = response.data || {};
      console.log("Raw data:", raw);
      console.log("Social links type:", typeof raw.social_links);
      console.log("Social links value:", raw.social_links);
      console.log("Is array:", Array.isArray(raw.social_links));
      const normalized: GeneralSettings = {
        site_title: raw.site_title || "",
        site_subtitle: raw.site_subtitle || "",
        associated_model_id: raw.associated_model_id || null,
        show_navbar: raw.show_navbar !== undefined ? raw.show_navbar : true,
        social_title: raw.social_title || "Suivez-nous",
        social_links: raw.social_links || [
          {
            platform: "facebook",
            url: "",
            icon: "fa-facebook",
            is_active: false,
          },
          {
            platform: "twitter",
            url: "",
            icon: "fa-twitter",
            is_active: false,
          },
          {
            platform: "instagram",
            url: "",
            icon: "fa-instagram",
            is_active: false,
          },
          {
            platform: "linkedin",
            url: "",
            icon: "fa-linkedin",
            is_active: false,
          },
          {
            platform: "youtube",
            url: "",
            icon: "fa-youtube",
            is_active: false,
          },
        ],
      };

      console.log("Normalized settings:", normalized);
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
        site_title: newSettings.site_title,
        site_subtitle: newSettings.site_subtitle,
        associated_model_id: newSettings.associated_model_id,
        show_navbar: newSettings.show_navbar,
        social_title: newSettings.social_title,
        social_links: newSettings.social_links,
      };

      const response = await settingsApi.updateGeneralSettings(payload);

      // ✅ CORRECTION ICI aussi : Les données retournées sont directement dans response.data
      const raw = response.data || {};
      console.log("Save response:", raw);

      const normalized: GeneralSettings = {
        site_title: raw.site_title || "",
        site_subtitle: raw.site_subtitle || "",
        associated_model_id: raw.associated_model_id || null,
        show_navbar: raw.show_navbar !== undefined ? raw.show_navbar : true,
        social_title: raw.social_title || "Suivez-nous",
        social_links: raw.social_links || [],
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
