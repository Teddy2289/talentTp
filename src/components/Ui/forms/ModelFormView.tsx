import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { modelServiceCrud } from "../../../services/modelServiceCrud";
import { categoryServiceCrud } from "../../../services/categoryServiceCrud";
import type { CreateModel, UpdateModel, Model } from "../../../types/model";
import type { Categorie } from "../../../types/category";
import { ArrowLeftIcon } from "lucide-react";

interface Props {
  modelId?: number;
}

interface CategoryOption {
  value: number;
  label: string;
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
    categoryIds: [],
  });

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >([]);
  const [photo, setPhoto] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null>(null);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryServiceCrud.getAll();
        setCategories(categoriesData);

        // Préparer les options pour react-select
        const options = categoriesData.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setCategoryOptions(options);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories :", err);
        setError("Impossible de charger les catégories");
      }
    };

    fetchCategories();
  }, []);

  // Charger le modèle si édition
  useEffect(() => {
    if (!modelId) return;

    const fetchModel = async () => {
      setLoading(true);
      try {
        const model = await modelServiceCrud.getById(modelId);
        setForm({
          prenom: model.prenom || "",
          nationalite: model.nationalite || "",
          age:
            model.age !== null && model.age !== undefined
              ? model.age
              : undefined,
          passe_temps: model.passe_temps || "",
          citation: model.citation || "",
          domicile: model.domicile || "",
          localisation: model.localisation || "",
          // Convertir en nombres
          categoryIds: model.categories
            ? model.categories.map((c) => Number(c.id))
            : [],
        });
        // ... reste du code
      } catch (err) {
        console.error("Erreur lors de la récupération du modèle :", err);
        setError("Impossible de charger le modèle");
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [modelId]);

  // ModelFormView.tsx - Remplacez handleCategoryChange par ceci :

  const handleCategoryChange = (selectedOptions: any) => {
    setSelectedCategories(selectedOptions || []);

    // FORCER la conversion en nombres
    const categoryIds = selectedOptions
      ? selectedOptions
          .map((option: CategoryOption) => {
            // Convertir explicitement en nombre
            const id = Number(option.value);
            return isNaN(id) ? 0 : id; // Fallback à 0 si conversion échoue
          })
          .filter((id: number) => id !== 0) // Filtrer les conversions invalides
      : [];

    console.log("✅ Category IDs (nombres):", categoryIds);
    setForm((prev) => ({ ...prev, categoryIds }));
  };

  // Ajoutez cette validation pour l'âge
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Pour tous les champs, garder la valeur telle quelle (string)
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

    console.log("🔍 Vérification finale - categoryIds:", {
      values: form.categoryIds,
      types: Array.isArray(form.categoryIds)
        ? form.categoryIds.map((id) => ({ value: id, type: typeof id }))
        : form.categoryIds,
    });

    try {
      if (editingModel) {
        await modelServiceCrud.update(editingModel.id, form, photo);
      } else {
        await modelServiceCrud.create(form as CreateModel, photo);
      }
      navigate("/admin/models");
    } catch (err) {
      console.error("❌ Erreur API :", err);
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégories *
                </label>
                <Select
                  isMulti
                  options={categoryOptions}
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Sélectionnez une  catégories..."
                  noOptionsMessage={() => "Aucune catégorie disponible"}
                />
              </div>
            </div>

            <TextAreaField
              label="Citation"
              name="citation"
              value={form.citation || ""}
              onChange={handleChange}
            />

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

      <style>{`
        .react-select-container .react-select__control {
          border: 1px solid #D1D5DB;
          border-radius: 0.5rem;
          padding: 0.5rem;
          min-height: 48px;
        }
        
        .react-select-container .react-select__control:hover {
          border-color: #D1D5DB;
        }
        
        .react-select-container .react-select__control--is-focused {
          border-color: #EAB308;
          box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.2);
        }
        
        .react-select-container .react-select__multi-value {
          background-color: #FEF3C7;
          border-radius: 0.25rem;
        }
        
        .react-select-container .react-select__multi-value__label {
          color: #92400E;
        }
      `}</style>
    </div>
  );
}

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
