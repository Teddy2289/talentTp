import React from "react";
import type { AboutSettings } from "../../../services/settingsService";
import type { Model } from "../../../services/modelService";

interface AboutSettingsFormProps {
  settings: AboutSettings;
  models: Model[];
  selectedModel: Model | null;
  onSave: (
    settings: AboutSettings
  ) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

const AboutSettingsForm: React.FC<AboutSettingsFormProps> = ({
  settings,
  models,
  selectedModel,
  onSave,
  loading = false,
}) => {
  const [localSettings, setLocalSettings] =
    React.useState<AboutSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (field: keyof AboutSettings, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const result = await onSave(localSettings);
    if (result.success) {
      alert("Paramètres À Propos sauvegardés avec succès!");
    } else {
      alert(`Erreur: ${result.error}`);
    }
  };

  return (
    <div className="p-6 bg-pluto-deep-blue text-white min-h-screen">
      <h1 className="text-xl font-bold mb-8 text-[#e1af30]">
        Paramètres À Propos
      </h1>

      <div className="bg-pluto-dark-blue p-6 rounded-xl shadow-lg">
        <h2 className="text-md font-semibold mb-6 text-pluto-yellow border-b border-pluto-light-blue pb-2">
          Configuration de la section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="form-group">
            <label className="block text-sm font-medium mb-2">
              Titre de la section *
            </label>
            <input
              type="text"
              value={localSettings.about_title}
              onChange={(e) => handleChange("about_title", e.target.value)}
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2">
              Modèle à afficher
            </label>
            <select
              value={localSettings.selected_model_id || ""}
              onChange={(e) =>
                handleChange(
                  "selected_model_id",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange">
              <option value="">Sélectionner un modèle</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.prenom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={localSettings.show_custom_content}
              onChange={(e) =>
                handleChange("show_custom_content", e.target.checked)
              }
              className="h-5 w-5 rounded bg-pluto-medium-blue border-pluto-light-blue text-pluto-orange focus:ring-pluto-orange"
            />
            <span>Afficher le contenu personnalisé</span>
          </label>
        </div>

        {localSettings.show_custom_content && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Contenu personnalisé
            </label>
            <textarea
              value={localSettings.custom_content || ""}
              onChange={(e) => handleChange("custom_content", e.target.value)}
              rows={6}
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
              placeholder="Contenu HTML personnalisé pour la section À propos"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-[#e1af30] hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md disabled:opacity-50">
            {loading ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </button>
        </div>
      </div>

      {/* Aperçu */}
      <div className="bg-pluto-dark-blue p-6 rounded-xl shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-pluto-yellow border-b border-pluto-light-blue pb-2">
          Aperçu
        </h2>

        <div className="bg-pluto-medium-blue p-4 rounded-lg">
          <h3 className="text-xl font-bold text-pluto-orange mb-4">
            {localSettings.about_title}
          </h3>

          {selectedModel && (
            <div className="mb-4">
              <h4 className="font-semibold text-pluto-yellow mb-2">
                Modèle sélectionné:
              </h4>
              <div className="bg-pluto-dark-blue p-3 rounded-lg">
                <p className="text-white font-semibold">
                  {selectedModel.prenom}
                </p>
                {selectedModel.age && (
                  <p className="text-pluto-light-blue">
                    {selectedModel.age} ans
                  </p>
                )}
                {selectedModel.profession && (
                  <p className="text-white">{selectedModel.profession}</p>
                )}
                {selectedModel.localisation && (
                  <p className="text-pluto-light-blue">
                    📍 {selectedModel.localisation}
                  </p>
                )}
              </div>
            </div>
          )}

          {localSettings.show_custom_content &&
            localSettings.custom_content && (
              <div className="mt-4">
                <h4 className="font-semibold text-pluto-yellow mb-2">
                  Contenu personnalisé:
                </h4>
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: localSettings.custom_content,
                  }}
                />
              </div>
            )}

          {!selectedModel && !localSettings.custom_content && (
            <p className="text-pluto-light-blue italic">
              Aucun contenu configuré pour l'instant
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutSettingsForm;
