import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { AdminLayout } from "./components/Layouts/AdminLayouts/AdminLayout";
import { FrontLayout } from "./components/Layouts/FrontLayout/FrontLayout";

import Unauthorized from "./pages/Unauthorized/Unauthorized";
import Home from "./pages/Home/Home";
import ChatPage from "./pages/ChatPage/ChatPage";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminUsers from "./pages/Admin/Users/Users";
import Apropos from "./pages/Apropos/Apropos";
import Login from "./pages/Authentification/Login";
import Register from "./pages/Authentification/Register";

import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Routes publiques (non accessibles quand connecté) */}
            <Route
              path="/login"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              }
            />

            {/* Page d'accueil publique */}
            <Route
              path="/"
              element={
                <FrontLayout>
                  <Home />
                </FrontLayout>
              }
            />

            {/* Page d'erreur 403 */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Routes front protégées */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute requireAuth={true}>
                  <FrontLayout>
                    <ChatPage />
                  </FrontLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/apropos"
              element={
                <ProtectedRoute requireAuth={false}>
                  <FrontLayout>
                    <Apropos />
                  </FrontLayout>
                </ProtectedRoute>
              }
            />

            {/* Routes admin avec vérification de rôle */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="Admin">
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route
                        path=""
                        element={<Navigate to="dashboard" replace />}
                      />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Route de fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
