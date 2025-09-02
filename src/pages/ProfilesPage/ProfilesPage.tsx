import React, { useState } from "react";
import { motion } from "framer-motion";

// Données des profils
const profilesData = [
  {
    id: 1,
    name: "Julie",
    personality: "Romantique et attentionnée",
    description:
      "J'adore les conversations profondes et les moments tendres. Je suis là pour vous écouter et vous offrir du réconfort.",
    age: "28 ans",
    interests: ["Romance", "Littérature", "Musique douce", "Promenades"],
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    online: true,
    popularity: 92,
  },
  {
    id: 2,
    name: "Léa",
    personality: "Coquine et directe",
    description:
      "J'aime les conversations énergiques et pleines de surprises. Préparez-vous à des échanges passionnants !",
    age: "26 ans",
    interests: ["Aventure", "Danse", "Humour", "Nouvelles expériences"],
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    online: true,
    popularity: 88,
  },
  {
    id: 3,
    name: "Sophie",
    personality: "Amicale et joyeuse",
    description:
      "Je suis toujours de bonne humeur et j'adore faire de nouvelles connaissances. Parlons de tout et de rien !",
    age: "25 ans",
    interests: ["Cuisine", "Voyages", "Photographie", "Rencontres"],
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    online: true,
    popularity: 95,
  },
  {
    id: 4,
    name: "Clara",
    personality: "Intellectuelle et curieuse",
    description:
      "J'aime les discussions stimulantes sur une variété de sujets. Explorons ensemble le monde des idées.",
    age: "30 ans",
    interests: ["Philosophie", "Science", "Histoire", "Art"],
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    online: false,
    popularity: 85,
  },
  {
    id: 5,
    name: "Élodie",
    personality: "Artistique et rêveuse",
    description:
      "Je vis dans un monde de créativité et d'imagination. Laissez-moi vous emmener dans mon univers poétique.",
    age: "27 ans",
    interests: ["Peinture", "Poésie", "Cinéma", "Nature"],
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    online: true,
    popularity: 90,
  },
  {
    id: 6,
    name: "Chloé",
    personality: "Sportive et énergique",
    description:
      "Le mouvement c'est la vie ! Je suis toujours partante pour de nouvelles activités et défis.",
    age: "29 ans",
    interests: ["Sport", "Aventure", "Nutrition", "Plein air"],
    image:
      "https://images.unsplash.com/photo-1519764622345-23439dd774f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    online: false,
    popularity: 87,
  },
];

// Variantes d'animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const ProfilesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les profils selon la catégorie et la recherche
  const filteredProfiles = profilesData.filter((profile) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "online" && profile.online) ||
      (selectedCategory === "popular" && profile.popularity > 90);
    const matchesSearch =
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.personality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white py-12">
      <div className="container mx-auto px-6 lg:px-16 xl:px-24">
        {/* En-tête élégant */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            Rencontrez nos{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e1af30] to-[#f3c754] font-medium">
              compagnons
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e1af30] to-[#6b21a8] mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos compagnons virtuels et trouvez celui qui correspond le
            mieux à vos attentes. Chacun a sa propre personnalité et ses centres
            d'intérêt.
          </p>
        </motion.div>

        {/* Filtres et recherche - Design épuré */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}>
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-5 py-2.5 rounded-full transition-all text-sm ${
                selectedCategory === "all"
                  ? "bg-[#e1af30] text-black font-medium"
                  : "bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm"
              }`}
              onClick={() => setSelectedCategory("all")}>
              Tous
            </button>
            <button
              className={`px-5 py-2.5 rounded-full transition-all flex items-center gap-2 text-sm ${
                selectedCategory === "online"
                  ? "bg-green-600/90 text-white font-medium"
                  : "bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm"
              }`}
              onClick={() => setSelectedCategory("online")}>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              En ligne
            </button>
            <button
              className={`px-5 py-2.5 rounded-full transition-all text-sm ${
                selectedCategory === "popular"
                  ? "bg-[#6b21a8] text-white font-medium"
                  : "bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm"
              }`}
              onClick={() => setSelectedCategory("popular")}>
              Populaires
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher un compagnon..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e1af30]/50 focus:border-transparent backdrop-blur-sm placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Grille des profils - Design élégant */}
        {filteredProfiles.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            {filteredProfiles.map((profile) => (
              <motion.div
                key={profile.id}
                className="bg-gradient-to-b from-gray-900/70 to-gray-900/40 rounded-2xl overflow-hidden shadow-xl border border-gray-800/30 hover:border-[#e1af30]/40 transition-all duration-300 flex flex-col backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                {/* Image de profil avec overlay élégant */}
                <div className="relative overflow-hidden">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-72 object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70"></div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        profile.online
                          ? "bg-green-600/90 text-white"
                          : "bg-gray-700/80 text-gray-300"
                      }`}>
                      {profile.online ? "En ligne" : "Hors ligne"}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <svg
                      className="w-4 h-4 text-[#e1af30] mr-1.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">{profile.popularity}%</span>
                  </div>

                  <div className="absolute bottom-4 right-4 text-sm text-gray-300">
                    {profile.age}
                  </div>
                </div>

                {/* Informations du profil - Design minimaliste */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-light mb-1">{profile.name}</h3>
                    <p className="text-[#e1af30] font-medium">
                      {profile.personality}
                    </p>
                  </div>

                  <p className="text-gray-300 mb-5 flex-1 leading-relaxed">
                    {profile.description}
                  </p>

                  <div className="mb-5">
                    <h4 className="text-sm font-medium text-gray-400 mb-2.5">
                      Centres d'intérêt
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-800/50 rounded-full text-xs backdrop-blur-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="mt-auto w-full bg-gradient-to-r from-[#e1af30] to-[#f3c754] hover:from-[#f3c754] hover:to-[#e1af30] text-black font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">
                    <svg
                      className="w-5 h-5 transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Discuter avec {profile.name}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-6 backdrop-blur-sm">
              <svg
                className="w-10 h-10 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              Aucun compagnon trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilesPage;
