import React from "react";
import type { HomeSettings, Slide } from "../../../services/settingsService";

interface HomeSettingsFormProps {
  settings: HomeSettings;
  onSave: (
    settings: HomeSettings
  ) => Promise<{ success: boolean; error?: string }>;
  onAddSlide: (slide: Omit<Slide, "order">) => void;
  onUpdateSlide: (index: number, updates: Partial<Slide>) => void;
  onRemoveSlide: (index: number) => void;
  onUpdateHero: (updates: Partial<HomeSettings>) => void;
  loading?: boolean;
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
  loading = false,
}) => {
  const [localSlides, setLocalSlides] = React.useState<SlideWithId[]>([]);

  // Convertir les slides avec des IDs pour la gestion interne
  React.useEffect(() => {
    setLocalSlides(
      settings.slides.map((slide, index) => ({
        ...slide,
        id: index + 1,
      }))
    );
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
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        const index = localSlides.findIndex((slide) => slide.id === id);
        if (index !== -1) {
          onUpdateSlide(index, { image: imageData });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSlide = () => {
    onAddSlide({
      image: "",
      title: "",
      subtitle: "",
      is_active: true,
    });
  };

  const handleRemoveSlide = (id: number) => {
    const index = localSlides.findIndex((slide) => slide.id === id);
    if (index !== -1) {
      onRemoveSlide(index);
    }
  };

  const handleSaveAll = async () => {
    const result = await onSave(settings);
    if (result.success) {
      alert("Paramètres sauvegardés avec succès!");
    } else {
      alert(`Erreur: ${result.error}`);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-[#e1af30]">Section Hero</h2>

      {/* Section Hero */}
      <section className="mb-10 bg-pluto-dark-blue p-3 rounded-xl shadow-lg">
        <h2 className="text-md font-semibold mb-6 text-pluto-yellow border-b border-pluto-light-blue pb-2">
          Section Hero
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Titre principal
            </label>
            <input
              type="text"
              value={settings.main_title}
              onChange={(e) => handleHeroChange("main_title", e.target.value)}
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sous-titre</label>
            <input
              type="text"
              value={settings.main_subtitle}
              onChange={(e) =>
                handleHeroChange("main_subtitle", e.target.value)
              }
              className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.show_social_in_hero}
              onChange={(e) =>
                handleHeroChange("show_social_in_hero", e.target.checked)
              }
              className="h-5 w-5 rounded bg-pluto-medium-blue border-pluto-light-blue text-pluto-orange focus:ring-pluto-orange"
            />
            <span>Afficher les réseaux sociaux dans le Hero</span>
          </label>
        </div>
      </section>

      {/* Slides du bandeau */}
      <section className="bg-pluto-dark-blue p-6 rounded-xl shadow-lg">
        <h2 className="text-md font-semibold mb-6 text-pluto-yellow border-b border-pluto-light-blue pb-2">
          Slides du bandeau
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pluto-light-blue">
                <th className="pb-3 text-left">Image</th>
                <th className="pb-3 text-left">Titre de la slide</th>
                <th className="pb-3 text-left">Sous-titre</th>
                <th className="pb-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localSlides.map((slide) => (
                <tr
                  key={slide.id}
                  className="border-b border-pluto-medium-blue">
                  <td className="py-4">
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium mb-2">
                        Choisir un fichier
                      </label>
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor={`file-upload-${slide.id}`}
                          className="px-4 py-2 bg-[#e1af30] hover:bg-opacity-90 text-white font-semibold rounded-lg cursor-pointer transition-all duration-200 shadow-md text-sm">
                          Parcourir
                        </label>
                        <input
                          type="file"
                          id={`file-upload-${slide.id}`}
                          className="hidden"
                          onChange={(e) => handleFileChange(slide.id, e)}
                          accept="image/*"
                        />
                        <span className="text-sm truncate max-w-xs">
                          {slide.image
                            ? "Fichier sélectionné"
                            : "Aucun fichier choisi"}
                        </span>
                      </div>
                      {slide.image && (
                        <div className="mt-2 w-20 h-20 border border-pluto-light-blue rounded overflow-hidden">
                          <img
                            src={slide.image}
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
                      value={slide.title}
                      onChange={(e) =>
                        handleSlideChange(slide.id, "title", e.target.value)
                      }
                      placeholder="Titre de la slide"
                      className="w-full p-2 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
                    />
                  </td>
                  <td className="py-4">
                    <input
                      type="text"
                      value={slide.subtitle}
                      onChange={(e) =>
                        handleSlideChange(slide.id, "subtitle", e.target.value)
                      }
                      placeholder="Sous-titre"
                      className="w-full p-2 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange"
                    />
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => handleRemoveSlide(slide.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 text-sm"
                      disabled={localSlides.length <= 1}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleAddSlide}
            className="px-4 py-2 bg-pluto-medium-blue hover:bg-pluto-light-blue text-white font-semibold rounded-lg transition-all duration-200 flex items-center">
            <span className="mr-2">+</span>
            Ajouter Slide
          </button>

          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="px-6 py-3 bg-[#e1af30] hover:bg-opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md disabled:opacity-50">
            {loading ? "Sauvegarde..." : "Sauvegarder tous les paramètres"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeSettingsForm;
