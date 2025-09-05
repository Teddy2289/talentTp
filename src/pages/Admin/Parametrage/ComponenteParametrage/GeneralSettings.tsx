// componentParametrage/GeneralSettings.tsx
import React from "react";

const GeneralSettings: React.FC = () => {
  return (
    <div className="general-settings">
      <h2 className="text-xl font-bold mb-6 text-pluto-yellow">
        Paramètres Généraux
      </h2>

      <div className="space-y-6">
        <div className="form-group">
          <label htmlFor="siteTitle" className="block text-sm font-medium mb-2">
            Titre du Site
          </label>
          <input
            type="text"
            id="siteTitle"
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
            defaultValue="Nathie Rose"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="siteDescription"
            className="block text-sm font-medium mb-2">
            Description du Site
          </label>
          <textarea
            id="siteDescription"
            rows={3}
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
            defaultValue="Créatrice de contenu inspirant! Amoureuse du calme, du thé, du yoga doux, et des balades en ville"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="instagramLink"
            className="block text-sm font-medium mb-2">
            Lien Instagram (pour la page de géoblocage)
          </label>
          <input
            type="url"
            id="instagramLink"
            className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
            defaultValue="https://instagram.com/toncompte"
          />
        </div>

        <button className="px-6 py-3 bg-pluto-orange hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
