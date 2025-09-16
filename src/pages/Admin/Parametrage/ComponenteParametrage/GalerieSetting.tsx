import React, { useState, useEffect } from "react";
import { settingsApi } from "../../../../core/settingsApi";

interface GallerySettings {
  gallery_title?: string;
  gallery_subtitle?: string;
  items_per_page?: number;
  show_gallery?: boolean;
}

const GalerieSetting: React.FC = () => {
  const [settings, setSettings] = useState<GallerySettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsApi.getSectionSettings("gallery");
      setSettings(response.data || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsApi.updateGallerySettings(settings);
      alert("Paramètres de la galerie sauvegardés avec succès!");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e1af30]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-8 text-[#e1af30]">
        Paramètres de la Galerie
      </h1>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-2">
          Configuration de la Galerie
        </h2>

        <div className="space-y-6">
          {/* Titre */}
          <div>
            <label
              htmlFor="gallery_title"
              className="block text-sm font-medium mb-2">
              Titre de la Galerie
            </label>
            <input
              type="text"
              id="gallery_title"
              value={settings.gallery_title || ""}
              onChange={(e) =>
                setSettings({ ...settings, gallery_title: e.target.value })
              }
              placeholder="Entrez le titre de la galerie"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e1af30]"
            />
          </div>

          {/* Sous-titre */}
          <div>
            <label
              htmlFor="gallery_subtitle"
              className="block text-sm font-medium mb-2">
              Sous-titre de la Galerie
            </label>
            <input
              type="text"
              id="gallery_subtitle"
              value={settings.gallery_subtitle || ""}
              onChange={(e) =>
                setSettings({ ...settings, gallery_subtitle: e.target.value })
              }
              placeholder="Entrez le sous-titre de la galerie"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e1af30]"
            />
          </div>

          {/* Nombre d'éléments par page */}
          <div>
            <label
              htmlFor="items_per_page"
              className="block text-sm font-medium mb-2">
              Nombre d'éléments par page
            </label>
            <input
              type="number"
              id="items_per_page"
              value={settings.items_per_page || 24}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  items_per_page: parseInt(e.target.value) || 1,
                })
              }
              min={1}
              max={100}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e1af30]"
            />
          </div>

          {/* Affichage de la galerie */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.show_gallery || false}
                onChange={(e) =>
                  setSettings({ ...settings, show_gallery: e.target.checked })
                }
                className="h-5 w-5 rounded border-gray-300 text-[#e1af30] focus:ring-[#e1af30]"
              />
              <span>Afficher la galerie</span>
            </label>
          </div>

          {/* Bouton Sauvegarder */}
          <div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-[#e1af30] hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md disabled:opacity-50">
              {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
            </button>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalerieSetting;
