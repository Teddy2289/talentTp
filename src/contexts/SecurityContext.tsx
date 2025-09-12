import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface SecuritySettings {
  preventTextSelection: boolean;
  preventDevTools: boolean;
  preventContextMenu: boolean;
  preventShortcuts: boolean;
}

interface SecurityContextType {
  securitySettings: SecuritySettings;
  toggleSecuritySetting: (setting: keyof SecuritySettings) => void;
  setAllSecuritySettings: (settings: SecuritySettings) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined
);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
  defaultSettings?: Partial<SecuritySettings>;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
  defaultSettings = {},
}) => {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(
    () => {
      // Charger depuis localStorage si disponible
      try {
        const saved = localStorage.getItem("securitySettings");
        if (saved) {
          return {
            preventTextSelection: true,
            preventDevTools: true,
            preventContextMenu: true,
            preventShortcuts: true,
            ...JSON.parse(saved),
          };
        }
      } catch (e) {
        console.error("Error loading security settings:", e);
      }

      return {
        preventTextSelection: true,
        preventDevTools: true,
        preventContextMenu: true,
        preventShortcuts: true,
        ...defaultSettings,
      };
    }
  );

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(
        "securitySettings",
        JSON.stringify(securitySettings)
      );
    } catch (e) {
      console.error("Error saving security settings:", e);
    }
  }, [securitySettings]);

  const toggleSecuritySetting = (setting: keyof SecuritySettings) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const setAllSecuritySettings = (settings: SecuritySettings) => {
    setSecuritySettings(settings);
  };

  return (
    <SecurityContext.Provider
      value={{
        securitySettings,
        toggleSecuritySetting,
        setAllSecuritySettings,
      }}>
      {children}
    </SecurityContext.Provider>
  );
};
