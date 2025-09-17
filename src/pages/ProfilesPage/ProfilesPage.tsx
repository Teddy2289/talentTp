import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  Calendar,
  Globe,
  Palette,
  Home,
  User,
  Cake,
  Camera,
  Plane,
  ChefHat,
  MessageCircle,
  AlertCircle,
  Loader2,
  Clock,
  MessagesSquare,
} from "lucide-react";

// Données par défaut pour éviter les erreurs
const defaultProfileData = {
  about: {
    model: {
      id: 0,
      prenom: "Prénom",
      age: 0,
      nationalite: "Nationalité",
      passe_temps: "Passe-temps",
      citation: "Citation par défaut",
      domicile: "Domicile",
      photo: "/default-avatar.jpg",
      localisation: "Localisation",
      created_at: "",
      updated_at: "",
    },
    about_title: "À propos de moi",
    custom_content: "Contenu personnalisé",
  },
};

function ProfilesPage() {
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/settings/frontend"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Fusionner les données reçues avec les données par défaut
        if (result.data) {
          setProfileData({
            ...defaultProfileData,
            ...result.data,
            about: {
              ...defaultProfileData.about,
              ...result.data.about,
              model: {
                ...defaultProfileData.about.model,
                ...result.data.about?.model,
              },
            },
          });
        } else {
          setProfileData(defaultProfileData);
        }
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setError("Impossible de charger les données du profil.");
        setProfileData(defaultProfileData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#131313] to-[#0a0a0a] text-white">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#e1af30] border-t-transparent rounded-full mx-auto mb-4">
            <Loader2 className="h-8 w-8 mx-auto mt-3 text-[#e1af30]" />
          </motion.div>
          <p className="text-xl">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#131313] to-[#0a0a0a] text-red-400">
        <div className="text-center p-8 bg-[#1a1a1a]/80 backdrop-blur-lg rounded-2xl border border-red-800/30">
          <AlertCircle className="h-16 w-16 mx-auto mb-4" />
          <p className="text-xl mb-2">Oups !</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const { model } = profileData.about;
  const imageUrl = model.photo.startsWith("http")
    ? model.photo
    : `http://localhost:3000${model.photo}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#131313] to-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#e1af30]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#e1af30]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#e1af30]/20 rounded-full blur-xl animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto relative z-10">
        {/* Header with name and title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e1af30] to-[#f5d67b] mb-4">
            {model.prenom}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Découvrez mon univers et connectons-nous pour une expérience unique
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card - Left Side */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="bg-[#1a1a1a]/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#2a2a2a]/50 shadow-2xl h-full">
              <div className="relative">
                <motion.div
                  className="h-80 overflow-hidden relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}>
                  <img
                    className="w-full h-full object-cover"
                    src={imageUrl}
                    alt={model.prenom}
                    onError={(e) => {
                      e.target.src =
                        "https://w7.pngwing.com/pngs/282/86/png-transparent-girl-lady-user-woman-famous-character-flat-icon.png";
                    }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute top-6 right-6 w-14 h-14 rounded-full bg-[#e1af30]/10 backdrop-blur-md border border-[#e1af30]/30 flex items-center justify-center"
                    animate={floatingAnimation}>
                    <Heart className="h-6 w-6 text-[#e1af30]" fill="#e1af30" />
                  </motion.div>
                </motion.div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {model.prenom}
                  </h2>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-[#e1af30] mr-2" />
                    <span className="text-gray-300">{model.localisation}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <motion.div
                  className="bg-gradient-to-r from-[#e1af30]/10 to-[#e1af30]/5 p-4 rounded-xl border border-[#e1af30]/20 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}>
                  <p className="text-[#e1af30] text-center italic">
                    "{model.citation}"
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Content - Right Side */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="bg-[#1a1a1a]/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#2a2a2a]/50 shadow-2xl h-full p-6">
              {/* Tab Navigation */}
              <div className="flex space-x-2 mb-8 border-b border-[#2a2a2a] pb-4">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === "info"
                      ? "bg-[#e1af30] text-gray-900"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  Informations
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === "about"
                      ? "bg-[#e1af30] text-gray-900"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  À propos
                </button>
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === "preferences"
                      ? "bg-[#e1af30] text-gray-900"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  Préférences
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "info" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <User className="h-6 w-6" />,
                      label: "Prénom",
                      value: model.prenom,
                    },
                    {
                      icon: <Cake className="h-6 w-6" />,
                      label: "Âge",
                      value: model.age ? `${model.age} ans` : "Non spécifié",
                    },
                    {
                      icon: <Globe className="h-6 w-6" />,
                      label: "Nationalité",
                      value: model.nationalite,
                    },
                    {
                      icon: <Palette className="h-6 w-6" />,
                      label: "Passe-temps",
                      value: model.passe_temps,
                    },
                    {
                      icon: <MapPin className="h-6 w-6" />,
                      label: "Localisation",
                      value: model.localisation,
                    },
                    {
                      icon: <Home className="h-6 w-6" />,
                      label: "Domicile",
                      value: model.domicile,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-[#0f0f0f]/50 p-4 rounded-xl border border-[#2a2a2a] group hover:border-[#e1af30]/30 transition-all"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{
                        y: -5,
                        transition: { type: "spring", stiffness: 300 },
                      }}>
                      <div className="flex items-center">
                        <div className="p-2 bg-[#e1af30]/10 rounded-lg mr-3 text-[#e1af30]">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            {item.label}
                          </div>
                          <div className="text-white font-medium">
                            {item.value}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "about" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}>
                  <h3 className="text-2xl font-bold text-[#e1af30] mb-4">
                    Qui suis-je ?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Passionnée par la création de connexions authentiques,
                    j'aime partager des moments uniques et des conversations
                    enrichissantes. Mon approche est basée sur l'écoute,
                    l'empathie et le respect mutuel.
                  </p>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0f0f0f]/50 p-4 rounded-xl border border-[#2a2a2a]">
                      <h4 className="text-[#e1af30] font-semibold mb-2 flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        Mes passions
                      </h4>
                      <ul className="text-gray-300 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-[#e1af30] rounded-full mr-2"></span>
                          <div className="flex items-center">
                            <Camera className="h-4 w-4 mr-2" />
                            Photographie artistique
                          </div>
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-[#e1af30] rounded-full mr-2"></span>
                          <div className="flex items-center">
                            <Plane className="h-4 w-4 mr-2" />
                            Voyages et découvertes
                          </div>
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-[#e1af30] rounded-full mr-2"></span>
                          <div className="flex items-center">
                            <ChefHat className="h-4 w-4 mr-2" />
                            Cuisine du monde
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-[#0f0f0f]/50 p-4 rounded-xl border border-[#2a2a2a]">
                      <h4 className="text-[#e1af30] font-semibold mb-2 flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Ce que je recherche
                      </h4>
                      <ul className="text-gray-300 space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-[#e1af30] rounded-full mr-2"></span>
                          Conversations profondes
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-[#e1af30] rounded-full mr-2"></span>
                          Respect et authenticité
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-[#e1af30] rounded-full mr-2"></span>
                          Moments complices
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}>
                  <h3 className="text-2xl font-bold text-[#e1af30] mb-4">
                    Mes préférences
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <MessagesSquare className="h-5 w-5 mr-2" />
                        Types de conversation
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Discussion légère",
                          "Échanges intellectuels",
                          "Partage d'expériences",
                          "Soutien émotionnel",
                        ].map((type, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-full text-sm text-gray-300">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Disponibilités
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                          (day, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg text-center ${
                                idx % 2 === 0
                                  ? "bg-[#e1af30]/10 border border-[#e1af30]/20"
                                  : "bg-[#0f0f0f] border border-[#2a2a2a]"
                              }`}>
                              <div className="font-medium text-white">
                                {day}
                              </div>
                              <div className="text-xs text-gray-400">
                                19h-23h
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating action button */}
        <motion.div
          className="fixed bottom-6 right-6 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}>
          <button className="w-14 h-14 rounded-full bg-gradient-to-r from-[#e1af30] to-[#f3c754] shadow-lg flex items-center justify-center text-gray-900">
            <MessageCircle className="h-6 w-6" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProfilesPage;
