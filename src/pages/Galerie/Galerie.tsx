import { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { photoService } from "../../services/photoService"; // Import du service
import type { Photo } from "../../types/photoType"; // Import du type

export default function Galerie() {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les photos depuis l'API
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      // Appel au service pour récupérer toutes les photos
      const photosData = await photoService.getAll();
      setGalleryPhotos(photosData);
    } catch (err) {
      console.error("Erreur lors du chargement des photos:", err);
      setError(
        "Impossible de charger les photos. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  // Charger les likes depuis le localStorage au montage du composant
  useEffect(() => {
    const savedLikes = localStorage.getItem("photoLikes");
    if (savedLikes) {
      const likesData: Record<number, number> = JSON.parse(savedLikes);
      setGalleryPhotos((prevPhotos) =>
        prevPhotos.map((photo) => ({
          ...photo,
          likes: likesData[photo.id] || photo.likes || 0,
        }))
      );
    }
  }, []);

  // Sauvegarder les likes dans le localStorage
  const saveLikesToLocalStorage = (
    photoId: number,
    likesCount: number
  ): void => {
    const savedLikes = localStorage.getItem("photoLikes");
    const likesData = savedLikes ? JSON.parse(savedLikes) : {};
    likesData[photoId] = likesCount;
    localStorage.setItem("photoLikes", JSON.stringify(likesData));
  };

  // Gestion du like
  const handleLike = (photoId: number, e: React.MouseEvent): void => {
    e.stopPropagation(); // Empêche l'ouverture du modal quand on like
    setGalleryPhotos((prevPhotos) =>
      prevPhotos.map((photo) => {
        if (photo.id === photoId) {
          const newLikes = (photo.likes || 0) + 1;
          saveLikesToLocalStorage(photoId, newLikes);
          return { ...photo, likes: newLikes };
        }
        return photo;
      })
    );
  };

  // Filtrer les photos
  const filteredPhotos =
    selectedTag === "all"
      ? galleryPhotos
      : galleryPhotos.filter(
          (photo) => photo.tags && photo.tags.includes(selectedTag)
        );

  // Trier les photos
  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    if (sortBy === "likes") {
      return (b.likes || 0) - (a.likes || 0);
    } else if (sortBy === "recent") {
      // Trier par date de création si disponible, sinon par ID
      if (a.created_at && b.created_at) {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return (b.id || 0) - (a.id || 0);
    }
    return (a.id || 0) - (b.id || 0); // Ordre par défaut
  });

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) {
      return url;
    }
    // Si l'URL est relative, ajouter le base URL de votre API
    return `http://localhost:3000${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e1af30]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-red-900 bg-opacity-20 border border-red-700 text-red-300 px-6 py-4 rounded-lg max-w-md mx-auto">
            <p>{error}</p>
            <button
              onClick={fetchPhotos}
              className="mt-4 bg-[#e1af30] text-black px-4 py-2 rounded-full hover:bg-[#d4a225] transition-colors">
              Réessayer
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="gallery"
      className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Découvre mes <span className="text-[#e1af30]">photos</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10">
          Une collection de moments capturés.
        </p>

        {/* Filtres et tri */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTag("all")}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                selectedTag === "all"
                  ? "bg-[#e1af30] text-black"
                  : "bg-gray-700 text-white hover:bg-[#e1af30] hover:text-black"
              }`}>
              Tout
            </button>
            <button
              onClick={() => setSelectedTag("a la une")}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                selectedTag === "a la une"
                  ? "bg-[#e1af30] text-black"
                  : "bg-gray-700 text-white hover:bg-[#e1af30] hover:text-black"
              }`}>
              À la une
            </button>
            <button
              onClick={() => setSelectedTag("recent")}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                selectedTag === "recent"
                  ? "bg-[#e1af30] text-black"
                  : "bg-gray-700 text-white hover:bg-[#e1af30] hover:text-black"
              }`}>
              Récent
            </button>
            <button
              onClick={() => setSelectedTag("le plus aimé")}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                selectedTag === "le plus aimé"
                  ? "bg-[#e1af30] text-black"
                  : "bg-gray-700 text-white hover:bg-[#e1af30] hover:text-black"
              }`}>
              Plus aimés
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e1af30]">
              <option value="default">Par défaut</option>
              <option value="likes">Plus aimés</option>
              <option value="recent">Plus récents</option>
            </select>
          </div>
        </div>

        {/* Galerie de photos */}
        <div className="px-5 py-2 lg:px-32 lg:pt-12">
          {sortedPhotos.length > 0 ? (
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
              <Masonry gutter="1.5rem">
                {sortedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 relative group"
                    onClick={() => setSelectedPhoto(photo)}>
                    <img
                      src={getImageUrl(photo.url)}
                      alt={photo.alt || "Photo sans titre"}
                      className="block w-full h-auto object-cover"
                      loading="lazy"
                    />

                    {/* Overlay avec informations */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end p-4">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 w-full">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-medium text-sm truncate">
                            {photo.alt || "Sans titre"}
                          </h3>
                          <button
                            onClick={(e) => handleLike(photo.id!, e)}
                            className="flex items-center gap-1 bg-black bg-opacity-50 rounded-full px-3 py-1 text-white hover:text-[#e1af30] transition-colors duration-300"
                            aria-label="Aimer cette photo">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm">{photo.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Badge pour les photos à la une */}
                    {photo.tags && photo.tags.includes("a la une") && (
                      <div className="absolute top-2 left-2 bg-[#e1af30] text-black text-xs font-bold px-2 py-1 rounded-full">
                        À la une
                      </div>
                    )}
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          ) : (
            <p className="text-gray-500 text-center py-10">
              Aucune photo trouvée pour cette catégorie.
            </p>
          )}
        </div>
      </div>

      {/* Modal pour l'affichage en grand */}
      <Transition appear show={!!selectedPhoto} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setSelectedPhoto(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-90" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all relative">
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300 z-10 bg-black bg-opacity-50 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {selectedPhoto && (
                    <div className="relative">
                      <img
                        src={getImageUrl(selectedPhoto.url)}
                        alt={selectedPhoto.alt || "Photo sans titre"}
                        className="w-full h-auto rounded-lg"
                      />

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white text-xl font-semibold">
                            {selectedPhoto.alt || "Sans titre"}
                          </h3>
                          <button
                            onClick={() => {
                              // Simuler un événement pour handleLike
                              const mockEvent = {
                                stopPropagation: () => {},
                              } as React.MouseEvent;
                              handleLike(selectedPhoto.id!, mockEvent);
                              setGalleryPhotos((prev) => [...prev]); // Force update
                            }}
                            className="flex items-center gap-2 bg-black bg-opacity-50 rounded-full px-4 py-2 text-white hover:text-[#e1af30] transition-colors duration-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{selectedPhoto.likes || 0}</span>
                          </button>
                        </div>

                        {selectedPhoto.tags &&
                          selectedPhoto.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {selectedPhoto.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-[#e1af30] bg-opacity-20 text-[#e1af30] text-xs px-3 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
