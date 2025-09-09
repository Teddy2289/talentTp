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
    <div className="min-h-screen  text-white p-2">
      <div className="max-w-7xl mx-auto bg-gray-50 p-4">
        <h1 className="text-3xl font-bold mb-8 text-black">Paramétrage</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4 bg-pluto-dark-blue rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-pluto-yellow">
              Sections
            </h2>
            <ul className="space-y-3">
              <li
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeSection === "general"
                    ? "bg-[#e1af30] text-white shadow-md"
                    : "bg-pluto-medium-blue hover:bg-pluto-light-blue"
                }`}
                onClick={() => setActiveSection("general")}>
                <MoveRight className="inline-block mr-2" />
                Général
              </li>
              <li
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeSection === "logo"
                    ? "bg-[#e1af30] text-white shadow-md"
                    : "bg-pluto-medium-blue hover:bg-pluto-light-blue"
                }`}
                onClick={() => setActiveSection("logo")}>
                <MoveRight className="inline-block mr-2" />
                Logo du Site
              </li>
              <li
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeSection === "accueil"
                    ? "bg-[#e1af30] text-white shadow-md"
                    : "bg-pluto-medium-blue hover:bg-pluto-light-blue"
                }`}
                onClick={() => setActiveSection("accueil")}>
                <MoveRight className="inline-block mr-2" />
                Accueil
              </li>
              <li
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeSection === "galerie"
                    ? "bg-[#e1af30] text-white shadow-md"
                    : "bg-pluto-medium-blue hover:bg-pluto-light-blue"
                }`}
                onClick={() => setActiveSection("galerie")}>
                <MoveRight className="inline-block mr-2" />
                Galerie
              </li>
              <li
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeSection === "apropos"
                    ? "bg-[#e1af30] text-white shadow-md"
                    : "bg-pluto-medium-blue hover:bg-pluto-light-blue"
                }`}
                onClick={() => setActiveSection("apropos")}>
                <MoveRight className="inline-block mr-2" />À Propos
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 bg-pluto-dark-blue rounded-xl p-6 shadow-lg">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parametrage;
