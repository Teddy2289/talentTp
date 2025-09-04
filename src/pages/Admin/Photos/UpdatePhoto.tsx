import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { photoService } from "../../../services/photoService";
import type { Photo } from "../../../types/photoType";
import { ArrowLeftIcon } from "lucide-react";

export default function UpdatePhoto() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(""); // 🆕 Add state for tags
  const [likes, setLikes] = useState(0); // 🆕 Add state for likes
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!id || !token) return;

      try {
        setIsLoading(true);
        const photoData = await photoService.getById(parseInt(id), token);
        setPhoto(photoData);
        setTitle(photoData.alt || "");
        // 🆕 Set tags and likes from fetched data
        setTags(photoData.tags ? photoData.tags.join(", ") : "");
        setLikes(photoData.likes || 0);

        if (photoData.url) {
          const fullUrl = photoData.url.startsWith("http")
            ? photoData.url
            : `http://localhost:3000${photoData.url}`;
          setPreviewUrl(fullUrl);
        }
      } catch (error) {
        console.error("Erreur lors du chargement", error);
        setError("Impossible de charger la photo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoto();
  }, [id, token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setError("");

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 10MB");
        setImage(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (photo?.url) {
      const fullUrl = photo.url.startsWith("http")
        ? photo.url
        : `http://localhost:3000${photo.url}`;
      setPreviewUrl(fullUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !id) {
      setError("Données manquantes");
      return;
    }

    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("alt", title.trim());
      // 🆕 Add tags and likes to formData
      formData.append("tags", tags);
      formData.append("likes", likes.toString());

      if (image) {
        formData.append("image", image);
      }

      await photoService.update(parseInt(id), formData, token);

      navigate("/admin/photo");
    } catch (error) {
      console.error("Erreur lors de la modification", error);
      setError("Une erreur est survenue lors de la modification de la photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/photo");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Photo non trouvée
          </h1>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-yellow-600 hover:text-yellow-800 mb-4 transition-colors duration-200">
            <ArrowLeftIcon className="mr-2" />
            Retour à la liste
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Modifier la photo
          </h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de la photo
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Image {!image && "(actuelle)"}
              </label>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        setPreviewUrl(null);
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-4">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-sm text-gray-500 text-center">
                        Image non disponible
                      </span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <span className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium">
                    {previewUrl !== photo.url
                      ? "Changer l'image"
                      : "Modifier l'image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-3">
                  Laissez vide pour conserver l'image actuelle • Max: 10MB
                </p>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                placeholder="Donnez un titre à votre photo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* 🆕 Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                placeholder="Ex: nature, voyage, montagne"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* 🆕 Likes Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Likes
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={likes}
                onChange={(e) => setLikes(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                disabled={isSubmitting}>
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2">
                {isSubmitting && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
