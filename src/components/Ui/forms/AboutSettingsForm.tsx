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
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
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
    <div className="p-6 min-h-screen bg-gray-50 text-black">
      <h1 className="text-2xl font-bold mb-8 text-black">
        Paramètres À Propos
      </h1>

      {/* Section Paramètres */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-6 text-gray-700 border-b border-gray-200 pb-3">
          Configuration de la section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Titre de la section *
            </label>
            <input
              type="text"
              value={localSettings.about_title || ""}
              onChange={(e) => handleChange("about_title", e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
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
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400">
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
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.show_custom_content || false}
              onChange={(e) =>
                handleChange("show_custom_content", e.target.checked)
              }
              className="h-5 w-5 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400 cursor-pointer"
            />
            <span className="text-gray-700">
              Afficher le contenu personnalisé
            </span>
          </label>
        </div>

        {localSettings.show_custom_content && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Contenu personnalisé
            </label>
            <textarea
              value={localSettings.custom_content || ""}
              onChange={(e) => handleChange("custom_content", e.target.value)}
              rows={6}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Contenu HTML personnalisé pour la section À propos"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </button>
        </div>
      </div>

      {/* Section Édition du Modèle */}
      {editingModel && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Édition du modèle sélectionné
            </h2>
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={handleStartEdit}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200">
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
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all duration-200">
                    Annuler
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Prénom", field: "prenom" },
              { label: "Âge", field: "age", type: "number" },
              { label: "Nationalité", field: "nationalite" },
              { label: "Profession", field: "profession" },
              { label: "Passe-temps", field: "passe_temps" },
              { label: "Domicile", field: "domicile" },
              { label: "Localisation", field: "localisation" },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  {label}
                </label>
                {type === "number" ? (
                  <input
                    type="number"
                    value={editingModel[field as keyof Model] || ""}
                    onChange={(e) =>
                      handleModelChange(
                        field as keyof Model,
                        parseInt(e.target.value) || 0
                      )
                    }
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                ) : (
                  <input
                    type="text"
                    value={editingModel[field as keyof Model] || ""}
                    onChange={(e) =>
                      handleModelChange(field as keyof Model, e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Citation
              </label>
              <textarea
                value={editingModel.citation || ""}
                onChange={(e) => handleModelChange("citation", e.target.value)}
                disabled={!isEditing}
                rows={2}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            {isEditing && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Nouvelle photo
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            )}

            {(editingModel.photo || imagePreview) && (
              <div className="md:col-span-2 text-center">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  {isEditing ? "Aperçu de la photo" : "Photo actuelle"}
                </label>
                <img
                  src={
                    imagePreview ||
                    `${import.meta.env.VITE_IMG_URL}${editingModel.photo}`
                  }
                  alt={editingModel.prenom}
                  className="w-32 h-32 object-cover rounded-lg mx-auto border border-gray-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Aperçu */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-3">
          Aperçu
        </h2>

        <div className="p-6 rounded-lg bg-gray-50">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">
            {localSettings.about_title || "Titre de la section"}
          </h3>

          {editingModel ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p>
                  <strong>Prénom:</strong> {editingModel.prenom}
                </p>
                <p>
                  <strong>Âge:</strong> {editingModel.age} ans
                </p>
                <p>
                  <strong>Nationalité:</strong> {editingModel.nationalite}
                </p>
                <p>
                  <strong>Profession:</strong> {editingModel.profession}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Localisation:</strong> {editingModel.localisation}
                </p>
                <p>
                  <strong>Domicile:</strong> {editingModel.domicile}
                </p>
                <p>
                  <strong>Passe-temps:</strong> {editingModel.passe_temps}
                </p>
                <p className="italic">"{editingModel.citation}"</p>
              </div>
              {editingModel.photo && (
                <div className="md:col-span-2 text-center">
                  <img
                    src={`${import.meta.env.VITE_IMG_URL}${editingModel.photo}`}
                    alt={editingModel.prenom}
                    className="w-48 h-48 object-cover rounded-lg mx-auto border border-gray-300"
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="italic">Aucun modèle sélectionné</p>
          )}

          {localSettings.show_custom_content &&
            localSettings.custom_content && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <div
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
