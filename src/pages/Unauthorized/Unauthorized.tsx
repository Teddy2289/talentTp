import React from "react";
import { Link } from "react-router-dom";
import unauthorizedImage from "../../assets/unauthorized.png";

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-6xl mb-4">
            <img
              src={unauthorizedImage}
              alt="Unauthorized Access"
              className="mx-auto h-24 w-24"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accès non autorisé
          </h1>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#e1af30] text-white px-6 py-2 rounded-md hover:bg-black transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
