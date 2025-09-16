import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import Alert, { type AlertType } from "../components/Ui/Alert";

interface AlertContextType {
  showAlert: (type: AlertType, message: string, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
    duration?: number;
  } | null>(null);

  const showAlert = (type: AlertType, message: string, duration?: number) => {
    setAlert({ type, message, duration });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
          duration={alert.duration}
        />
      )}
    </AlertContext.Provider>
  );
};
