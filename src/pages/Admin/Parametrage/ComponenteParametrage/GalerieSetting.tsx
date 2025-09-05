import React, { useState } from "react";

function GalerieSetting() {
  const [titre, setTitre] = useState("Titre de la Galerie");
  const [sousTitre, setSousTitre] = useState(
    "Sous-titre descriptif de la galerie"
  );

  const handleSave = () => {
    // Logique pour sauvegarder les paramètres
    console.log("Paramètres galerie sauvegardés:", { titre, sousTitre });
    alert("Paramètres de la galerie sauvegardés avec succès!");
  };

  return (
    <div className="p-6 bg-pluto-deep-blue text-white min-h-screen">
      <h1 className="text-xl font-bold mb-8 text-[#e1af30]">
        Paramètres de la Galerie
      </h1>

      <div className="bg-pluto-dark-blue p-6 rounded-xl shadow-lg max-w-3xl">
        <h2 className="text-md font-semibold mb-6 text-pluto-yellow border-b border-pluto-light-blue pb-2">
          Configuration de la Galerie
        </h2>

        <div className="space-y-6">
          <div className="form-group">
            <label
              htmlFor="titreGalerie"
              className="block text-sm font-medium mb-2">
              Titre de la Galerie
            </label>
            <input
              type="text"
              id="titreGalerie"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
              placeholder="Entrez le titre de la galerie"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="sousTitreGalerie"
              className="block text-sm font-medium mb-2">
              Sous-titre de la Galerie
            </label>
            <input
              type="text"
              id="sousTitreGalerie"
              value={sousTitre}
              onChange={(e) => setSousTitre(e.target.value)}
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
              placeholder="Entrez le sous-titre de la galerie"
            />
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 bg-[#e1af30] hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md">
            Sauvegarder les paramètres
          </button>
        </div>
      </div>
    </div>
  );
}

export default GalerieSetting;
