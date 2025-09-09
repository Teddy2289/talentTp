// components/Ui/forms/ModelFormView.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { modelServiceCrud } from "../../../services/modelServiceCrud";
import type { CreateModel, UpdateModel, Model } from "../../../types/model";

interface Props {
  modelId?: number;
}

export default function ModelFormView({ modelId }: Props) {
  const navigate = useNavigate();

  // ⚡️ Formulaire
  const [form, setForm] = useState<CreateModel | UpdateModel>({
    prenom: "",
    nationalite: "",
    age: undefined,
    passe_temps: "",
    citation: "",
    domicile: "",
    profession: "",
    localisation: "",
  });

  const [photo, setPhoto] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingModel, setEditingModel] = useState<Model | null>(null);

  // ⚡️ Charger le modèle si on est en édition
  useEffect(() => {
    if (!modelId) return;

    const fetchModel = async () => {
      setLoading(true);
      try {
        const model = await modelServiceCrud.getById(modelId);
        setForm(model);
        setEditingModel(model);
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/admin/models")}
          className="mr-4  hover:text-yellow-900">
          ← Retour
        </button>
        <h1 className="text-3xl font-bold 0">
          {editingModel ? "Modifier un modèle" : "Créer un modèle"}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && !editingModel ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-black">
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

            <TextAreaField
              label="Citation"
              name="citation"
              value={form.citation || ""}
              onChange={handleChange}
            />

            <InputField
              label="Domicile"
              name="domicile"
              value={form.domicile || ""}
              onChange={handleChange}
            />

            <InputField
              label="Profession"
              name="profession"
              value={form.profession || ""}
              onChange={handleChange}
            />

            <InputField
              label="Localisation"
              name="localisation"
              value={form.localisation || ""}
              onChange={handleChange}
            />

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0])}
                className="w-full"
              />
              {editingModel?.photo && !photo && (
                <img
                  src={`${import.meta.env.VITE_IMG_URL}${editingModel.photo}`}
                  alt="aperçu"
                  className="mt-2 h-24 rounded-md object-cover"
                />
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/models")}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
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
        )}
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
