import React from "react";

interface SecurityViolationProps {
  violationType: string;
  onReload: () => void;
}

export const SecurityViolation: React.FC<SecurityViolationProps> = ({
  violationType,
  onReload,
}) => {
  const getMessage = () => {
    switch (violationType) {
      case "devtools":
        return "L'utilisation des outils de développement n'est pas autorisée.";
      case "text_selection":
        return "La sélection de texte n'est pas autorisée sur cette page.";
      default:
        return "Une violation de sécurité a été détectée.";
    }
  };

  return (
    <div className="security-violation">
      <h1>Violation de sécurité détectée</h1>
      <p>{getMessage()}</p>
      <button onClick={onReload}>Recharger l'application</button>
    </div>
  );
};
