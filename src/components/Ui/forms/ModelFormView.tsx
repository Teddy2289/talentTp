import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { modelServiceCrud } from "../../../services/modelServiceCrud";
import type { CreateModel, UpdateModel, Model } from "../../../types/model";
import { ArrowLeftIcon } from "lucide-react";

interface Props {
  modelId?: number;
}

export default function ModelFormView({ modelId }: Props) {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateModel | UpdateModel>({
    prenom: "",
    nationalite: "",
    age: undefined,
    passe_temps: "",
    citation: "",
    domicile: "",
    localisation: "",
  });

  const [photo, setPhoto] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingModel, setEditingModel] = useState<Model | null>(null);

  // ⚡️ Charger le modèle si édition
  useEffect(() => {
    if (!modelId) return;

    const fetchModel = async () => {
      setLoading(true);
      try {
        const model = await modelServiceCrud.getById(modelId);
        setForm(model);
        setEditingModel(model);
        if (model.photo) {
          setPreviewUrl(`${import.meta.env.VITE_IMG_URL}${model.photo}`);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du modèle :", err);
        setError("Impossible de charger le modèle");
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [modelId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingModel) {
        await modelServiceCrud.update(editingModel.id, form, photo);
      } else {
        await modelServiceCrud.create(form as CreateModel, photo);
      }
      navigate("/admin/models");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/admin/models")}
            className="flex items-center text-yellow-600 hover:text-yellow-800 transition-colors duration-200 mr-4">
            <ArrowLeftIcon className="mr-2" size={20} /> Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {editingModel ? "Modifier un modèle" : "Créer un modèle"}
          </h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            {/* Grid pour inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputField
                label="Prénom *"
                name="prenom"
                value={form.prenom || ""}
                onChange={handleChange}
                required
              />
              <InputField
                label="Nationalité *"
                name="nationalite"
                value={form.nationalite || ""}
                onChange={handleChange}
                required
              />
              <InputField
                label="Âge"
                type="number"
                name="age"
                value={form.age ?? ""}
                onChange={handleChange}
              />
              <InputField
                label="Passe-temps"
                name="passe_temps"
                value={form.passe_temps || ""}
                onChange={handleChange}
              />
              <InputField
                label="Domicile"
                name="domicile"
                value={form.domicile || ""}
                onChange={handleChange}
              />

              <InputField
                label="Localisation"
                name="localisation"
                value={form.localisation || ""}
                onChange={handleChange}
              />
            </div>

            <TextAreaField
              label="Citation"
              name="citation"
              value={form.citation || ""}
              onChange={handleChange}
            />

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo
              </label>
              <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 mb-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Aperçu de la photo
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/models")}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={loading}>
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-all duration-200">
                {loading
                  ? editingModel
                    ? "Mise à jour..."
                    : "Création..."
                  : editingModel
                  ? "Mettre à jour"
                  : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 🔹 Composants utilitaires
function InputField({
  label,
  type = "text",
  ...props
}: {
  label: string;
  type?: string;
  name: string;
  value: any;
  onChange: any;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
      />
    </div>
  );
}

function TextAreaField({
  label,
  ...props
}: {
  label: string;
  name: string;
  value: any;
  onChange: any;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
      />
    </div>
  );
}
