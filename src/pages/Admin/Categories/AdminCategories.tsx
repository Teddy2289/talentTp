// views/admin/AdminCategories.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../../../hooks/useCategories";

const AdminCategories: React.FC = () => {
  const { categories, loading, error, deleteCategory } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?"))
      return;
    try {
      await deleteCategory(id);
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  const filteredCategories = categories.filter((c) =>
    `${c.name} ${c.slug} ${c.description || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
        <Link
          to="/admin/categories/create"
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
          + Nouvelle Catégorie
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="bg-gray-100 p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom, slug, description..."
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSearchTerm("")}
              className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des catégories */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                <td className="px-6 py-4 text-gray-600">
                  {category.description || "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      category.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {category.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <Link
                      to={`/admin/categories/edit/${category.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800 font-medium">
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune catégorie trouvée
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
