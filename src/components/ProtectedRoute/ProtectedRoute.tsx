import React from "react";
import { Navigate } from "react-router-dom";
import { SecurityWrapper } from "../SecurityWrapper/SecurityWrapper";
import { useAuth } from "../../contexts/AuthContext";
import type { ProtectedRouteProps } from "../../types/security";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Si authentification requise mais utilisateur non connecté
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si rôle spécifique requis mais non correspondant
  if (requireAuth && requiredRole && user && user.type !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si authentification NON requise mais utilisateur connecté
  // NE PAS rediriger automatiquement - laisser l'accès
  if (!requireAuth && user) {
    // L'utilisateur peut accéder à la page même s'il est connecté
    return <>{children}</>;
  }

  return <>{children}</>;
};
