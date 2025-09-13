import { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { photoService } from "../../services/photoService";
import type { Photo } from "../../types/photoType";
import {
  Heart,
  X,
  Filter,
  ArrowUpDown,
  Sparkles,
  Calendar,
  Flame,
} from "lucide-react";
import "./Galerie.css";

export default function Galerie() {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Charger les photos depuis l'API
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const photosData = await photoService.getAll();
      setGalleryPhotos(photosData);

      // Extraire tous les tags uniques
      const allTags = photosData.flatMap((photo) => photo.tags || []);
      const uniqueTags = Array.from(new Set(allTags));
      setAvailableTags(uniqueTags);
    } catch (err) {
      console.error("Erreur lors du chargement des photos:", err);
      setError(
        "Impossible de charger les photos. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  // Charger les likes depuis le localStorage
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

  // Gestion du like avec animation
  const handleLike = (photoId: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    setGalleryPhotos((prevPhotos) =>
      prevPhotos.map((photo) => {
        if (photo.id === photoId) {
          const newLikes = (photo.likes || 0) + 1;
          saveLikesToLocalStorage(photoId, newLikes);
          return { ...photo, likes: newLikes, liked: true };
        }
        return photo;
      })
    );

    // Réinitialiser l'état "liked" après l'animation
    setTimeout(() => {
      setGalleryPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo.id === photoId) {
            return { ...photo, liked: false };
          }
          return photo;
        })
      );
    }, 800);
  };

  // Filtrer les photos par tag
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
      if (a.created_at && b.created_at) {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return (b.id || 0) - (a.id || 0);
    }
    return (a.id || 0) - (b.id || 0);
  });

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) {
      return url;
    }
    return `${import.meta.env.VITE_IMG_URL || "http://localhost:3000"}${
      url.startsWith("/") ? "" : "/"
    }${url}`;
  };

  if (loading) {
    return (
      <section className="gallery-section loading">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement des photos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="gallery-section">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Erreur de chargement</h3>
            <p>{error}</p>
            <button onClick={fetchPhotos} className="retry-button">
              <Sparkles size={16} />
              Réessayer
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="gallery-header">
          <h1 className="gallery-title">
            Découvre mes <span className="accent-text">photos</span>
          </h1>
          <p className="gallery-subtitle">
            Une collection de moments capturés avec passion et créativité
          </p>
        </div>

        {/* Filtres et tri */}
        <div className="gallery-controls">
          <div className="filters-section">
            <div className="section-label">
              <Filter size={18} />
              <span>Filtres</span>
            </div>
            <div className="tags-container">
              <button
                onClick={() => setSelectedTag("all")}
                className={`tag ${selectedTag === "all" ? "active" : ""}`}>
                <span>Tout voir</span>
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`tag ${selectedTag === tag ? "active" : ""}`}>
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sort-section">
            <div className="section-label">
              <ArrowUpDown size={18} />
              <span>Trier par</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select">
              <option value="default">Par défaut</option>
              <option value="likes">Plus aimés</option>
              <option value="recent">Plus récents</option>
            </select>
          </div>
        </div>

        {/* Galerie de photos */}
        <div className="gallery-content">
          {sortedPhotos.length > 0 ? (
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}>
              <Masonry gutter="1.5rem">
                {sortedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="gallery-item"
                    onClick={() => setSelectedPhoto(photo)}>
                    <div className="image-container">
                      <img
                        src={getImageUrl(photo.url)}
                        alt={photo.alt || "Photo sans titre"}
                        className="gallery-image"
                        loading="lazy"
                      />

                      {/* Overlay avec informations */}
                      <div className="image-overlay">
                        <div className="image-info">
                          <h3 className="image-title">
                            {photo.alt || "Sans titre"}
                          </h3>
                          <button
                            onClick={(e) => handleLike(photo.id!, e)}
                            className={`like-button ${
                              photo.liked ? "liked" : ""
                            }`}
                            aria-label="Aimer cette photo">
                            <Heart
                              size={20}
                              fill={photo.liked ? "currentColor" : "none"}
                            />
                            <span className="like-count">
                              {photo.likes || 0}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Badge pour les photos à la une */}
                      {photo.tags && photo.tags.includes("à la une") && (
                        <div className="featured-badge">
                          <Flame size={14} />
                          <span>À la une</span>
                        </div>
                      )}

                      {/* Date de création */}
                      {photo.created_at && (
                        <div className="date-badge">
                          <Calendar size={12} />
                          <span>
                            {new Date(photo.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📸</div>
              <h3>Aucune photo trouvée</h3>
              <p>Aucune photo ne correspond au filtre "{selectedTag}"</p>
              <button
                onClick={() => setSelectedTag("all")}
                className="view-all-button">
                Voir toutes les photos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour l'affichage en grand */}
      <Transition appear show={!!selectedPhoto} as={Fragment}>
        <Dialog
          as="div"
          className="modal-dialog"
          onClose={() => setSelectedPhoto(null)}>
          <Transition.Child
            as={Fragment}
            enter="modal-enter"
            enterFrom="modal-enter-from"
            enterTo="modal-enter-to"
            leave="modal-leave"
            leaveFrom="modal-leave-from"
            leaveTo="modal-leave-to">
            <div className="modal-backdrop" />
          </Transition.Child>

          <div className="modal-container">
            <div className="modal-content">
              <Transition.Child
                as={Fragment}
                enter="modal-enter"
                enterFrom="modal-enter-from"
                enterTo="modal-enter-to"
                leave="modal-leave"
                leaveFrom="modal-leave-from"
                leaveTo="modal-leave-to">
                <Dialog.Panel className="modal-panel">
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="modal-close-button">
                    <X size={24} />
                  </button>

                  {selectedPhoto && (
                    <div className="modal-image-container">
                      <img
                        src={getImageUrl(selectedPhoto.url)}
                        alt={selectedPhoto.alt || "Photo sans titre"}
                        className="modal-image"
                      />

                      <div className="modal-info">
                        <div className="modal-header">
                          <h3 className="modal-title">
                            {selectedPhoto.alt || "Sans titre"}
                          </h3>
                          <button
                            onClick={() => {
                              const mockEvent = {
                                stopPropagation: () => {},
                              } as React.MouseEvent;
                              handleLike(selectedPhoto.id!, mockEvent);
                            }}
                            className="modal-like-button">
                            <Heart
                              size={24}
                              fill={
                                (selectedPhoto.likes || 0) > 0
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            <span>{selectedPhoto.likes || 0}</span>
                          </button>
                        </div>

                        {selectedPhoto.tags &&
                          selectedPhoto.tags.length > 0 && (
                            <div className="modal-tags">
                              {selectedPhoto.tags.map((tag, index) => (
                                <span key={index} className="modal-tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                        {selectedPhoto.created_at && (
                          <div className="modal-date">
                            <Calendar size={16} />
                            <span>
                              Publié le{" "}
                              {new Date(
                                selectedPhoto.created_at
                              ).toLocaleDateString()}
                            </span>
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
