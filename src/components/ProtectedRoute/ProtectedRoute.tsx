import React from "react";
import { SecurityWrapper } from "../SecurityWrapper/SecurityWrapper";
import type { ProtectedRouteProps } from "../../types/security";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  // Ici, vous pouvez ajouter votre logique d'authentification
  const isAuthenticated = true; // Remplacer par votre logique réelle

  if (requireAuth && !isAuthenticated) {
    // Rediriger vers la page de connexion
    return <div>Redirection vers la page de connexion...</div>;
  }

  return (
    <SecurityWrapper securityEnabled={requireAuth}>{children}</SecurityWrapper>
  );
};
