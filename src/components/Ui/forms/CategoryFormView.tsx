// components/Ui/forms/CategoryFormView.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryServiceCrud } from "../../../services/categoryServiceCrud";
import type {
  CreateCategorie,
  UpdateCategorie,
  Categorie,
} from "../../../types/category";

interface Props {
  categoryId?: number;
}

export default function CategoryFormView({ categoryId }: Props) {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateCategorie | UpdateCategorie>({
    name: "",
    slug: "",
    description: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Categorie | null>(
    null
  );

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const category = await categoryServiceCrud.getById(categoryId);
        setForm(category);
        setEditingCategory(category);
      } catch (err) {
        console.error("Erreur lors de la récupération de la catégorie :", err);
        setError("Impossible de charger la catégorie");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingCategory) {
        await categoryServiceCrud.update(
          editingCategory.id,
          form as UpdateCategorie
        );
      } else {
        await categoryServiceCrud.create(form as CreateCategorie);
      }
      navigate("/admin/categories");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/admin/categories")}
          className="mr-4 hover:text-yellow-900">
          ← Retour
        </button>
        <h1 className="text-3xl font-bold">
          {editingCategory ? "Modifier une catégorie" : "Créer une catégorie"}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && !editingCategory ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <InputField
              label="Nom *"
              name="name"
              value={form.name || ""}
              onChange={handleNameChange}
              required
            />

            <InputField
              label="Slug *"
              name="slug"
              value={form.slug || ""}
              onChange={handleChange}
              required
            />

            <TextAreaField
              label="Description"
              name="description"
              value={form.description || ""}
              onChange={handleChange}
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="is_active"
                className="ml-2 block text-sm text-gray-900">
                Catégorie active
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50">
                {loading
                  ? editingCategory
                    ? "Mise à jour..."
                    : "Création..."
                  : editingCategory
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

// Composants utilitaires
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
