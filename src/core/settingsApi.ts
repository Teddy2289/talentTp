import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const settingsApi = {
  // Route publique
  getFrontendSettings: () => api.get("/settings/frontend"),

  // Routes protégées admin
  getAllSettings: () => api.get("/settings"),
  getSectionSettings: (section: string) =>
    api.get("/settings").then((response) => {
      const sectionData = response.data.data.find(
        (item: any) => item.section === section
      );

      if (!sectionData) {
        throw new Error(`Section ${section} introuvable`);
      }

      return {
        data: sectionData.settings,
        metadata: sectionData,
      };
    }),

  // Mise à jour des sections
  updateGeneralSettings: (data: any) => api.put("/settings/general", data),
  updateLogoSettings: (data: any) => api.put("/settings/logo", data),
  updateGallerySettings: (data: any) => api.put("/settings/gallery", data),
  updateAboutSettings: (data: any) => api.put("/settings/about", data),
  updateHomeSettings: (data: any) => {
    const homeData = {
      main_title: data.main_title,
      main_subtitle: data.main_subtitle,
      show_social_in_hero: data.show_social_in_hero,
      slides: data.slides || [],
    };
    return api.put("/settings/home", homeData);
  },
  // Activation/désactivation
  toggleSection: (section: string) => api.patch(`/settings/${section}/toggle`),
};

export default api;
