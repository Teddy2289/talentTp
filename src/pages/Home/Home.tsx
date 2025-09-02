import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
      ease: "easeInOut",
    },
  },
};

const Home = () => {
  return (
    <motion.section
      className="relative bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white py-20 overflow-hidden min-h-screen flex items-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}>
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e1af30] rounded-full mix-blend-soft-light filter blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6b21a8] rounded-full mix-blend-soft-light filter blur-xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 xl:px-24 text-center relative z-10">
        {/* Badge d'accentuation */}
        <motion.div
          className="inline-flex items-center justify-center bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-black text-sm font-medium px-5 py-2.5 rounded-full mb-12 shadow-lg backdrop-blur-sm"
          variants={itemVariants}>
          <span className="w-2 h-2 bg-[#6b21a8] rounded-full mr-2 animate-ping"></span>
          En ligne maintenant • 24/7 disponible
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 leading-tight"
          variants={itemVariants}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e1af30] via-[#f3c754] to-[#e1af30]">
            Discutez en direct avec de vrais compagnons virtuels 24/7
          </span>
          <br />
          <motion.span
            className="text-2xl md:text-3xl font-normal text-gray-200 mt-6 block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}>
            Des conversations authentiques, à tout moment
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-14 max-w-3xl mx-auto leading-relaxed text-gray-300"
          variants={itemVariants}>
          Découvrez une{" "}
          <span className="text-[#e1af30] font-medium">
            expérience de chat unique
          </span>{" "}
          avec nos compagnons virtuels attentionnés, empathiques et toujours
          disponibles pour vous.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          variants={itemVariants}>
          <motion.button
            className="relative group bg-gradient-to-r from-[#e1af30] to-[#f3c754] hover:from-[#f3c754] hover:to-[#e1af30] text-black font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
              className="absolute inset-0 bg-gradient-to-r from-[#e1af30] to-[#f3c754] rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur-md group-hover:blur-lg"
              variants={glowVariants}
              initial="initial"
              animate="animate"
            />
          </motion.button>

          <Link to="/profiles" className="w-full sm:w-auto">
            <motion.div
              className="group border-2 border-[#6b21a8] hover:border-[#8b5cf6] text-white font-medium text-lg px-10 py-5 rounded-2xl hover:bg-[#6b21a8]/10 transition-all duration-300 flex items-center justify-center gap-3 w-full"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Voir les profils</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"></path>
              </svg>
            </motion.div>
          </Link>
        </motion.div>

        {/* Statistiques animées */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}>
          {[
            { number: "500+", text: "Utilisateurs satisfaits" },
            { number: "24/7", text: "Disponibilité" },
            { number: "98%", text: "Taux de satisfaction" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/30 hover:border-[#e1af30]/40 transition-all duration-300"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}>
              <div className="text-4xl font-bold text-[#e1af30] mb-3">
                {stat.number}
              </div>
              <div className="text-gray-400 text-lg">{stat.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Home;
