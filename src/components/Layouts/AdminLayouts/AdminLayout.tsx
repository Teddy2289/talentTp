import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
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
  X,
  Search,
  ChevronDown,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

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
      <div className="flex items-center justify-center h-screen bg-[#0a1929]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a1929] text-white">
      {/* Sidebar pour desktop */}
      <div
        className={`hidden md:flex flex-shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}>
        <div className="flex flex-col w-full bg-[#031026] border-r border-[#1e3a8a]">
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-[#031026] border-b border-[#1e3a8a] cursor-pointer">
            {isSidebarOpen ? (
              <span className="text-white text-xl font-semibold">
                Panneaux d'administration
              </span>
            ) : (
              <span className="text-white text-xl font-semibold">AP</span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="mt-5 px-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center px-4 py-3 text-white hover:bg-[#1e3a8a] rounded-lg group transition-colors duration-200 ease-in-out">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <span className="ml-3 transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-[#031026] shadow-lg border-b border-[#1e3a8a]">
          <button
            onClick={toggleSidebar}
            className="px-4 border-r border-[#1e3a8a] text-gray-300 hover:text-white focus:outline-none transition-colors duration-200 md:hidden">
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center max-w-lg">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-[#1e3a8a] rounded-md leading-5 bg-[#0a1929] placeholder-gray-400 text-white focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-colors duration-200"
                  placeholder="Rechercher"
                  type="search"
                />
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              {/* Profil dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileDropdown}
                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] transition-colors duration-200"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true">
                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={userData.avatar}
                      alt={userData.name}
                    />
                    <span className="hidden md:block ml-2 text-gray-200 text-sm font-medium">
                      {userData.name}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                  </button>
                </div>

                {isProfileDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#031026] border border-[#1e3a8a] ring-1 ring-black ring-opacity-5 focus:outline-none transition-opacity duration-200"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button">
                    <div className="px-4 py-2 border-b border-[#1e3a8a]">
                      <p className="text-sm font-medium text-white">
                        {userData.name}
                      </p>
                      <p className="text-xs text-gray-400">{userData.email}</p>
                      <p className="text-xs text-[#3b82f6] font-medium mt-1">
                        {userData.role}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1e3a8a] hover:text-white transition-colors duration-200"
                      role="menuitem"
                      onClick={closeProfileDropdown}>
                      Mon profil
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1e3a8a] hover:text-white transition-colors duration-200"
                      role="menuitem"
                      onClick={closeProfileDropdown}>
                      Paramètres
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1e3a8a] hover:text-white transition-colors duration-200"
                      role="menuitem">
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-[#0a1929]">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar mobile */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-[#0a1929] bg-opacity-80 transition-opacity duration-300"
            aria-hidden="true"
            onClick={toggleSidebar}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#031026] border-r border-[#1e3a8a] transform transition-transform duration-300 ease-in-out">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={toggleSidebar}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-white text-xl font-semibold">
                  AdminPanel
                </span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-[#1e3a8a] transition-colors duration-200"
                      onClick={toggleSidebar}>
                      <Icon className="mr-4 h-6 w-6" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
