import React, { useEffect, useState, useMemo } from "react";
import { photoService } from "../../../services/photoService";
import type { Photo } from "../../../types/photoType";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Edit, Trash } from "lucide-react";

export default function PhotoPage() {
  const { token } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>(""); // Filtre par tag

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      const data = await photoService.getAll(token || undefined);
      setPhotos(data);
    } catch (error) {
      console.error("Erreur lors du chargement des photos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleCreate = () => {
    setSelectedPhoto(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (
      !token ||
      !window.confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")
    )
      return;

    try {
      await photoService.delete(id, token);
      fetchPhotos();
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  // Récupérer tous les tags uniques
  const availableTags = useMemo(() => {
    const allTags = photos.flatMap((p) => p.tags || []);
    return Array.from(new Set(allTags)); // Supprime les doublons
  }, [photos]);

  // Appliquer le filtre
  const filteredPhotos = useMemo(() => {
    if (!selectedTag) return photos;
    return photos.filter((p) => p.tags?.includes(selectedTag));
  }, [photos, selectedTag]);

  // Fonction pour construire l'URL complète de l'image
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;

    const baseUrl = "http://localhost:3000";
    return url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  };

  return (
    <div className="min-h-screen  p-2">
      <div className="max-w-7xl mx-auto bg-gray-50 p-4">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Galerie Photos</h1>
            <p className="text-gray-600 mt-2">
              Gérez votre collection de photos
            </p>
          </div>
          <Link
            to={"/admin/photo/create"}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
            <span>+</span> <span>Nouvelle photo</span>
          </Link>
        </div>

        {/* FILTRE PAR TAG */}
        {availableTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3 items-center">
            <button
              onClick={() => setSelectedTag("")}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedTag === ""
                  ? "bg-[#e1af30] text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Tous
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedTag === tag
                    ? "bg-[#e1af30] text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* LISTE DES PHOTOS */}
        {filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune photo trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez avec un autre tag ou ajoutez une photo
            </p>
            <Link
              to={"/admin/photo/create"}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              <span>+</span> Ajouter une photo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div className="wrapper-photo">
                <div className="card-photo group" key={photo.id}>
                  <img
                    src={getImageUrl(photo.url)}
                    alt={photo.alt}
                    className="card-image"
                  />

                  <div className="card-overlay"></div>

                  <div className="card-content">
                    <div className="card-header">
                      <h2 className="card-title">
                        {photo.alt || "Sans titre"}
                      </h2>
                      <div className="card-actions">
                        <Link
                          to={`/admin/photo/edit/${photo.id}`}
                          className="card-btn card-btn-edit"
                          title="Modifier">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="card-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="card-btn card-btn-delete"
                          title="Supprimer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="card-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="card-details">
                      <div className="card-tags">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="card-detail-icon"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {photo.tags?.length
                            ? photo.tags.join(", ")
                            : "Aucun tag"}
                        </span>
                      </div>

                      <div className="card-meta">
                        <div className="card-likes">
                          <Edit className="card-detail-icon" />
                          <span>{photo.likes || 0}</span>
                        </div>

                        <div className="card-date">
                          <Trash className="card-detail-icon" />
                          <span>
                            {new Date(
                              photo.created_at || ""
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <PhotoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            photo={selectedPhoto}
            onSuccess={fetchPhotos}
          />
        )}
      </div>
    </div>
  );
}
