import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
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
import PhotoPage from "./pages/Admin/Photos/Photo";
import CreatePhoto from "./pages/Admin/Photos/CreatePhoto";
import UpdatePhoto from "./pages/Admin/Photos/UpdatePhoto";
import UserCreate from "./pages/Admin/Users/UserCreate";
import UserEdit from "./pages/Admin/Users/UserEdit";
import { AlertProvider } from "./contexts/AlertContext";
import Parametrage from "./pages/Admin/Parametrage/Parametrage";
import Model from "./pages/Admin/Model/Model";
import ModelFormViewWrapper from "./pages/Admin/Model/ModelFormViewWrapper";
import ModelFormView from "./components/Ui/forms/ModelFormView";
import CategoryFormViewWrapper from "./pages/Admin/Categories/CategoryFormViewWrapper";
import AdminCategories from "./pages/Admin/Categories/AdminCategories";
import CategoryFormView from "./components/Ui/forms/CategoryFormView";
import { SecurityWrapper } from "./components/SecurityWrapper/SecurityWrapper";
import SecuritySettings from "./pages/Admin/Security/SecuritySettings";
import { SecurityProvider } from "./contexts/SecurityContext";
import { ConversationProvider } from "./contexts/ConversationContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import PaymentPlansPage from "./pages/Plans/PaymentPlans";
import { SocketProvider } from "./contexts/SocketContext";

const App: React.FC = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <SocketProvider>
          <SecurityProvider>
            <ConversationProvider>
              <PaymentProvider>
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
                          <SecurityWrapper showViolationPage={false}>
                            <FrontLayout>
                              <Home />
                            </FrontLayout>
                          </SecurityWrapper>
                        }
                      />

                      {/* Page d'erreur 403 */}
                      <Route path="/unauthorized" element={<Unauthorized />} />

                      {/* Routes front protégées */}
                      <Route
                        path="/chat"
                        element={
                          <ProtectedRoute requireAuth={true}>
                            {/* <SecurityWrapper showViolationPage={false}> */}
                            <FrontLayout>
                              <ChatPage />
                            </FrontLayout>
                            {/* </SecurityWrapper> */}
                          </ProtectedRoute>
                        }
                      />

                      {/* Nouvelle route pour les plans de paiement */}
                      <Route
                        path="/plans"
                        element={
                          <ProtectedRoute requireAuth={true}>
                            <SecurityWrapper showViolationPage={false}>
                              <FrontLayout>
                                <PaymentPlansPage />
                              </FrontLayout>
                            </SecurityWrapper>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/apropos"
                        element={
                          <FrontLayout>
                            <Apropos />
                          </FrontLayout>
                        }
                      />

                      {/* Routes admin avec vérification de rôle */}
                      <Route
                        path="/admin/*"
                        element={
                          <ProtectedRoute
                            requireAuth={true}
                            requiredRole="Admin">
                            <AdminLayout>
                              <Routes>
                                <Route
                                  path="dashboard"
                                  element={<AdminDashboard />}
                                />
                                {/* Routes de gestion des utilisateurs */}
                                <Route path="users" element={<AdminUsers />} />
                                <Route
                                  path="users/create"
                                  element={<UserCreate />}
                                />
                                <Route
                                  path="users/edit/:id"
                                  element={<UserEdit />}
                                />
                                {/* Model */}
                                <Route path="models" element={<Model />} />
                                <Route
                                  path="models/create"
                                  element={<ModelFormView />}
                                />
                                <Route
                                  path="models/edit/:id"
                                  element={<ModelFormViewWrapper />}
                                />
                                {/* Categorie */}
                                <Route
                                  path="categories"
                                  element={<AdminCategories />}
                                />
                                <Route
                                  path="categories/create"
                                  element={<CategoryFormView />}
                                />
                                <Route
                                  path="categories/edit/:id"
                                  element={<CategoryFormViewWrapper />}
                                />

                                {/* Routes de gestion des photos */}
                                <Route path="photo" element={<PhotoPage />} />
                                <Route
                                  path="photo/create"
                                  element={<CreatePhoto />}
                                />
                                <Route
                                  path="photo/edit/:id"
                                  element={<UpdatePhoto />}
                                />
                                {/* Route de paramétrage */}

                                <Route
                                  path="security"
                                  element={<SecuritySettings />}
                                />

                                <Route
                                  path="parametrage"
                                  element={<Parametrage />}
                                />

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
              </PaymentProvider>
            </ConversationProvider>
          </SecurityProvider>
        </SocketProvider>
      </AuthProvider>
    </AlertProvider>
  );
};
export default App;
