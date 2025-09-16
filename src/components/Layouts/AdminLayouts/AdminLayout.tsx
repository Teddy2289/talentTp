import React, { useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
  BookImage,
  ChartNoAxesCombined,
  Clipboard,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UsersRound,
  Menu,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";

import admin from "../../../assets/user-gear.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const toggleProfileDropdown = useCallback(() => {
    setIsProfileDropdownOpen((prev) => !prev);
  }, []);

  const closeProfileDropdown = useCallback(() => {
    setIsProfileDropdownOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  }, [logout]);

  // Données de l'utilisateur connecté
  const userData = useMemo(() => {
    if (!user) return null;

    return {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role:
        user.type === "Admin"
          ? "Administrateur"
          : user.type === "Agent"
          ? "Agent"
          : "Utilisateur",
    };
  }, [user]);

  const navigationItems = useMemo(
    () => [
      { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/admin/categories", icon: Clipboard, label: "Catégories" },
      { to: "/admin/photo", icon: BookImage, label: "Galléries photos" },
      { to: "/admin/users", icon: UsersRound, label: "Utilisateurs" },
      { to: "/admin/models", icon: UsersRound, label: "Model" },
      {
        to: "/admin/statistics",
        icon: ChartNoAxesCombined,
        label: "Statistiques",
      },
      { to: "/admin/security", icon: ShieldCheck, label: "Sécurité" },
      { to: "/admin/parametrage", icon: Settings, label: "Paramètres" },
    ],
    []
  );

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-30 flex flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-20"
        } h-full bg-pluto-deep-blue  shadow-xl`}>
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-gray-600">
            {isSidebarOpen ? (
              <span className="text-white text-xl font-bold tracking-wide flex items-center gap-x-1">
                <img src={admin} className="h-8 w-8" alt="" />
                Administrateur
              </span>
            ) : (
              <img src={admin} className="h-8 w-8" alt="" />
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-indigo-200 hover:text-white hover:bg-[#e1af30] transition-colors duration-200 hidden md:block">
              {isSidebarOpen ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5 transform rotate-180" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center px-3 py-3 rounded-lg group transition-all duration-200 ${
                      isActive
                        ? "bg-white text-[#e1af30] shadow-md"
                        : "text-indigo-100 hover:bg-[#e1af30] hover:text-white"
                    }`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <span className="ml-3 font-medium transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mini profile dans sidebar */}
          {isSidebarOpen && (
            <div className="p-4 border-t border-gray-600">
              <div className="flex items-center">
                {/* <img
                  className="h-10 w-10 rounded-full border-2 border-white"
                  src={userData.avatar}
                  alt={userData.name}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white truncate">
                    {userData.name}
                  </p>
                  <p className="text-xs text-indigo-200 truncate">
                    {userData.role}
                  </p>
                </div> */}
                .
                <p className="text-xs text-indigo-200 mt-3">
                  Tous droits réservés &copy; {new Date().getFullYear()} - MBL
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-md">
          <button
            onClick={toggleSidebar}
            className="px-4 text-gray-600 hover:text-indigo-600 focus:outline-none transition-colors duration-200 md:hidden">
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center max-w-md">
              <div className="relative w-full">
                {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Rechercher..."
                  type="search"
                /> */}
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              {/* Profil dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileDropdown}
                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true">
                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                    <img
                      className="h-8 w-8 rounded-full border-2 border-indigo-300"
                      src={userData.avatar}
                      alt={userData.name}
                    />
                    <span className="hidden md:block ml-2 text-gray-700 text-sm font-medium">
                      {userData.name}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {isProfileDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 bg-white border border-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none transition-opacity duration-200 z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {userData.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData.email}
                      </p>
                      <p className="text-xs text-indigo-600 font-medium mt-1">
                        {userData.role}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
                      role="menuitem"
                      onClick={closeProfileDropdown}>
                      <User className="h-4 w-4 mr-2" />
                      Mon profil
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
                      role="menuitem"
                      onClick={closeProfileDropdown}>
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
                      role="menuitem">
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className=" mx-auto px-4 sm:px-4 md:px-2">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};
