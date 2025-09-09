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
    model: Model,
    imageFile?: File
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
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLocalSettings(settings);
    setEditingModel(selectedModel);
    setImagePreview(null);
    setSelectedImage(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
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
      const result = await onUpdateModel(
        editingModel,
        selectedImage || undefined
      );
      if (result.success) {
        alert("Modèle mis à jour avec succès!");
        setIsEditing(false);
        setSelectedImage(null);
        setImagePreview(null);
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
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="p-6 bg-pluto-deep-blue text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-[#e1af30]">
        Paramètres À Propos
      </h1>

      {/* Section Paramètres */}
      <div className="bg-pluto-dark-blue p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-lg font-semibold mb-6 text-pluto-yellow border-b border-pluto-light-blue pb-3">
          Configuration de la section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="form-group">
            <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
              Titre de la section *
            </label>
            <input
              type="text"
              value={localSettings.about_title || ""}
              onChange={(e) => handleChange("about_title", e.target.value)}
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
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
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white">
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
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.show_custom_content || false}
              onChange={(e) =>
                handleChange("show_custom_content", e.target.checked)
              }
              className="h-5 w-5 rounded bg-pluto-medium-blue border-pluto-light-blue text-pluto-orange focus:ring-pluto-orange cursor-pointer"
            />
            <span className="text-pluto-light-blue">
              Afficher le contenu personnalisé
            </span>
          </label>
        </div>

        {localSettings.show_custom_content && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
              Contenu personnalisé
            </label>
            <textarea
              value={localSettings.custom_content || ""}
              onChange={(e) => handleChange("custom_content", e.target.value)}
              rows={6}
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white"
              placeholder="Contenu HTML personnalisé pour la section À propos"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-[#e1af30] hover:bg-[#d4a42c] text-white font-semibold rounded-lg transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </button>
        </div>
      </div>

      {/* Section Édition du Modèle */}
      {editingModel && (
        <div className="bg-pluto-dark-blue p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-pluto-yellow">
              Édition du modèle sélectionné
            </h2>
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={handleStartEdit}
                  className="px-4 py-2 bg-pluto-orange hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200">
                  Modifier le modèle
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                Prénom *
              </label>
              <input
                type="text"
                value={editingModel.prenom || ""}
                onChange={(e) => handleModelChange("prenom", e.target.value)}
                disabled={!isEditing}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                Âge
              </label>
              <input
                type="number"
                value={editingModel.age || ""}
                onChange={(e) =>
                  handleModelChange("age", parseInt(e.target.value) || 0)
                }
                disabled={!isEditing}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                Nationalité
              </label>
              <input
                type="text"
                value={editingModel.nationalite || ""}
                onChange={(e) =>
                  handleModelChange("nationalite", e.target.value)
                }
                disabled={!isEditing}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                Profession
              </label>
              <input
                type="text"
                value={editingModel.profession || ""}
                onChange={(e) =>
                  handleModelChange("profession", e.target.value)
                }
                disabled={!isEditing}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                Passe-temps
              </label>
              <input
                type="text"
                value={editingModel.passe_temps || ""}
                onChange={(e) =>
                  handleModelChange("passe_temps", e.target.value)
                }
                disabled={!isEditing}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                Citation
              </label>
              <textarea
                value={editingModel.citation || ""}
                onChange={(e) => handleModelChange("citation", e.target.value)}
                disabled={!isEditing}
                rows={2}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                Domicile
              </label>
              <input
                type="text"
                value={editingModel.domicile || ""}
                onChange={(e) => handleModelChange("domicile", e.target.value)}
                disabled={!isEditing}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                Localisation
              </label>
              <input
                type="text"
                value={editingModel.localisation || ""}
                onChange={(e) =>
                  handleModelChange("localisation", e.target.value)
                }
                disabled={!isEditing}
                className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            {isEditing && (
              <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                  Nouvelle photo
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pluto-orange file:text-white hover:file:bg-orange-600"
                />
              </div>
            )}

            {(editingModel.photo || imagePreview) && (
              <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-pluto-light-blue">
                  {isEditing ? "Aperçu de la photo" : "Photo actuelle"}
                </label>
                <div className="mt-2">
                  <img
                    src={
                      imagePreview ||
                      `${import.meta.env.VITE_IMG_URL}${editingModel.photo}`
                    }
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

      {/* Section Aperçu */}
      <div className="bg-pluto-dark-blue p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-pluto-yellow border-b border-pluto-light-blue pb-3">
          Aperçu
        </h2>

        <div className="bg-pluto-medium-blue p-6 rounded-lg">
          <h3 className="text-xl font-bold text-pluto-orange mb-4">
            {localSettings.about_title || "Titre de la section"}
          </h3>

          {editingModel ? (
            <div className="mb-4">
              <h4 className="font-semibold text-pluto-yellow mb-3">
                Modèle sélectionné:
              </h4>
              <div className="bg-pluto-dark-blue p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-white">
                      <span className="font-semibold">Prénom:</span>{" "}
                      {editingModel.prenom}
                    </p>
                    <p className="text-pluto-light-blue">
                      <span className="font-semibold">Âge:</span>{" "}
                      {editingModel.age} ans
                    </p>
                    <p className="text-white">
                      <span className="font-semibold">Nationalité:</span>{" "}
                      {editingModel.nationalite}
                    </p>
                    <p className="text-pluto-light-blue">
                      <span className="font-semibold">Profession:</span>{" "}
                      {editingModel.profession}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white">
                      <span className="font-semibold">Localisation:</span>{" "}
                      {editingModel.localisation}
                    </p>
                    <p className="text-pluto-light-blue">
                      <span className="font-semibold">Domicile:</span>{" "}
                      {editingModel.domicile}
                    </p>
                    <p className="text-white">
                      <span className="font-semibold">Passe-temps:</span>{" "}
                      {editingModel.passe_temps}
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
          ) : (
            <p className="text-pluto-light-blue italic mb-4">
              Aucun modèle sélectionné
            </p>
          )}

          {localSettings.show_custom_content &&
            localSettings.custom_content && (
              <div className="mt-4">
                <h4 className="font-semibold text-pluto-yellow mb-2">
                  Contenu personnalisé:
                </h4>
                <div
                  className="prose prose-invert max-w-none p-4 bg-pluto-dark-blue rounded-lg"
                  dangerouslySetInnerHTML={{
                    __html: localSettings.custom_content,
                  }}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AboutSettingsForm;
