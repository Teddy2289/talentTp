import api from "../core/api";

export interface GeneralSettings {
  site_title: string;
  site_subtitle: string;
  social_title: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
}

export interface LogoSettings {
  logo_type: "image" | "text";
  logo_image?: string;
  logo_text?: string;
  logo_slogan?: string;
}

export interface Slide {
  image: string;
  title: string;
  subtitle: string;
  is_active: boolean;
  order: number;
}

export interface HomeSettings {
  main_title: string;
  main_subtitle: string;
  show_social_in_hero: boolean;
  slides: Slide[];
}

export interface GallerySettings {
  gallery_title: string;
  gallery_subtitle: string;
  show_gallery: boolean;
  items_per_page: number;
}

export interface AboutSettings {
  about_title: string;
  selected_model_id?: number;
  show_custom_content: boolean;
  custom_content?: string;
}

export type SettingsSection = "general" | "logo" | "home" | "gallery" | "about";

class SettingsService {
  // Récupérer tous les paramètres (admin)
  async getAllSettings() {
    const response = await api.get("/settings");
    return response.data;
  }

  // Récupérer les paramètres d'une section spécifique
  async getSectionSettings(section: SettingsSection) {
    const response = await api.get(`/settings/${section}`);
    return response.data;
  }

  // Récupérer les paramètres pour le frontend (public)
  async getFrontendSettings() {
    const response = await api.get("/settings/frontend");
    return response.data;
  }

  // Mettre à jour les paramètres généraux
  async updateGeneralSettings(settings: GeneralSettings) {
    const response = await api.put("/settings/general", settings);
    return response.data;
  }

  // Mettre à jour les paramètres du logo
  async updateLogoSettings(settings: LogoSettings) {
    const response = await api.put("/settings/logo", settings);
    return response.data;
  }

  // Mettre à jour les paramètres de l'accueil
  async updateHomeSettings(settings: HomeSettings) {
    const response = await api.put("/settings/home", settings);
    return response.data;
  }

  // Mettre à jour les paramètres de la galerie
  async updateGallerySettings(settings: GallerySettings) {
    const response = await api.put("/settings/gallery", settings);
    return response.data;
  }

  // Mettre à jour les paramètres À propos
  async updateAboutSettings(settings: AboutSettings) {
    const response = await api.put("/settings/about", settings);
    return response.data;
  }

  // Activer/désactiver une section
  async toggleSection(section: SettingsSection, isActive: boolean) {
    const response = await api.patch(`/settings/${section}/toggle`, {
      is_active: isActive,
    });
    return response.data;
  }
}

export const settingsService = new SettingsService();
