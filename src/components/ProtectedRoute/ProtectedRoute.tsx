import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { ProtectedRouteProps } from "../../types/security";
import { UserType } from "../../types/userTypes";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Si l'authentification est requise mais l'utilisateur n'est pas connecté
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si l'authentification n'est pas requise mais l'utilisateur est déjà connecté
  if (!requireAuth && user) {
    switch (user.type) {
      case UserType.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case UserType.AGENT:
        return <Navigate to="/agent/dashboard" replace />;
      case UserType.CLIENT:
        return <Navigate to="/" replace />;
      case UserType.USER:
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Vérification des rôles si requis
  if (requireAuth && requiredRole && user) {
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    if (!allowedRoles.includes(user.type)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
