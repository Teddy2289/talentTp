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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pluto-orange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Erreur:</strong> {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-pluto-deep-blue text-white">
      <h1 className="text-xl font-bold mb-8 text-[#e1af30]">
        Paramètres de la Galerie
      </h1>

      <div className="bg-pluto-dark-blue p-6 rounded-xl shadow-lg max-w-3xl">
        <h2 className="text-md font-semibold mb-6 text-pluto-yellow border-b border-pluto-light-blue pb-2">
          Configuration de la Galerie
        </h2>

        <div className="space-y-6">
          <div className="form-group">
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
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
              placeholder="Entrez le titre de la galerie"
            />
          </div>

          <div className="form-group">
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
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
              placeholder="Entrez le sous-titre de la galerie"
            />
          </div>

          <div className="form-group">
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
                  items_per_page: parseInt(e.target.value),
                })
              }
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
              min="1"
              max="100"
            />
          </div>

          <div className="form-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.show_gallery || false}
                onChange={(e) =>
                  setSettings({ ...settings, show_gallery: e.target.checked })
                }
                className="rounded border-pluto-light-blue text-pluto-orange focus:ring-pluto-orange"
              />
              <span className="ml-2">Afficher la galerie</span>
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#e1af30] hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md disabled:opacity-50">
            {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </button>

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
