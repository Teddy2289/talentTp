// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import NavBar from "./components/NavBar/NavBar"; // Import de la navbar
import "./App.css";
import Home from "./pages/Home/Home";
import ProfilesPage from "./pages/ProfilesPage/ProfilesPage";
import ChatPage from "./pages/ChatPage/ChatPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        {/* Ajout de la NavBar - elle sera visible sur toutes les pages */}
        <NavBar />

        <Routes>
          {/* Route par défaut */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Route portfolio */}
          <Route
            path="/profiles"
            element={
              <ProtectedRoute>
                <ProfilesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Redirection pour toutes les autres routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
