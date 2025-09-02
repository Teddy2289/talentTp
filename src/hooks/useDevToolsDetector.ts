import { useEffect, useState } from "react";
import { devToolsDetector } from "../services/devToolsDetector";

export const useDevToolsDetector = (onDetected?: () => void) => {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = devToolsDetector.onStatusChange((isOpen) => {
      setDevToolsOpen(isOpen);
      if (isOpen && onDetected) {
        onDetected();
      }
    });

    return unsubscribe;
  }, [onDetected]);

  return devToolsOpen;
};
