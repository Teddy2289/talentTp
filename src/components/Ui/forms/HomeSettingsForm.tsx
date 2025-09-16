import React from "react";
import type { HomeSettings, Slide } from "../../../hooks/useHomeSettings";

interface HomeSettingsFormProps {
  settings: HomeSettings;
  onSave: (
    settings: HomeSettings
  ) => Promise<{ success: boolean; error?: string }>;
  onAddSlide: (slide: Slide) => void;
  onUpdateSlide: (index: number, updates: Partial<Slide>) => void;
  onRemoveSlide: (index: number) => void;
  onUpdateHero: (updates: Partial<HomeSettings>) => void;
  onHandleImageUpload: (index: number, file: File) => void;
  loading?: boolean;
  compressing?: boolean;
}

interface SlideWithId extends Slide {
  id: number;
}

const HomeSettingsForm: React.FC<HomeSettingsFormProps> = ({
  settings,
  onSave,
  onAddSlide,
  onUpdateSlide,
  onRemoveSlide,
  onUpdateHero,
  onHandleImageUpload,
  loading = false,
  compressing = false,
}) => {
  const [localSlides, setLocalSlides] = React.useState<SlideWithId[]>([]);

  React.useEffect(() => {
    const slides = settings.slides || [];
    setLocalSlides(slides.map((slide, index) => ({ ...slide, id: index })));
  }, [settings.slides]);

  const handleHeroChange = (field: keyof HomeSettings, value: any) => {
    onUpdateHero({ [field]: value });
  };

  const handleSlideChange = (id: number, field: keyof Slide, value: string) => {
    const index = localSlides.findIndex((slide) => slide.id === id);
    if (index !== -1) {
      onUpdateSlide(index, { [field]: value });
    }
  };

  const handleFileChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const index = localSlides.findIndex((slide) => slide.id === id);
      if (index !== -1) onHandleImageUpload(index, file);
    }
  };

  const handleAddSlide = () => onAddSlide({ imageUrl: "", altText: "" });
  const handleRemoveSlide = (id: number) => {
    const index = localSlides.findIndex((slide) => slide.id === id);
    if (index !== -1) onRemoveSlide(index);
  };

  const handleSaveAll = async () => {
    const result = await onSave(settings);
    if (result.success) alert("✅ Paramètres sauvegardés avec succès!");
    else alert(`❌ Erreur: ${result.error}`);
  };

  return (
    <div className="space-y-8">
      {/* Section Hero */}
      <section className="">
        <h2 className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-300 pb-2">
          Section Hero
        </h2>

        {compressing && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            Compression des images en cours...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">
              Titre principal
            </label>
            <input
              type="text"
              value={settings.main_title || ""}
              onChange={(e) => handleHeroChange("main_title", e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Titre principal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">
              Sous-titre
            </label>
            <input
              type="text"
              value={settings.main_subtitle || ""}
              onChange={(e) =>
                handleHeroChange("main_subtitle", e.target.value)
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Sous-titre"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-3 text-gray-900">
            <input
              type="checkbox"
              checked={settings.show_social_in_hero || false}
              onChange={(e) =>
                handleHeroChange("show_social_in_hero", e.target.checked)
              }
              className="h-5 w-5 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
            />
            <span>Afficher les réseaux sociaux dans le Hero</span>
          </label>
        </div>
      </section>

      {/* Slides */}
      <section className="bg-white p-6  space-y-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 border-b border-gray-300 pb-2">
          Slides du bandeau
        </h2>

        {(!localSlides || localSlides.length === 0) && (
          <div className="text-center py-6 text-gray-400">
            Aucun slide configuré
          </div>
        )}

        {localSlides.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-gray-900">
                  <th className="py-2 text-left">Image</th>
                  <th className="py-2 text-left">Texte alternatif</th>
                  <th className="py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {localSlides.map((slide) => (
                  <tr key={slide.id} className="border-b border-gray-200">
                    <td className="py-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-900">
                          Choisir un fichier
                        </label>
                        <div className="flex items-center gap-4">
                          <label
                            htmlFor={`file-upload-${slide.id}`}
                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg cursor-pointer transition duration-200 text-sm">
                            Parcourir
                          </label>
                          <input
                            type="file"
                            id={`file-upload-${slide.id}`}
                            className="hidden"
                            onChange={(e) => handleFileChange(slide.id, e)}
                            accept="image/*"
                          />
                          <span className="text-sm truncate max-w-xs text-gray-700">
                            {slide.imageUrl
                              ? "Fichier sélectionné"
                              : "Aucun fichier choisi"}
                          </span>
                        </div>
                        {slide.imageUrl && (
                          <div className="mt-2 w-20 h-20 border border-gray-300 rounded overflow-hidden">
                            <img
                              src={slide.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <input
                        type="text"
                        value={slide.altText || ""}
                        onChange={(e) =>
                          handleSlideChange(slide.id, "altText", e.target.value)
                        }
                        placeholder="Texte alternatif"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
                      />
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleRemoveSlide(slide.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 text-sm disabled:opacity-50"
                        disabled={localSlides.length <= 1}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <button
            onClick={handleAddSlide}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition duration-200 flex items-center">
            <span className="mr-2">+</span>
            Ajouter Slide
          </button>

          <button
            onClick={handleSaveAll}
            disabled={loading || compressing}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition duration-200 shadow-md disabled:opacity-50">
            {compressing
              ? "Compression..."
              : loading
              ? "Sauvegarde..."
              : "Sauvegarder tous les paramètres"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeSettingsForm;
