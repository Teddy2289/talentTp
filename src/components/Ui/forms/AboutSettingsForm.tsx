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
  onUpdateModel: (
    model: Model
  ) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

const AboutSettingsForm: React.FC<AboutSettingsFormProps> = ({
  settings,
  models,
  selectedModel,
  onSave,
  onUpdateModel,
  loading = false,
}) => {
  const [localSettings, setLocalSettings] =
    React.useState<AboutSettings>(settings);
  const [editingModel, setEditingModel] = React.useState<Model | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [modelLoading, setModelLoading] = React.useState(false);

  React.useEffect(() => {
    setLocalSettings(settings);
    setEditingModel(selectedModel);
  }, [settings, selectedModel]);

  const handleChange = (field: keyof AboutSettings, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleModelChange = (field: keyof Model, value: any) => {
    if (editingModel) {
      setEditingModel((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    const result = await onSave(localSettings);
    if (result.success) {
      alert("Paramètres À Propos sauvegardés avec succès!");
    } else {
      alert(`Erreur: ${result.error}`);
    }
  };

  const handleSaveModel = async () => {
    if (!editingModel) return;

    setModelLoading(true);
    try {
      const result = await onUpdateModel(editingModel);
      if (result.success) {
        alert("Modèle mis à jour avec succès!");
        setIsEditing(false);
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour du modèle");
    } finally {
      setModelLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingModel(selectedModel);
    setIsEditing(false);
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
              {Array.isArray(models) &&
                models.map((model) => (
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

        {/* Section d'édition du modèle sélectionné */}
        {editingModel && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-pluto-yellow">
                Édition du modèle sélectionné
              </h3>
              {isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-pluto-orange hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200">
                  Modifier le modèle
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveModel}
                    disabled={modelLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50">
                    {modelLoading ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200">
                    Annuler
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={editingModel.prenom}
                  onChange={(e) => handleModelChange("prenom", e.target.value)}
                  disabled={isEditing}
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Âge</label>
                <input
                  type="number"
                  value={editingModel.age}
                  onChange={(e) =>
                    handleModelChange("age", parseInt(e.target.value) || 0)
                  }
                  disabled={isEditing}
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">
                  Nationalité
                </label>
                <input
                  type="text"
                  value={editingModel.nationalite}
                  onChange={(e) =>
                    handleModelChange("nationalite", e.target.value)
                  }
                  disabled={isEditing}
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  value={editingModel.profession}
                  onChange={(e) =>
                    handleModelChange("profession", e.target.value)
                  }
                  disabled={isEditing}
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Passe-temps
                </label>
                <input
                  type="text"
                  value={editingModel.passe_temps}
                  onChange={(e) =>
                    handleModelChange("passe_temps", e.target.value)
                  }
                  disabled={isEditing}
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Citation
                </label>
                <textarea
                  value={editingModel.citation}
                  onChange={(e) =>
                    handleModelChange("citation", e.target.value)
                  }
                  disabled={isEditing}
                  rows={2}
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">
                  Domicile
                </label>
                <input
                  type="text"
                  value={editingModel.domicile}
                  onChange={(e) =>
                    handleModelChange("domicile", e.target.value)
                  }
                  disabled={isEditing}
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  value={editingModel.localisation}
                  onChange={(e) =>
                    handleModelChange("localisation", e.target.value)
                  }
                  disabled={isEditing}
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium mb-2">Photo</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      handleModelChange("photo", previewUrl);
                    }
                  }}
                  disabled={isEditing}
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              {editingModel.photo && (
                <div className="form-group md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Aperçu de la photo
                  </label>
                  <div className="mt-2">
                    <img
                      src={`${import.meta.env.VITE_IMG_URL}${
                        editingModel.photo
                      }`}
                      alt={editingModel.prenom}
                      className="w-32 h-32 object-cover rounded-lg border-2 border-pluto-light-blue"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
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

          {editingModel && (
            <div className="mb-4">
              <h4 className="font-semibold text-pluto-yellow mb-2">
                Modèle sélectionné:
              </h4>
              <div className="bg-pluto-dark-blue p-3 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white font-semibold">
                      Prénom: {editingModel.prenom}
                    </p>
                    <p className="text-pluto-light-blue">
                      Âge: {editingModel.age} ans
                    </p>
                    <p className="text-white">
                      Nationalité: {editingModel.nationalite}
                    </p>
                    <p className="text-pluto-light-blue">
                      Profession: {editingModel.profession}
                    </p>
                  </div>
                  <div>
                    <p className="text-white">
                      Localisation: {editingModel.localisation}
                    </p>
                    <p className="text-pluto-light-blue">
                      Domicile: {editingModel.domicile}
                    </p>
                    <p className="text-white">
                      Passe-temps: {editingModel.passe_temps}
                    </p>
                    <p className="text-pluto-light-blue italic">
                      "{editingModel.citation}"
                    </p>
                  </div>
                </div>

                {editingModel.photo && (
                  <div className="mt-4 text-center">
                    <img
                      src={`${import.meta.env.VITE_IMG_URL}${
                        editingModel.photo
                      }`}
                      alt={editingModel.prenom}
                      className="w-48 h-48 object-cover rounded-lg mx-auto border-2 border-pluto-light-blue"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
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

          {!editingModel && !localSettings.custom_content && (
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
