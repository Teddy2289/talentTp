export interface SecurityConfig {
  disableScreenshots: boolean;
  disableDevTools: boolean;
  disableRightClick: boolean;
  disableKeyboardShortcuts: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  securityEnabled?: boolean;
  securityRules?: SecurityConfig;
  preventTextSelection?: boolean;
  preventDevTools?: boolean;
}
