import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";
import image3 from "../../assets/image3.jpg";
import image4 from "../../assets/image4.jpg";
import ProfilesPage from "../ProfilesPage/ProfilesPage";
import Galerie from "../Galerie/Galerie";
import Contact from "../Contact/Contact";

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

const glowVariants = {
  initial: { scale: 1, opacity: 0.7 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1], // cubic-bezier for easeInOut
    },
  },
};

type Slide = {
  altText?: string;
  imageUrl: string;
};

type HomeData = {
  main_title?: string;
  main_subtitle?: string;
  slides?: Slide[];
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
        console.log("Réponse brute de l'API frontend:", data);

        if (data.success) {
          setHomeData(data.data.home);
        } else {
          throw new Error("Réponse API non réussie");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          console.error("Erreur lors du chargement des données:", err);
        } else {
          setError(String(err));
          console.error("Erreur lors du chargement des données:", err);
        }
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
    }, 5000); // Change toutes les 5 secondes

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
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0c0c0c] flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    console.error("Erreur de chargement des données:", error);
  }

  return (
    <div
      id="home"
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0c0c0c] text-white overflow-hidden">
      {/* Section Hero avec Carrousel */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carrousel d'images */}
        <div className="absolute inset-0 w-full h-full">
          {profileCarousel.map((profile, index) => (
            <motion.div
              key={profile.id}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1.5 }}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(15, 15, 15, 0.4), rgba(26, 26, 26, 0.6)), url(${profile.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          ))}
        </div>

        {/* Overlay supplémentaire pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-0" />

        {/* Contenu principal au-dessus du carrousel */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 text-center relative z-10 pt-16 md:pt-20">
          <div className="mb-4 md:mb-6">
            {homeData?.main_title && (
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>
                {homeData.main_title}
              </motion.h1>
            )}
          </div>

          {homeData?.main_subtitle ? (
            <motion.p className="text-xl md:text-2xl lg:text-3xl mb-4 md:mb-5 max-w-3xl mx-auto leading-relaxed text-gray-200 font-light">
              {(() => {
                const subtitle = homeData.main_subtitle;
                const words = subtitle.split(" ");

                // Mettre en valeur les 3 premiers mots
                if (words.length > 3) {
                  return (
                    <>
                      <span className="text-[#e1af30] font-medium bg-gradient-to-r from-[#e1af30] to-[#f3c754] bg-clip-text text-transparent">
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
            <motion.p className="text-xl md:text-2xl lg:text-3xl mb-4 md:mb-5 max-w-3xl mx-auto leading-relaxed text-gray-200 font-light">
              Découvrez une{" "}
              <span className="text-[#e1af30] font-medium bg-gradient-to-r from-[#e1af30] to-[#f3c754] bg-clip-text text-transparent">
                expérience de chat unique
              </span>{" "}
              avec nos compagnons virtuels attentionnés, empathiques et toujours
              disponibles pour vous.
            </motion.p>
          )}
          {/* Boutons d'action */}
          <motion.div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12 md:mb-16">
            {/* Premier bouton - CTA principal */}
            <motion.button
              className="relative group bg-[#e1af30] text-black font-semibold text-lg px-4 py-4 md:px-6 md:py-3 rounded-xl md:rounded-2xl hover:shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto"
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <Link to={"/chat"} className="relative z-10">
                Commencer une discussion
              </Link>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#e1af30] to-[#f3c754] rounded-xl md:rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur-md group-hover:blur-lg"
                variants={glowVariants}
                initial="initial"
                animate="animate"
              />
            </motion.button>
          </motion.div>
        </div>

        {/* Description du profil actuel - Position responsive */}
        <motion.div
          className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20 max-w-xs md:max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}>
          <div className="bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 shadow-xl">
            <p className="text-xs md:text-sm text-gray-300 leading-snug">
              {profileCarousel[currentSlide].description}
            </p>
          </div>
        </motion.div>

        {/* Contrôles du carrousel */}
        <div className="absolute bottom-20 md:bottom-32 left-0 right-0 flex justify-center gap-3 md:gap-4 z-20">
          {profileCarousel.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-[#e1af30] scale-125 md:scale-150"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Aller au profil ${index + 1}`}
            />
          ))}
        </div>

        {/* Flèches de navigation améliorées */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md rounded-full p-2 md:p-3 hover:bg-black/60 transition-all group"
          aria-label="Profil précédent">
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-[#e1af30] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md rounded-full p-2 md:p-3 hover:bg-black/60 transition-all group"
          aria-label="Profil suivant">
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-[#e1af30] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Section Statistiques améliorée */}
      {/* <motion.section
        className="py-16 md:py-20 bg-gradient-to-b from-transparent to-[#0a0a0a]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, staggerChildren: 0.1 }}
            viewport={{ once: true }}>
            {[
              { number: "500+", text: "Utilisateurs satisfaits" },
              { number: "24/7", text: "Disponibilité" },
              { number: "98%", text: "Taux de satisfaction" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-black/40 backdrop-blur-lg p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-800/50 hover:border-[#e1af30]/50 transition-all duration-300 group hover:shadow-xl"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}>
                <div className="text-3xl md:text-4xl font-bold text-[#e1af30] mb-2 md:mb-3 group-hover:scale-105 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-base md:text-lg">
                  {stat.text}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section> */}

      <section className="" id="profiles">
        <ProfilesPage />
      </section>

      <Galerie />

      {/* Section Contact */}
      <section
        className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]"
        id="contact">
        <div className="container mx-auto px-6 text-center">
          <Contact />
        </div>
      </section>
    </div>
  );
};

export default Home;
