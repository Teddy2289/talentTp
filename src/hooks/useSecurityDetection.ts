import { useState, useEffect, useRef } from "react";
import { securityMonitor } from "../services/securityMonitor";

export const useSecurityDetection = (
  isEnabled: boolean,
  monitorTextSelection: boolean,
  monitorDevTools: boolean
) => {
  const [textSelectionDetected, setTextSelectionDetected] = useState(false);
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const devToolsCheckRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      setTextSelectionDetected(false);
      setDevToolsDetected(false);
      if (devToolsCheckRef.current) {
        clearInterval(devToolsCheckRef.current);
      }
      return;
    }

    // Détection de la sélection de texte
    if (monitorTextSelection) {
      const handleSelection = () => {
        setTextSelectionDetected(true);
        setTimeout(() => setTextSelectionDetected(false), 100);
      };

      securityMonitor.enableTextSelectionDetection(handleSelection);
    } else {
      securityMonitor.disableTextSelectionDetection();
      setTextSelectionDetected(false);
    }

    // Détection des outils de développement
    if (monitorDevTools) {
      const checkDevTools = () => {
        if (securityMonitor.detectDevTools()) {
          setDevToolsDetected(true);
        }
      };

      // Vérifier immédiatement puis périodiquement
      checkDevTools();
      devToolsCheckRef.current = setInterval(checkDevTools, 2000);
    } else {
      setDevToolsDetected(false);
      if (devToolsCheckRef.current) {
        clearInterval(devToolsCheckRef.current);
      }
    }

    return () => {
      if (devToolsCheckRef.current) {
        clearInterval(devToolsCheckRef.current);
      }
    };
  }, [isEnabled, monitorTextSelection, monitorDevTools]);

  return { textSelectionDetected, devToolsDetected };
};
