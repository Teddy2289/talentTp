import React from "react";
import { Navigate } from "react-router-dom";
import { SecurityWrapper } from "../SecurityWrapper/SecurityWrapper";
import { useAuth } from "../../contexts/AuthContext";
import type { ProtectedRouteProps } from "../../types/security";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  securityEnabled = true,
}) => {
  const { user, isLoading } = useAuth();

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirection si authentification requise mais utilisateur non connecté
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Vérification des rôles si spécifié
  if (requireAuth && requiredRole && user && user.type !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si l'authentification n'est pas requise et l'utilisateur est connecté,
  // rediriger vers la page d'accueil (éviter l'accès aux pages login/register quand connecté)
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  // Application du wrapper de sécurité si activé
  return securityEnabled ? (
    <SecurityWrapper securityEnabled={true}>{children}</SecurityWrapper>
  ) : (
    <>{children}</>
  );
};
