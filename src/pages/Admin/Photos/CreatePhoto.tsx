import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { photoService } from "../../../services/photoService";
import { ArrowLeftIcon, XIcon, TagIcon } from "lucide-react";

export default function CreatePhoto() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [likes, setLikes] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const availableTags = [
    "à la une",
    "récente",
    "populaire",
    "nature",
    "portrait",
    "voyage",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setError("");

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 10MB");
        setImage(null);
        setPreviewUrl(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleTagSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
    e.target.value = "";
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Vous devez être connecté");
    if (!title.trim()) return setError("Le titre est requis");
    if (!image) return setError("Veuillez sélectionner une image");

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("alt", title.trim());
      formData.append("image", image);
      formData.append("tags", JSON.stringify(tags));
      formData.append("likes", likes.toString());

      await photoService.create(formData, token);
      navigate("/admin/photo");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la création de la photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/admin/photo");

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
            Ajouter une nouvelle photo
          </h1>
          <p className="text-gray-600 mt-2">
            Remplissez les informations pour ajouter une nouvelle photo à la
            galerie
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
                  Image *
                </label>
                <div className="flex flex-col items-center">
                  <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
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
                      Choisir une image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Formats acceptés: JPG, PNG, GIF • Max: 10MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Title */}
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

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
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

                {/* Likes */}
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
                <span>Créer la photo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
