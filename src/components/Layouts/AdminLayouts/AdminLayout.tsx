import React, { useState } from "react";
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
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Données de l'utilisateur connecté
  const userData = user
    ? {
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
      }
    : null;

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      {/* Sidebar pour desktop */}
      <div
        className={`hidden md:flex md:flex-shrink-0 ${
          isSidebarOpen ? "md:w-64" : "md:w-20"
        } transition-width duration-300`}>
        <div className="flex flex-col w-full bg-[#031026]">
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-[#031026] border-b border-gray-700 cursor-pointer">
            {isSidebarOpen ? (
              <span className="text-white text-xl text-center font-semibold">
                Panneaux d'administration
              </span>
            ) : (
              <span className="text-white text-xl font-semibold">AP</span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="mt-5 px-4 space-y-2">
              <Link
                to="/admin/dashboard"
                className="flex items-center px-4 py-2 text-indigo-100 hover:bg-[#e1af30] rounded-lg group">
                <LayoutDashboard className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center px-4 py-2 text-indigo-100 hover:bg-[#e1af30] rounded-lg group">
                <Clipboard className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Catégories</span>}
              </Link>
              <Link
                to="/admin/photo"
                className="flex items-center px-4 py-2 text-indigo-100 hover:bg-[#e1af30] rounded-lg group">
                <BookImage className="w-5 h-5" />
                {isSidebarOpen && (
                  <span className="ml-3">Galléries photos</span>
                )}
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-2 text-indigo-100 hover:bg-[#e1af30] rounded-lg group">
                <UsersRound className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Utilisateurs</span>}
              </Link>
              <Link
                to="/admin/statistics"
                className="flex items-center px-4 py-2 text-indigo-100 hover:bg-[#e1af30] rounded-lg group">
                <ChartNoAxesCombined className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Statistiques</span>}
              </Link>
              <Link
                to="/admin/security"
                className="flex items-center px-4 py-2 text-indigo-100 hover:bg-[#e1af30] rounded-lg group">
                <ShieldCheck className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Sécurité</span>}
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center px-4 py-2 text-indigo-100 hover:bg-[#e1af30] rounded-lg group">
                <Settings className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-3">Paramètres</span>}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Navbar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={toggleSidebar}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
            <span className="sr-only">Ouvrir la sidebar</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="w-full max-w-lg md:max-w-xs">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Rechercher"
                    type="search"
                  />
                </div>
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              {/* Profil dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileDropdown}
                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true">
                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={userData.avatar}
                      alt={userData.name}
                    />
                    <span className="hidden md:block ml-2 text-gray-700 text-sm font-medium">
                      {userData.name}
                    </span>
                    <svg
                      className="ml-1 h-4 w-4 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>

                {isProfileDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {userData.name}
                      </p>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                      <p className="text-xs text-indigo-600 font-medium mt-1">
                        {userData.role}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileDropdownOpen(false)}>
                      Mon profil
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileDropdownOpen(false)}>
                      Paramètres
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar mobile */}
      {isSidebarOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0" aria-hidden="true">
              <div
                className="absolute inset-0 bg-gray-600 opacity-75"
                onClick={toggleSidebar}></div>
            </div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={toggleSidebar}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Fermer la sidebar</span>
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <span className="text-white text-xl font-semibold">
                    AdminPanel
                  </span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  <Link
                    to="/admin/dashboard"
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white bg-indigo-900"
                    onClick={toggleSidebar}>
                    <svg
                      className="mr-4 h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-indigo-100 hover:bg-[#e1af30]"
                    onClick={toggleSidebar}>
                    <svg
                      className="mr-4 h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Utilisateurs
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-indigo-100 hover:bg-[#e1af30]"
                    onClick={toggleSidebar}>
                    <svg
                      className="mr-4 h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Paramètres
                  </Link>
                </nav>
              </div>
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        </div>
      )}
    </div>
  );
};
