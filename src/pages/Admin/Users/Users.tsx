import React, { useState, useEffect } from "react";
import { userService } from "../../../services/userService";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { UserType, type User } from "../../../types/userTypes";
import Pagination from "../../../components/Ui/Pagination"; // ✨ Importer le composant Pagination

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const { token } = useAuth();

  // ✨ --- États pour la pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Nombre d'éléments par page
  // ✨ ----------------------------------

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await userService.getAll(token!);
      setUsers(userData);
      setCurrentPage(1); // ✨ Réinitialiser la page
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
      return;

    try {
      await userService.delete(id, token!);
      // Re-fetch la liste pour que la pagination se mette à jour correctement
      fetchUsers();
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const criteria: any = {};
      if (searchTerm) {
        criteria.email = searchTerm; // Note: votre API doit gérer la recherche sur plusieurs champs
      }
      if (filterType !== "all") {
        criteria.type = filterType;
      }

      const results = await userService.search(criteria, token!);
      setUsers(results);
      setCurrentPage(1); // ✨ Réinitialiser la page après une recherche
    } catch (err) {
      setError("Erreur lors de la recherche");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    fetchUsers(); // fetchUsers réinitialise déjà la page
  };

  // ✨ --- Logique de pagination ---
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  // ✨ --------------------------------

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold ">Gestion des Utilisateurs</h1>
        <Link
          to="/admin/users/create"
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
          + Nouvel Utilisateur
        </Link>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8 text-black">
        {/* ... votre code pour les filtres ... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {" "}
          <div>
                       {" "}
            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rechercher            {" "}
            </label>
                       {" "}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Email, prénom, nom..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
                     {" "}
          </div>
                   {" "}
          <div>
                       {" "}
            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type d'utilisateur            {" "}
            </label>
                       {" "}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                            <option value="all">Tous</option>             {" "}
              <option value={UserType.ADMIN}>Administrateur</option>           
                <option value={UserType.USER}>Utilisateur</option>           {" "}
            </select>
                     {" "}
          </div>
                   {" "}
          <div className="flex items-end space-x-2">
                       {" "}
            <button
              onClick={handleSearch}
              className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors">
                            Rechercher            {" "}
            </button>
                       {" "}
            <button
              onClick={resetFilters}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors">
                            Réinitialiser            {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white text-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          {/* ... votre thead ... */}
          <thead className="bg-gray-200">
                       {" "}
            <tr>
                           {" "}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Utilisateur              {" "}
              </th>
                           {" "}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Type              {" "}
              </th>
                           {" "}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Statut              {" "}
              </th>
                           {" "}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Date de création              {" "}
              </th>
                           {" "}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Actions              {" "}
              </th>
                         {" "}
            </tr>
                     {" "}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* ✨ Itérer sur la liste paginée */}
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* ... votre code pour les <td> ... */}
                <td className="px-6 py-4">
                                   {" "}
                  <div className="font-medium">
                                        {user.first_name} {user.last_name}     
                               {" "}
                  </div>
                                   {" "}
                  <div className="text-sm text-gray-600">{user.email}</div>     
                           {" "}
                </td>
                               {" "}
                <td className="px-6 py-4">
                                   {" "}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.type === UserType.ADMIN
                        ? "bg-purple-100 text-purple-800"
                        : user.type === UserType.AGENT
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                                        {user.type}                 {" "}
                  </span>
                                 {" "}
                </td>
                               {" "}
                <td className="px-6 py-4">
                                   {" "}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.is_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                                       {" "}
                    {user.is_verified ? "Vérifié" : "En attente"}               
                     {" "}
                  </span>
                                 {" "}
                </td>
                               {" "}
                <td className="px-6 py-4 text-sm">
                                   {" "}
                  {new Date(user.created_at).toLocaleDateString()}             
                   {" "}
                </td>
                               {" "}
                <td className="px-6 py-4">
                                   {" "}
                  <div className="flex space-x-2">
                                       {" "}
                    <Link
                      to={`/admin/users/edit/${user.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium">
                                            Modifier                    {" "}
                    </Link>
                                       {" "}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900">
                                            Supprimer                    {" "}
                    </button>
                                     {" "}
                  </div>
                                 {" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>

      {/* ✨ --- Intégration du composant de pagination --- */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {/* ✨ ------------------------------------------------ */}
    </div>
  );
};

export default AdminUsers;
