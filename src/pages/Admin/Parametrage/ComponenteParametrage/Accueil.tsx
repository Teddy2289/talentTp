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

  if (loading && !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pluto-orange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Erreur:</strong> {error}
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Aucun paramètre trouvé
      </div>
    );
  }

  return (
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
  );
};

export default Accueil;
