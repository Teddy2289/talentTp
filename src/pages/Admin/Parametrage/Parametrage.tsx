import React, { useState } from "react";
import GeneralSettings from "./ComponenteParametrage/GeneralSettings";
import SiteLogo from "./ComponenteParametrage/SiteLogo";
import Accueil from "./ComponenteParametrage/Accueil";
import GalerieSetting from "./ComponenteParametrage/GalerieSetting";
import AproposSetting from "./ComponenteParametrage/AproposSetting";
import { MoveRight } from "lucide-react";

const Parametrage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("general");

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSettings />;
      case "logo":
        return <SiteLogo />;
      case "accueil":
        return <Accueil />;
      case "galerie":
        return <GalerieSetting />;
      case "apropos":
        return <AproposSetting />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Titre principal */}
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">
          Paramétrage
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4 bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Sections
            </h2>
            <ul className="space-y-3">
              {[
                { key: "general", label: "Général" },
                // { key: "logo", label: "Logo du Site" },
                { key: "accueil", label: "Accueil" },
                { key: "galerie", label: "Galerie" },
                { key: "apropos", label: "À Propos" },
              ].map((item) => (
                <li
                  key={item.key}
                  className={`p-4 rounded-lg cursor-pointer flex items-center transition-all duration-200 text-sm font-medium
                  ${
                    activeSection === item.key
                      ? "bg-[#e1af30] text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveSection(item.key)}>
                  <MoveRight className="inline-block mr-2 w-4 h-4" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 bg-white rounded-xl p-6 shadow-md border border-gray-200">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parametrage;
