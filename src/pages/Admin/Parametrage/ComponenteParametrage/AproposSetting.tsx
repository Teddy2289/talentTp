import React from "react";
import { useAboutSettings } from "../../../../hooks/useAboutSettings";
import AboutSettingsForm from "../../../../components/Ui/forms/AboutSettingsForm";

const AproposSetting: React.FC = () => {
  const { settings, models, selectedModel, loading, error, saveSettings } =
    useAboutSettings();

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
    <AboutSettingsForm
      settings={settings}
      models={models}
      selectedModel={selectedModel}
      onSave={saveSettings}
      loading={loading}
    />
  );
};

export default AproposSetting;
