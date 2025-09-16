// ComponenteParametrage/Accueil.tsx
import React from "react";
import { useHomeSettings } from "../../../../hooks/useHomeSettings";
import HomeSettingsForm from "../../../../components/Ui/forms/HomeSettingsForm";

const Accueil: React.FC = () => {
  const {
    settings,
    loading,
    error,
    saveSettings,
    addSlide,
    updateSlide,
    removeSlide,
    updateHero,
    handleImageUpload,
  } = useHomeSettings();

  // Loader
  if (loading && !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#e1af30] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow-sm">
        <p className="font-semibold">❌ Erreur :</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // Aucun paramètre
  if (!settings) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md shadow-sm">
        <p className="font-semibold">⚠️ Aucun paramètre trouvé</p>
      </div>
    );
  }

  // Formulaire principal
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <HomeSettingsForm
        settings={{
          ...settings,
          main_title: settings.main_title ?? "",
        }}
        onSave={saveSettings}
        onHandleImageUpload={handleImageUpload}
        onAddSlide={addSlide}
        onUpdateSlide={updateSlide}
        onRemoveSlide={removeSlide}
        onUpdateHero={updateHero}
        loading={loading}
      />
    </div>
  );
};

export default Accueil;
