import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { photoService } from "../../../services/photoService";
import { ArrowLeftIcon, XIcon } from "lucide-react";

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

  // 🆕 Liste des tags prédéfinis
  const availableTags = [
    "Nature",
    "Voyage",
    "Architecture",
    "Nourriture",
    "Animaux",
    "Portrait",
  ];

  // 🆕 Fonction pour gérer la sélection dans le <select>
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setTags(selectedOptions);
  };

  // La fonction `removeTag` peut être conservée pour permettre la désélection visuelle
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Le reste du code...
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
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Vous devez être connecté");
      return;
    }

    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }

    if (!image) {
      setError("Veuillez sélectionner une image");
      return;
    }

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
    } catch (error) {
      console.error("Erreur lors de la création", error);
      setError("Une erreur est survenue lors de la création de la photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/photo");
  };

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
            Ajouter une nouvelle photo
          </h1>
          <p className="text-gray-600 mt-2">
            Remplissez les informations pour ajouter une nouvelle photo à la
            galerie
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
                Image *
              </label>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
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
                        Aucune image sélectionnée
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
                <p className="text-xs text-gray-500 mt-3">
                  Formats acceptés: JPG, PNG, GIF • Max: 10MB
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

            {/* Tags Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>

              {/* Tags display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
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

              {/* Nouvelle liste déroulante pour les tags */}
              <select
                multiple
                value={tags} // Assurez-vous que l'état 'tags' est lié à la valeur du select
                onChange={handleSelectChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200">
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs
                tags.
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
                <span>Créer la photo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
