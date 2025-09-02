import { useEffect } from "react";
import { screenshotBlocker } from "../services/screenshotBlocker";

export const useScreenshotProtection = (isEnabled: boolean) => {
  useEffect(() => {
    if (isEnabled) {
      screenshotBlocker.enableProtection();
    } else {
      screenshotBlocker.disableProtection();
    }

    return () => {
      screenshotBlocker.disableProtection();
    };
  }, [isEnabled]);
};
