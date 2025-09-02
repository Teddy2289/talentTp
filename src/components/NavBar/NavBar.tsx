import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coeur from "../../assets/coeur.png";
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Accueil", path: "/" },
    { name: "Profils", path: "/profiles" },
    { name: "Tarifs", path: "/pricing" },
    { name: "À propos", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 py-3"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}>
      <div className="container px-6 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <div className="w-10 h-10 rounded-xl  flex items-center justify-center text-black font-bold text-lg">
              <img src={coeur} alt="Logo" className="w-10 h-10" />
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              Compagnons<span className="text-[#e1af30]">VIP</span>
            </span>
          </motion.div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.path}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}>
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#e1af30] to-[#f3c754] transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          {/* Boutons CTA */}
          <div className="hidden md:flex items-center gap-4">
            <motion.a
              href="/login"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}>
              Connexion
            </motion.a>
            <motion.a
              href="/signup"
              className="bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-black font-medium px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-200"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(225, 175, 48, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}>
              S'inscrire
            </motion.a>
          </div>

          {/* Menu Mobile Burger */}
          <motion.button
            className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}>
            <motion.span
              className="w-6 h-0.5 bg-white rounded-full"
              animate={{
                rotate: isMenuOpen ? 45 : 0,
                y: isMenuOpen ? 6 : 0,
              }}
            />
            <motion.span
              className="w-6 h-0.5 bg-white rounded-full"
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-white rounded-full"
              animate={{
                rotate: isMenuOpen ? -45 : 0,
                y: isMenuOpen ? -6 : 0,
              }}
            />
          </motion.button>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-800/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}>
              <div className="px-6 py-6 space-y-4">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.path}
                    className="block text-gray-300 hover:text-white py-2 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </motion.a>
                ))}
                <div className="pt-4 border-t border-gray-800/50 space-y-3">
                  <motion.a
                    href="/login"
                    className="block text-center text-gray-300 hover:text-white py-2 transition-colors duration-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setIsMenuOpen(false)}>
                    Connexion
                  </motion.a>
                  <motion.a
                    href="/signup"
                    className="block bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-black font-medium px-6 py-3 rounded-xl text-center hover:shadow-lg transition-all duration-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => setIsMenuOpen(false)}>
                    S'inscrire
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavBar;
