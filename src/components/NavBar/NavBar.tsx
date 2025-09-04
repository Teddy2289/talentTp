import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coeur from "../../assets/coeur.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      setIsScrolled(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    if (location.pathname === "/" && path.startsWith("/#")) {
      const sectionId = path.replace("/#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (path.startsWith("/#")) {
      navigate("/");
      setTimeout(() => {
        const sectionId = path.replace("/#", "");
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Stocker le type d'utilisateur avant la déconnexion
      const userType = user?.type;

      await logout();
      setIsProfileDropdownOpen(false);

      // Rediriger en fonction du type d'utilisateur
      if (userType === "Admin") {
        navigate("/login");
      } else {
        navigate("/"); // Redirection vers la page d'accueil publique
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const menuItems = [
    { name: "Accueil", path: "/#home" },
    { name: "Profils", path: "/#profiles" },
    { name: "Galerie", path: "/#gallery" },
    { name: "À propos", path: "/apropos" },
    { name: "Contact", path: "/#contact" },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/30 py-3"
          : "bg-transparent py-5"
      }`}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}>
      <div className="container px-8 lg:px-16 xl:px-24 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <div
              onClick={() => handleNavigation("/")}
              className="flex items-center gap-3 cursor-pointer">
              <div className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center">
                <div className="w-8 h-8">
                  <img src={coeur} alt="Logo" className="w-10 h-10" />
                </div>
              </div>
              <span className="text-white font-bold text-2xl hidden sm:block logo-font">
                Nathie<span className="text-[#e1af30]"> Rose</span>
              </span>
            </div>
          </motion.div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-10 mx-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                className="relative"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}>
                <div
                  onClick={() => handleNavigation(item.path)}
                  className={`text-md font-normal transition-all duration-300 relative group cursor-pointer ${
                    location.pathname === item.path
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}>
                  {item.name}
                  <span
                    className={`absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-[#e1af30] to-[#f3c754] rounded-full transition-all duration-300 group-hover:w-full ${
                      location.pathname === item.path ? "w-full" : ""
                    }`}></span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Boutons d'authentification Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl px-4 py-2 text-white hover:bg-gray-700/60 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#e1af30] to-[#f3c754] flex items-center justify-center text-sm font-bold">
                    {user.first_name?.charAt(0)}
                    {user.last_name?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{user.first_name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>

                {/* Dropdown Profile */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-gray-700/30 rounded-xl shadow-lg overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}>
                      <div className="p-4 border-b border-gray-700/30">
                        <p className="text-white font-medium text-sm">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-2">
                        {user.type === "admin" && (
                          <button
                            onClick={() => handleNavigation("/admin/dashboard")}
                            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                            🛠️ Administration
                          </button>
                        )}
                        <button
                          onClick={() => handleNavigation("/profile")}
                          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                          👤 Mon profil
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors">
                          🚪 Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.button
                  onClick={() => handleNavigation("/login")}
                  className="px-6 py-2.5 text-white font-medium rounded-xl border border-gray-600 hover:border-gray-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  Connexion
                </motion.button>
                <motion.button
                  onClick={() => handleNavigation("/register")}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 8px 20px -5px rgba(225, 175, 48, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}>
                  Inscription
                </motion.button>
              </>
            )}
          </div>

          {/* Menu Mobile Burger */}
          <motion.button
            className="md:hidden flex flex-col gap-1.5 w-10 h-10 justify-center items-center p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Menu mobile">
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
              className="md:hidden absolute top-full left-0 w-full bg-gray-900/98 backdrop-blur-xl border-t border-gray-700/30 mt-2 rounded-b-2xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}>
              <div className="px-8 py-8 space-y-6">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}>
                    <div
                      onClick={() => handleNavigation(item.path)}
                      className={`block py-3 text-lg font-medium transition-all duration-200 border-l-2 pl-4 cursor-pointer ${
                        location.pathname === item.path
                          ? "text-white border-[#e1af30] bg-gray-800/50 rounded-r-xl"
                          : "text-gray-300 border-transparent hover:text-white hover:border-gray-500"
                      }`}>
                      {item.name}
                    </div>
                  </motion.div>
                ))}

                {/* Section authentification mobile */}
                <div className="pt-6 border-t border-gray-700/30 space-y-4">
                  {user ? (
                    <>
                      <div className="text-center text-gray-400 text-sm">
                        Connecté en tant que {user.email}
                      </div>
                      {user.type === "admin" && (
                        <button
                          onClick={() => handleNavigation("/admin/dashboard")}
                          className="w-full bg-gray-800 text-white font-medium px-6 py-3 rounded-xl border border-gray-700">
                          🛠️ Administration
                        </button>
                      )}
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full bg-gray-800 text-white font-medium px-6 py-3 rounded-xl border border-gray-700">
                        👤 Mon profil
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-900/20 text-red-400 font-medium px-6 py-3 rounded-xl border border-red-700/30">
                        🚪 Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigation("/login")}
                        className="w-full bg-gray-800 text-white font-medium px-6 py-3 rounded-xl border border-gray-700">
                        🔐 Connexion
                      </button>
                      <button
                        onClick={() => handleNavigation("/register")}
                        className="w-full bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 font-semibold px-6 py-3.5 rounded-xl shadow-lg">
                        ✨ Créer un compte
                      </button>
                    </>
                  )}
                </div>

                {/* Bouton chat pour tous les utilisateurs */}
                <div className="pt-4 border-t border-gray-700/30">
                  <motion.button
                    className="w-full bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 font-semibold px-6 py-3.5 rounded-xl shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 8px 20px -5px rgba(225, 175, 48, 0.4)",
                    }}
                    onClick={() => handleNavigation("/chat")}>
                    💬 Commencer à discuter
                  </motion.button>
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
