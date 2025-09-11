import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { photoService } from "../../../services/photoService";
import type { Photo } from "../../../types/photoType";
import { ArrowLeftIcon, XIcon, TagIcon } from "lucide-react";

export default function UpdatePhoto() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [likes, setLikes] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Tags prédéfinis
  const availableTags = [
    "à la une",
    "récente",
    "populaire",
    "nature",
    "portrait",
    "voyage",
  ];

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!id || !token) return;

      try {
        setIsLoading(true);
        const photoData = await photoService.getById(parseInt(id), token);
        setPhoto(photoData);
        setTitle(photoData.alt || "");
        setTags(photoData.tags || []);
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

  const handleTagSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
    e.target.value = ""; // Reset select
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
      formData.append("tags", JSON.stringify(tags));
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
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
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-yellow-600 hover:text-yellow-800 mb-4 transition-colors duration-200">
            <ArrowLeftIcon className="mr-2" size={20} />
            Retour à la liste
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Modifier la photo
          </h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de la photo
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8 text-black">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Image {!image && "(actuelle)"}
                </label>
                <div className="flex flex-col items-center">
                  <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewUrl(null)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full p-6">
                        <TagIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-500 text-center">
                          Aperçu de l'image
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
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Laissez vide pour conserver l'image actuelle • Max: 10MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
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

                {/* Tags Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>

                  {/* Selected Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-yellow-900">
                            <XIcon size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tag Select */}
                  <select
                    onChange={handleTagSelect}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    defaultValue="">
                    <option value="">Sélectionner un tag...</option>
                    {availableTags
                      .filter((tag) => !tags.includes(tag))
                      .map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Ajoutez des tags pour catégoriser votre photo
                  </p>
                </div>

                {/* Likes Input */}
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
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                disabled={isSubmitting}>
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 font-medium">
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
