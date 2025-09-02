// hooks/useSecurityDetection.ts
import { useState, useEffect } from "react";
import { screenshotBlocker } from "../services/screenshotBlocker";
import { fingerprintService } from "../services/fingerprintService";

export const useSecurityDetection = (isEnabled: boolean) => {
  const [screenshotDetected, setScreenshotDetected] = useState(false);
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [browserDetails, setBrowserDetails] = useState<any>(null);

  useEffect(() => {
    if (isEnabled) {
      // Récupérer l'empreinte du navigateur
      fingerprintService
        .getFingerprint()
        .then((details) => setBrowserDetails(details))
        .catch((error) => console.error("Failed to get fingerprint:", error));

      // Détection des captures d'écran
      const handleScreenshotAttempt = () => {
        setScreenshotDetected(true);
        setTimeout(() => setScreenshotDetected(false), 3000);
      };

      screenshotBlocker.enableProtection(handleScreenshotAttempt);

      // Vérification périodique des outils de développement
      const devToolsCheckInterval = setInterval(() => {
        if (fingerprintService.detectDevTools()) {
          setDevToolsDetected(true);
        }
      }, 1000);

      return () => {
        screenshotBlocker.disableProtection();
        clearInterval(devToolsCheckInterval);
      };
    }
  }, [isEnabled]);

  return { screenshotDetected, devToolsDetected, browserDetails };
};
