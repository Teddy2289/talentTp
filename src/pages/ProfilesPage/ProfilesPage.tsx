import React from "react";
import { motion } from "framer-motion";
import image3 from "../../assets/image2.jpg";

function ProfilesPage() {
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

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.03,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <div
      id="profiles"
      className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-5xl mx-auto bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border border-[#2a2a2a]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}>
        <div className="md:flex">
          {/* Section image - Prend toute la largeur du conteneur */}
          <motion.div
            className="md:w-2/5 relative overflow-hidden"
            variants={imageVariants}
            whileHover="hover">
            <img
              className="w-full h-80 md:h-full object-cover"
              src={image3}
              alt="Nathie"
            />

            {/* Overlay avec effet de cœur */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}>
                <h2 className="text-3xl font-semibold text-white mb-2">
                  Nathie
                </h2>
                {/* <p className="text-[#e1af30]">Créatrice de contenu inspirant</p> */}

                {/* Icône cœur animée */}
                <motion.div
                  className="mt-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto text-[#e1af30]"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Section informations */}
          <div className="md:w-3/5 p-8 md:p-10">
            <motion.div
              className="space-y-5 text-gray-300"
              variants={containerVariants}>
              <motion.div
                className="flex items-start group"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}>
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center border border-[#2a2a2a] group-hover:border-[#e1af30] transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#e1af30]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <strong className="text-[#e1af30]">Prénom :</strong> Nathie
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}>
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center border border-[#2a2a2a] group-hover:border-[#e1af30] transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#e1af30]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <strong className="text-[#e1af30]">Nationalité :</strong>{" "}
                  malgache, vit en France
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}>
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center border border-[#2a2a2a] group-hover:border-[#e1af30] transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#e1af30]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <strong className="text-[#e1af30]">Âge :</strong> 22 ans
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}>
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center border border-[#2a2a2a] group-hover:border-[#e1af30] transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#e1af30]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <strong className="text-[#e1af30]">Passe-temps :</strong> se
                  promener seule en ville avec ses écouteurs, boire du thé en
                  silence, faire du yoga doux
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}>
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center border border-[#2a2a2a] group-hover:border-[#e1af30] transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#e1af30]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <strong className="text-[#e1af30]">Localisation :</strong>{" "}
                  Lyon
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}>
                <div className="flex-shrink-0 mr-4 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#0f0f0f] flex items-center justify-center border border-[#2a2a2a] group-hover:border-[#e1af30] transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#e1af30]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <strong className="text-[#e1af30]">Profession :</strong>{" "}
                  Créatrice de contenu inspirant
                </div>
              </motion.div>
            </motion.div>

            {/* Citation avec animation */}
            <motion.div
              className="mt-10 pt-8 border-t border-[#333]"
              variants={itemVariants}>
              <motion.p
                className="text-[#e1af30] text-center italic text-lg"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}>
                "Chaque jour est une nouvelle page à écrire avec passion et
                inspiration"
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProfilesPage;
