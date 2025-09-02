import React, { useEffect, useState } from "react";
import { useDevToolsDetector } from "../../hooks/useDevToolsDetector";
import { useScreenshotProtection } from "../../hooks/useScreenshotProtection";
import "./SecurityWrapper.css";

interface SecurityWrapperProps {
  children: React.ReactNode;
  securityEnabled?: boolean;
}

export const SecurityWrapper: React.FC<SecurityWrapperProps> = ({
  children,
  securityEnabled = true,
}) => {
  const [violationDetected, setViolationDetected] = useState(false);

  const devToolsOpen = useDevToolsDetector(() => {
    if (securityEnabled) {
      setViolationDetected(true);
    }
  });

  useScreenshotProtection(securityEnabled);

  useEffect(() => {
    if (devToolsOpen && securityEnabled) {
      setViolationDetected(true);
    }
  }, [devToolsOpen, securityEnabled]);

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

  return <>{children}</>;
};
