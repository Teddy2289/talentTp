// components/ModelSelector.tsx
import React from "react";
import { useModels } from "../../hooks/useModels";

interface ModelSelectorProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onChange,
}) => {
  const { models, loading } = useModels();

  if (loading) {
    return <div>Chargement des modèles...</div>;
  }

  return (
    <select
      value={value || ""}
      onChange={(e) =>
        onChange(e.target.value ? parseInt(e.target.value) : undefined)
      }
      className="w-full p-3 rounded-lg bg-pluto-medium-blue border border-pluto-light-blue focus:outline-none focus:ring-2 focus:ring-pluto-orange">
      <option value="">Aucun modèle sélectionné</option>
      {models.map((model) => (
        <option key={model.id} value={model.id}>
          {model.prenom} (ID: {model.id})
        </option>
      ))}
    </select>
  );
};
