// ComponenteParametrage/GeneralSettings.tsx
import React, { useState, useEffect } from "react";
import { useGeneralSettings } from "../../../../hooks/useGeneralSettings";

const GeneralSettings: React.FC = () => {
  const { settings, loading, error, saveSettings } = useGeneralSettings();

  const [formData, setFormData] = useState({
    siteTitle: "",
    siteDescription: "",
    socialTitle: "",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    instagramLink: "",
    linkedinUrl: "",
    youtubeUrl: "",
  });
  useEffect(() => {
    if (settings) {
      setFormData({
        siteTitle: settings.siteTitle || "",
        siteDescription: settings.siteDescription || "",
        socialTitle: settings.socialTitle || "",
        facebookUrl: settings.facebookUrl || "",
        twitterUrl: settings.twitterUrl || "",
        instagramUrl: settings.instagramUrl || "",
        instagramLink: settings.instagramLink || "",
        linkedinUrl: settings.linkedinUrl || "",
        youtubeUrl: settings.youtubeUrl || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveSettings(formData);
    if (result.success) {
      alert("Paramètres sauvegardés avec succès!");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading && !settings) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="general-settings">
      <h2 className="text-xl font-bold mb-6 text-pluto-yellow">
        Paramètres Généraux
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre du site */}
        <div className="form-group">
          <label htmlFor="siteTitle" className="block text-sm font-medium mb-2">
            Titre du Site
          </label>
          <input
            type="text"
            id="siteTitle"
            name="siteTitle"
            value={formData.siteTitle}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
        </div>

        {/* Description du site */}
        <div className="form-group">
          <label
            htmlFor="siteDescription"
            className="block text-sm font-medium mb-2">
            Description du Site
          </label>
          <textarea
            id="siteDescription"
            name="siteDescription"
            rows={3}
            value={formData.siteDescription}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
        </div>

        {/* Titre section réseaux sociaux */}
        <div className="form-group">
          <label
            htmlFor="socialTitle"
            className="block text-sm font-medium mb-2">
            Titre Réseaux Sociaux
          </label>
          <input
            type="text"
            id="socialTitle"
            name="socialTitle"
            value={formData.socialTitle}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
        </div>

        {/* Facebook */}
        <div className="form-group">
          <label
            htmlFor="facebookUrl"
            className="block text-sm font-medium mb-2">
            Lien Facebook
          </label>
          <input
            type="url"
            id="facebookUrl"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
        </div>

        {/* Twitter */}
        <div className="form-group">
          <label
            htmlFor="twitterUrl"
            className="block text-sm font-medium mb-2">
            Lien Twitter
          </label>
          <input
            type="url"
            id="twitterUrl"
            name="twitterUrl"
            value={formData.twitterUrl}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
          {/* Instagram */}
          <div className="form-group">
            <label
              htmlFor="instagramUrl"
              className="block text-sm font-medium mb-2">
              Lien Instagram
            </label>
            <input
              type="url"
              id="instagramUrl"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
            />
          </div>
          {/* Instagram Link (required by GeneralSettings interface) */}
          <div className="form-group">
            <label
              htmlFor="instagramLink"
              className="block text-sm font-medium mb-2">
              Lien Instagram (obligatoire)
            </label>
            <input
              type="url"
              id="instagramLink"
              name="instagramLink"
              value={formData.instagramLink}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
              required
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div className="form-group">
          <label
            htmlFor="linkedinUrl"
            className="block text-sm font-medium mb-2">
            Lien LinkedIn
          </label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
        </div>

        {/* YouTube */}
        <div className="form-group">
          <label
            htmlFor="youtubeUrl"
            className="block text-sm font-medium mb-2">
            Lien YouTube
          </label>
          <input
            type="url"
            id="youtubeUrl"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
          />
        </div>

        {/* Bouton de sauvegarde */}
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
