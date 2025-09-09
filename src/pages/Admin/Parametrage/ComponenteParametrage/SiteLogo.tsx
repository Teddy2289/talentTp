import React, { useState, useEffect } from "react";
import { useLogoSettings } from "../../../../hooks/useLogoSettings";

const SiteLogo: React.FC = () => {
  const { settings, loading, error, saveSettings } = useLogoSettings();
  type LogoType = "image" | "text";
  interface LogoSettings {
    logoType: LogoType;
    logoImage: string;
    logoText: string;
    logoSlogan: string;
  }

  const [formData, setFormData] = useState<LogoSettings>({
    logoType: "image",
    logoImage: "",
    logoText: "",
    logoSlogan: "",
  });
  const [fileName, setFileName] = useState("Aucun fichier choisi");

  useEffect(() => {
    if (settings) {
      setFormData({
        logoType: settings.logoType || "image",
        logoImage: settings.logoImage || "",
        logoText: settings.logoText || "",
        logoSlogan: settings.logoSlogan || "",
      });
      if (settings.logoImage) {
        setFileName(settings.logoImage.split("/").pop() || "logo.png");
      }
    }
  }, [settings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        logoImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveSettings(formData);
    if (result.success) {
      alert("Logo mis à jour avec succès !");
    }
  };

  if (loading && !settings) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="site-logo">
      <h2 className="text-xl font-bold mb-6 text-[#e1af30]">Logo du Site</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type de logo */}
        <div className="form-group">
          <label htmlFor="logoType" className="block text-sm font-medium mb-2">
            Type de logo
          </label>
          <select
            id="logoType"
            name="logoType"
            value={formData.logoType}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue">
            <option value="image">Image</option>
            <option value="text">Texte</option>
          </select>
        </div>

        {/* Upload image si type = image */}
        {formData.logoType === "image" && (
          <div className="file-upload">
            <label
              htmlFor="logoUpload"
              className="block text-sm font-medium mb-2">
              Choisir un fichier
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="logoUpload"
                className="px-4 py-2 bg-pluto-orange hover:bg-opacity-90 text-white font-semibold rounded-lg cursor-pointer transition-all duration-200 shadow-md">
                Parcourir
              </label>
              <input
                type="file"
                id="logoUpload"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <span className="text-sm">{fileName}</span>
            </div>
          </div>
        )}

        {/* Texte si type = text */}
        {formData.logoType === "text" && (
          <>
            <div className="form-group">
              <label
                htmlFor="logoText"
                className="block text-sm font-medium mb-2">
                Texte du logo
              </label>
              <input
                type="text"
                id="logoText"
                name="logoText"
                value={formData.logoText}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="logoSlogan"
                className="block text-sm font-medium mb-2">
                Slogan
              </label>
              <input
                type="text"
                id="logoSlogan"
                name="logoSlogan"
                value={formData.logoSlogan}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue"
              />
            </div>
          </>
        )}

        {/* Aperçu */}
        <div className="preview-section">
          <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
          <div className="w-40 h-40 border-2 border-dashed border-pluto-light-blue rounded-lg flex items-center justify-center">
            {formData.logoType === "image" && formData.logoImage ? (
              <img
                src={formData.logoImage}
                alt="Logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : formData.logoType === "text" ? (
              <div className="text-center">
                <p className="text-xl font-bold">{formData.logoText}</p>
                <p className="text-sm">{formData.logoSlogan}</p>
              </div>
            ) : (
              <p className="text-pluto-light-blue text-sm text-center px-2">
                Aucun logo sélectionné
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-pluto-orange hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
          disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer le logo"}
        </button>
      </form>
    </div>
  );
};

export default SiteLogo;
