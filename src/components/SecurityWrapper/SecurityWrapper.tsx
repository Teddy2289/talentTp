// components/SecurityWrapper/SecurityWrapper.tsx (ajoutez temporairement)
import React, { useEffect, useState } from "react";
import { useSecurityDetection } from "../../hooks/useSecurityDetection";
import { ScreenshotOverlay } from "../ScreenshotOverlay/ScreenshotOverlay";
import "./SecurityWrapper.css";

interface SecurityWrapperProps {
  children: React.ReactNode;
  securityEnabled?: boolean;
  watermarkText?: string;
}

export const SecurityWrapper: React.FC<SecurityWrapperProps> = ({
  children,
  securityEnabled = true,
  watermarkText = "Confidentiel - Ne pas partager",
}) => {
  const [violationDetected, setViolationDetected] = useState(false);
  const { screenshotDetected, devToolsDetected } =
    useSecurityDetection(securityEnabled);

  // DEBUG: Afficher l'état de la protection
  useEffect(() => {
    console.log("SecurityWrapper mounted - securityEnabled:", securityEnabled);
    console.log("Current path:", window.location.pathname);
  }, [securityEnabled]);

  useEffect(() => {
    if (devToolsDetected && securityEnabled) {
      console.log("DevTools detected on path:", window.location.pathname);
      setViolationDetected(true);
    }
  }, [devToolsDetected, securityEnabled]);

  if (violationDetected) {
    return (
      <div className="security-violation">
        <h1>Violation de sécurité détectée</h1>
        <p>L'utilisation des outils de développement n'est pas autorisée.</p>
        <button onClick={() => window.location.reload()}>
          Recharger l'application
        </button>
      </div>
    );
  }

  return (
    <>
      <ScreenshotOverlay
        visible={screenshotDetected}
        text={`Capture détectée - ${watermarkText}`}
      />
      {children}
    </>
  );
};
