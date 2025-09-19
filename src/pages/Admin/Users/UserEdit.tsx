import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../../../services/userService";
import {
  UserType,
  type UpdateUserRequest,
  type User,
} from "../../../types/userTypes";
import { useAuth } from "../../../contexts/AuthContext";
import { useAlert } from "../../../contexts/AlertContext";

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserRequest>({});
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const userData = await userService.getById(Number(id!), token!);
      setUser(userData);
      setFormData({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        type: userData.type,
        is_verified: userData.is_verified,
      });
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur");
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await userService.update(Number(id!), formData, token!);
      showAlert("success", "Utilisateur modifié avec succès !");

      setTimeout(() => {
        navigate("/admin/users");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (loadingUser) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/admin/users")}
          className="mr-4 hover:text-yellow-200">
          ← Retour
        </button>
        <h1 className="text-3xl font-bold ">Modifier l'utilisateur</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe (laisser vide pour ne pas changer)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'utilisateur
              </label>
              <select
                name="type"
                value={formData.type || UserType.USER}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <option value={UserType.USER}>Utilisateur</option>
                <option value={UserType.ADMIN}>Administrateur</option>
                <option value={UserType.AGENT}>Agent</option>
                <option value={UserType.CLIENT}>Client</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_verified"
                id="is_verified"
                checked={formData.is_verified || false}
                onChange={handleChange}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_verified"
                className="ml-2 block text-sm text-gray-900">
                Compte vérifié
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50">
              {loading ? "Modification..." : "Modifier l'utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
