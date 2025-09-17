import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useModels } from "../../../hooks/useModels";
import { categoryServiceCrud } from "../../../services/categoryServiceCrud";
import type { Categorie } from "../../../types/category";
import CategoryFilter from "../../../components/Ui/CategoryFilter";
import Pagination from "../../../components/Ui/Pagination";

const AdminModels: React.FC = () => {
  const { models, loading, error, deleteModel } = useModels();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Charger toutes les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesError(null);
        const data = await categoryServiceCrud.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories :", err);
        setCategoriesError(
          "Impossible de charger les catégories. Veuillez réessayer plus tard."
        );
      }
    };
    fetchCategories();
  }, []);

  // Réinitialiser la page à 1 lorsque les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchTerm]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce modèle ?"))
      return;
    try {
      await deleteModel(id);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("Erreur lors de la suppression du modèle. Veuillez réessayer.");
    }
  };

  // Vérifier si models est vide ou non défini
  const hasModels = models && models.length > 0;

  // Filtrer les modèles par recherche et par catégories sélectionnées
  const filteredModels = hasModels
    ? models
        .filter((m) =>
          `${m.prenom} ${m.nationalite || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .filter((m) =>
          selectedCategories.length === 0
            ? true
            : m.categories?.some((mc) => selectedCategories.includes(mc.id))
        )
    : [];

  // Logique de pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredModels.length / itemsPerPage)
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedModels = filteredModels.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Erreur! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="text-center">
          <Link
            to="/admin/models/create"
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors inline-block">
            Créer un nouveau modèle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Modèles</h1>
        <Link
          to="/admin/models/create"
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
          + Nouveau Modèle
        </Link>
      </div>

      {/* Filtre par catégorie */}
      <div className="mb-6">
        {categoriesError ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Attention: </strong>
            {categoriesError}
          </div>
        ) : (
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
        )}
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
              placeholder="Prénom, nationalité..."
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategories([]);
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors">
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Message si aucun modèle n'existe */}
      {!hasModels && !loading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <div className="text-gray-500 text-lg mb-4">
            Aucun modèle n'a été créé pour le moment.
          </div>
          <Link
            to="/admin/models/create"
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors inline-block">
            Créer votre premier modèle
          </Link>
        </div>
      )}

      {/* Tableau des modèles (seulement s'il y a des modèles) */}
      {hasModels && (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Modèle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Âge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Nationalité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedModels.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {model.prenom}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                        {model.age} ans
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">
                        {model.nationalite || "Non spécifié"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {model.photo ? (
                        <img
                          src={`${import.meta.env.VITE_IMG_URL}${model.photo}`}
                          alt={model.prenom}
                          className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://cdn-icons-png.flaticon.com/512/9187/9187604.png";
                          }}
                        />
                      ) : (
                        <span className="text-sm italic text-gray-400">
                          Aucune photo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/models/edit/${model.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium">
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(model.id)}
                          className="text-red-600 hover:text-red-800 font-medium">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredModels.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun modèle trouvé pour les filtres actuels.
              </div>
            )}
          </div>

          {/* Pagination (seulement s'il y a des modèles) */}
          {filteredModels.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminModels;
