import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Heart,
} from "lucide-react";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";
import image3 from "../../assets/image3.jpg";
import image4 from "../../assets/image4.jpg";
import ProfilesPage from "../ProfilesPage/ProfilesPage";
import Galerie from "../Galerie/Galerie";
import Contact from "../Contact/Contact";
import "./Home.css"; // Fichier CSS pour les styles personnalisés

// Types
type Slide = {
  altText?: string;
  imageUrl: string;
};

type HomeData = {
  main_title?: string;
  main_subtitle?: string;
  slides?: Slide[];
};

// Variantes d'animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const glowVariants = {
  initial: { scale: 1, opacity: 0.7 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/settings/frontend`
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setHomeData(data.data.home);
        } else {
          throw new Error("Réponse API non réussie");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Erreur lors du chargement des données:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Données de secours si l'API ne répond pas
  const fallbackProfileCarousel = [
    {
      id: 1,
      description:
        "Romantique et attentionnée - Des conversations douces et réconfortantes",
      image: image1,
    },
    {
      id: 2,
      description:
        "Coquine et directe - Des échanges passionnants et pleins de surprises",
      image: image2,
    },
    {
      id: 3,
      description:
        "Amicale et joyeuse - Des discussions légères et pleines de bonne humeur",
      image: image3,
    },
    {
      id: 4,
      description:
        "Intellectuelle et curieuse - Des conversations profondes et stimulantes",
      image: image4,
    },
  ];

  // Utiliser les données de l'API ou les données de secours
  const profileCarousel =
    homeData?.slides && homeData.slides.length > 0
      ? homeData.slides.map((slide, index) => ({
          id: index + 1,
          description: slide.altText || `Slide ${index + 1}`,
          image: slide.imageUrl,
        }))
      : fallbackProfileCarousel;

  // Auto-rotation du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % profileCarousel.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [profileCarousel.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % profileCarousel.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + profileCarousel.length) % profileCarousel.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient flex-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div id="home" className="home-container">
      {/* Section Hero avec Carrousel */}
      <div className="hero-section">
        {/* Carrousel d'images */}
        <div className="carousel-container">
          {profileCarousel.map((profile, index) => (
            <motion.div
              key={profile.id}
              className="carousel-slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1.5 }}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(15, 15, 15, 0.4), rgba(26, 26, 26, 0.6)), url(${profile.image})`,
              }}
            />
          ))}
        </div>

        {/* Overlay supplémentaire pour améliorer la lisibilité */}
        <div className="hero-overlay" />

        {/* Contenu principal au-dessus du carrousel */}
        <div className="hero-content">
          <div className="title-container">
            {homeData?.main_title && (
              <motion.h1
                className="main-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>
                {homeData.main_title}
              </motion.h1>
            )}
          </div>

          {homeData?.main_subtitle ? (
            <motion.p
              className="subtitle"
              variants={itemVariants}
              initial="hidden"
              animate="visible">
              {(() => {
                const subtitle = homeData.main_subtitle;
                const words = subtitle.split(" ");

                // Mettre en valeur les 3 premiers mots
                if (words.length > 3) {
                  return (
                    <>
                      <span className="highlighted-text">
                        {words.slice(0, 3).join(" ")}
                      </span>
                      {" " + words.slice(3).join(" ")}
                    </>
                  );
                }

                return subtitle;
              })()}
            </motion.p>
          ) : (
            <motion.p
              className="subtitle"
              variants={itemVariants}
              initial="hidden"
              animate="visible">
              Découvrez une{" "}
              <span className="highlighted-text">
                expérience de chat unique
              </span>{" "}
              avec nos compagnons virtuels attentionnés, empathiques et toujours
              disponibles pour vous.
            </motion.p>
          )}

          {/* Boutons d'action */}
          <motion.div
            className="cta-buttons"
            variants={itemVariants}
            initial="hidden"
            animate="visible">
            <motion.button
              className="elegant-button"
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 10px 25px rgba(225, 175, 48, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}>
              <span className="button-content">
                <MessageCircle size={20} className="button-icon" />
                <Link to={"/chat"} className="button-link">
                  Commencer une discussion
                </Link>
              </span>
              <div className="button-background"></div>
              <motion.div
                className="sparkle-container"
                initial={{ opacity: 0, rotate: 0 }}
                whileHover={{
                  opacity: 1,
                  rotate: 10,
                  transition: { duration: 0.4 },
                }}>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Description du profil actuel */}
        <motion.div
          className="slide-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}>
          <div className="description-card">
            <p className="description-text">
              {profileCarousel[currentSlide].description}
            </p>
          </div>
        </motion.div>

        {/* Indicateurs du carrousel */}
        <div className="carousel-indicators">
          {profileCarousel.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              aria-label={`Aller au profil ${index + 1}`}
            />
          ))}
        </div>

        {/* Contrôles de navigation du carrousel */}
        <button
          onClick={prevSlide}
          className="carousel-control prev"
          aria-label="Profil précédent">
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="carousel-control next"
          aria-label="Profil suivant">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Section Statistiques */}
      <motion.section
        className="stats-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}>
        <div className="stats-container">
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, staggerChildren: 0.1 }}
            viewport={{ once: true }}>
            {[
              {
                number: "500+",
                text: "Utilisateurs satisfaits",
                icon: <Users size={32} />,
              },
              {
                number: "24/7",
                text: "Disponibilité",
                icon: <Clock size={32} />,
              },
              {
                number: "98%",
                text: "Taux de satisfaction",
                icon: <Heart size={32} />,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-text">{stat.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section Profils */}
      <section className="profiles-section" id="profiles">
        <ProfilesPage />
      </section>

      {/* Section Galerie */}
      <section className="gallery-section">
        <Galerie />
      </section>

      {/* Section Contact */}
      <section className="contact-section" id="contact">
        <Contact />
      </section>
    </div>
  );
};

export default Home;
