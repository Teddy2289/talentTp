import React, { useEffect, useState } from "react";
import { useSecurityDetection } from "../../hooks/useSecurityDetection";
import { SecurityViolation } from "../SecurityViolation/SecurityViolation";
import { useSecurity } from "../../contexts/SecurityContext";
import { SimpleSecurityWrapper } from "./SimpleSecurityWrapper";
import "./SecurityWrapper.css";

interface SecurityWrapperProps {
  children: React.ReactNode;
  showViolationPage?: boolean;
}

export const SecurityWrapper: React.FC<SecurityWrapperProps> = ({
  children,
  showViolationPage = true,
}) => {
  const { securitySettings } = useSecurity();
  const [violationDetected, setViolationDetected] = useState(false);
  const [violationType, setViolationType] = useState<string>("");

  const { textSelectionDetected, devToolsDetected } = useSecurityDetection(
    true,
    securitySettings.preventTextSelection,
    securitySettings.preventDevTools
  );

  useEffect(() => {
    if (devToolsDetected && securitySettings.preventDevTools) {
      setViolationType("devtools");
      setViolationDetected(true);

      if (!showViolationPage) {
        window.location.reload();
      }
    }
  }, [devToolsDetected, securitySettings.preventDevTools, showViolationPage]);

  useEffect(() => {
    if (textSelectionDetected && securitySettings.preventTextSelection) {
      setViolationType("text_selection");
      setViolationDetected(true);
    }
  }, [textSelectionDetected, securitySettings.preventTextSelection]);

  if (violationDetected && showViolationPage) {
    return (
      <SecurityViolation
        violationType={violationType}
        onReload={() => window.location.reload()}
      />
    );
  }

  if (violationDetected && !showViolationPage) {
    return null;
  }

  return <SimpleSecurityWrapper>{children}</SimpleSecurityWrapper>;
};
