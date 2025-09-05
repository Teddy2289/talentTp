// componentParametrage/SiteLogo.tsx
import React, { useState } from "react";

const SiteLogo: React.FC = () => {
  const [fileName, setFileName] = useState("Aucun fichier choisi");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="site-logo">
      <h2 className="text-xl font-bold mb-6 text-[#e1af30]">Logo du Site</h2>

      <div className="space-y-6">
        <div className="file-upload">
          <label
            htmlFor="logoUpload"
            className="block text-sm font-medium mb-2">
            Choisir un fichier
          </label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="logoUpload"
              className="px-4 py-2 bg-pluto-orange hover:bg-opacity-90 text-white font-semibold rounded-lg cursor-pointer transition-all duration-200 shadow-md">
              Parcourir
            </label>
            <input
              type="file"
              id="logoUpload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <span className="text-sm">{fileName}</span>
          </div>
        </div>

        <div className="preview-section">
          <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
          <div className="w-40 h-40 border-2 border-dashed border-pluto-light-blue rounded-lg flex items-center justify-center">
            <p className="text-pluto-light-blue text-sm text-center px-2">
              Aucun logo sélectionné
            </p>
          </div>
        </div>

        <button className="px-6 py-3 bg-pluto-orange hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md">
          Enregistrer le logo
        </button>
      </div>
    </div>
  );
};

export default SiteLogo;
