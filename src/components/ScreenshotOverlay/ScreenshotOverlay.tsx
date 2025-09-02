// components/ScreenshotOverlay/ScreenshotOverlay.tsx
import React from "react";
import "./ScreenshotOverlay.css";

interface ScreenshotOverlayProps {
  visible: boolean;
  text?: string;
}

export const ScreenshotOverlay: React.FC<ScreenshotOverlayProps> = ({
  visible,
  text = "Capture d'écran détectée - Contenu protégé",
}) => {
  if (!visible) return null;

  return (
    <div className="screenshot-overlay">
      <div className="screenshot-warning">
        <h2>⚠️ Sécurité</h2>
        <p>{text}</p>
      </div>
    </div>
  );
};
