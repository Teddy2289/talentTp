import React, { useState, useEffect } from "react";
import {
  useGeneralSettings,
  type SocialLink,
} from "../../../../hooks/useGeneralSettings";
import { ModelSelector } from "../../../../components/Ui/ModelSelector";

const GeneralSettings: React.FC = () => {
  const { settings, loading, error, saveSettings } = useGeneralSettings();

  const [formData, setFormData] = useState({
    site_title: "",
    site_subtitle: "",
    associated_model_id: undefined as number | undefined,
    show_navbar: true,
    social_title: "Suivez-nous",
    social_links: [] as SocialLink[],
  });

  console.log("Current formData:", formData);

  useEffect(() => {
    if (settings) {
      setFormData({
        site_title: settings.site_title || "",
        site_subtitle: settings.site_subtitle || "",
        associated_model_id: settings.associated_model_id,
        show_navbar: settings.show_navbar,
        social_title: settings.social_title || "Suivez-nous",
        social_links: settings.social_links || [],
      });
    }
  }, [settings]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "associated_model_id") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialLinkChange = (
    index: number,
    field: keyof SocialLink,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const newSocialLinks = [...prev.social_links];
      newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
      return { ...prev, social_links: newSocialLinks };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveSettings(formData);
    if (result.success) {
      alert("Paramètres sauvegardés avec succès!");
    }
  };

  if (loading && !settings) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="general-settings">
      <h2 className="text-xl font-bold mb-6 text-pluto-yellow">
        Paramètres Généraux
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre du site */}
        <div className="form-group">
          <label
            htmlFor="site_title"
            className="block text-sm font-medium mb-2">
            Titre du Site *
          </label>
          <input
            type="text"
            id="site_title"
            name="site_title"
            value={formData.site_title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
        </div>

        {/* Sous-titre du site */}
        <div className="form-group">
          <label
            htmlFor="site_subtitle"
            className="block text-sm font-medium mb-2">
            Sous-titre du Site
          </label>
          <input
            type="text"
            id="site_subtitle"
            name="site_subtitle"
            value={formData.site_subtitle}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
        </div>

        {/* ID du modèle associé */}
        <div className="form-group">
          <label
            htmlFor="associated_model_id"
            className="block text-sm font-medium mb-2">
            Modèle Associé au Site
          </label>
          <ModelSelector
            value={formData.associated_model_id}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, associated_model_id: value }))
            }
          />
        </div>

        {/* Afficher la navbar */}
        <div className="form-group flex items-center">
          <input
            type="checkbox"
            id="show_navbar"
            name="show_navbar"
            checked={formData.show_navbar}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="show_navbar" className="text-sm font-medium">
            Afficher la barre de navigation
          </label>
        </div>

        {/* Titre des réseaux sociaux */}
        <div className="form-group">
          <label
            htmlFor="social_title"
            className="block text-sm font-medium mb-2">
            Titre des Réseaux Sociaux
          </label>
          <input
            type="text"
            id="social_title"
            name="social_title"
            value={formData.social_title}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
        </div>

        {/* Réseaux sociaux */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-2">
            Réseaux Sociaux
          </label>
          {formData.social_links.map((link, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded-lg bg-pluto-medium-blue">
              <h4 className="font-semibold mb-2 capitalize">{link.platform}</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-xs mb-1">URL</label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      handleSocialLinkChange(index, "url", e.target.value)
                    }
                    placeholder={`URL ${link.platform}`}
                    className="w-full p-2 rounded border border-pluto-light-blue text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Icône</label>
                  <input
                    type="text"
                    value={link.icon}
                    onChange={(e) =>
                      handleSocialLinkChange(index, "icon", e.target.value)
                    }
                    placeholder="Classe d'icône (ex: fa-facebook)"
                    className="w-full p-2 rounded border border-pluto-light-blue text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={link.is_active}
                    onChange={(e) =>
                      handleSocialLinkChange(
                        index,
                        "is_active",
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  <label className="text-xs">Actif</label>
                </div>
              </div>

              {link.url && (
                <div className="text-xs text-gray-400">
                  Lien:{" "}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pluto-orange hover:underline">
                    {link.url}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-pluto-orange hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
          disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
};

export default GeneralSettings;
