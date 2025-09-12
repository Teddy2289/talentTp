import React, { useEffect } from "react";
import { securityMonitor } from "../../services/securityMonitor";
import { useSecurity } from "../../contexts/SecurityContext";

interface SimpleSecurityWrapperProps {
  children: React.ReactNode;
}

export const SimpleSecurityWrapper: React.FC<SimpleSecurityWrapperProps> = ({
  children,
}) => {
  const { securitySettings } = useSecurity();

  useEffect(() => {
    // Activer/désactiver la protection contre la sélection de texte
    if (securitySettings.preventTextSelection) {
      securityMonitor.enableTextSelectionDetection(() => {
        // Ne rien afficher, juste empêcher
      });
    } else {
      securityMonitor.disableTextSelectionDetection();
    }

    // Activer/désactiver la protection contre les raccourcis
    if (securitySettings.preventShortcuts) {
      securityMonitor.enableShortcutDetection();
    } else {
      securityMonitor.disableShortcutDetection();
    }

    // Désactiver le menu contextuel
    let contextMenuHandler: ((e: MouseEvent) => void) | null = null;
    if (securitySettings.preventContextMenu) {
      contextMenuHandler = (e: MouseEvent) => e.preventDefault();
      document.addEventListener("contextmenu", contextMenuHandler);
    }

    return () => {
      // Nettoyage
      securityMonitor.disableTextSelectionDetection();
      securityMonitor.disableShortcutDetection();
      if (contextMenuHandler) {
        document.removeEventListener("contextmenu", contextMenuHandler);
      }
    };
  }, [
    securitySettings.preventTextSelection,
    securitySettings.preventShortcuts,
    securitySettings.preventContextMenu,
  ]);

  // Pour DevTools, on utilise une approche différente
  useEffect(() => {
    let devToolsCheck: NodeJS.Timeout | null = null;

    if (securitySettings.preventDevTools) {
      const checkDevTools = () => {
        if (securityMonitor.detectDevTools()) {
          // Recharger silencieusement sans afficher de message
          window.location.reload();
        }
      };

      // Démarrer après un délai
      devToolsCheck = setInterval(checkDevTools, 3000);
    }

    return () => {
      if (devToolsCheck) {
        clearInterval(devToolsCheck);
      }
    };
  }, [securitySettings.preventDevTools]);

  return <>{children}</>;
};
