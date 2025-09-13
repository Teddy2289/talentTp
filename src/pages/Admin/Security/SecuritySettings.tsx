import React, { useState } from "react";
import { useSecurity } from "../../../contexts/SecurityContext";
import "./SecuritySettings.css";
import check from "../../../assets/check-mark.png";
import close from "../../../assets/multiplication.png";

const SecuritySettings: React.FC = () => {
  const { securitySettings, toggleSecuritySetting, setAllSecuritySettings } =
    useSecurity();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setPreset = (preset: "high" | "medium" | "low") => {
    switch (preset) {
      case "high":
        setAllSecuritySettings({
          preventTextSelection: true,
          preventDevTools: true,
          preventContextMenu: true,
          preventShortcuts: true,
        });
        break;
      case "medium":
        setAllSecuritySettings({
          preventTextSelection: true,
          preventDevTools: false,
          preventContextMenu: true,
          preventShortcuts: false,
        });
        break;
      case "low":
        setAllSecuritySettings({
          preventTextSelection: false,
          preventDevTools: false,
          preventContextMenu: false,
          preventShortcuts: false,
        });
        break;
    }
  };

  return (
    <div className="security-settings">
      <div className="security-header">
        <h1>Paramètres de Sécurité</h1>
        <p>Configurez les mesures de sécurité pour votre application</p>
      </div>

      <div className="security-presets">
        <h3>Préréglages</h3>
        <div className="preset-buttons">
          <button
            className={`preset-btn ${
              securitySettings.preventTextSelection &&
              securitySettings.preventDevTools &&
              securitySettings.preventContextMenu &&
              securitySettings.preventShortcuts
                ? "active"
                : ""
            }`}
            onClick={() => setPreset("high")}>
            🔒 Sécurité Maximale
          </button>
          <button
            className={`preset-btn ${
              securitySettings.preventTextSelection &&
              !securitySettings.preventDevTools &&
              securitySettings.preventContextMenu &&
              !securitySettings.preventShortcuts
                ? "active"
                : ""
            }`}
            onClick={() => setPreset("medium")}>
            🛡️ Sécurité Moyenne
          </button>
          <button
            className={`preset-btn ${
              !securitySettings.preventTextSelection &&
              !securitySettings.preventDevTools &&
              !securitySettings.preventContextMenu &&
              !securitySettings.preventShortcuts
                ? "active"
                : ""
            }`}
            onClick={() => setPreset("low")}>
            🔓 Sécurité Minimale
          </button>
        </div>
      </div>

      <div className="security-grid">
        <div className="security-controls">
          <h3>Paramètres individuels</h3>

          <div className="control-item">
            <div className="control-info">
              <h4>Bloquer la sélection de texte</h4>
              <p>
                Empêche les utilisateurs de sélectionner du texte sur le site
              </p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={securitySettings.preventTextSelection}
                onChange={() => toggleSecuritySetting("preventTextSelection")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="control-item">
            <div className="control-info">
              <h4>Détection des DevTools</h4>
              <p>
                Détecte et empêche l'utilisation des outils de développement
              </p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={securitySettings.preventDevTools}
                onChange={() => toggleSecuritySetting("preventDevTools")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="control-item">
            <div className="control-info">
              <h4>Bloquer le clic droit</h4>
              <p>Désactive le menu contextuel (clic droit)</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={securitySettings.preventContextMenu}
                onChange={() => toggleSecuritySetting("preventContextMenu")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="control-item">
            <div className="control-info">
              <h4>Bloquer les raccourcis</h4>
              <p>Empêche les raccourcis clavier (F12, Ctrl+Shift+I, etc.)</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={securitySettings.preventShortcuts}
                onChange={() => toggleSecuritySetting("preventShortcuts")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="security-status">
          <h3>Statut actuel</h3>
          <div className="status-grid">
            <div
              className={`status-item ${
                securitySettings.preventTextSelection ? "active" : "inactive"
              }`}>
              <span className="status-icon">
                {securitySettings.preventTextSelection ? (
                  <img src={check} className="w-8 h-8" alt="lock" />
                ) : (
                  <img src={close} className="w-6 h-6" alt="unlock" />
                )}
              </span>
              <span>Sélection de texte bloquée</span>
            </div>
            <div
              className={`status-item ${
                securitySettings.preventDevTools ? "active" : "inactive"
              }`}>
              <span className="status-icon">
                {securitySettings.preventDevTools ? (
                  <img src={check} className="w-8 h-8" alt="lock" />
                ) : (
                  <img src={close} className="w-6 h-6" alt="unlock" />
                )}
              </span>
              <span>DevTools détectés</span>
            </div>
            <div
              className={`status-item ${
                securitySettings.preventContextMenu ? "active" : "inactive"
              }`}>
              <span className="status-icon">
                {securitySettings.preventContextMenu ? (
                  <img src={check} className="w-8 h-8" alt="lock" />
                ) : (
                  <img src={close} className="w-6 h-6" alt="unlock" />
                )}
              </span>
              <span>Clic droit bloqué</span>
            </div>
            <div
              className={`status-item ${
                securitySettings.preventShortcuts ? "active" : "inactive"
              }`}>
              <span className="status-icon">
                {securitySettings.preventShortcuts ? (
                  <img src={check} className="w-8 h-8" alt="lock" />
                ) : (
                  <img src={close} className="w-6 h-6" alt="unlock" />
                )}
              </span>
              <span>Raccourcis bloqués</span>
            </div>
          </div>
        </div>
      </div>

      <div className="security-actions">
        <button className="save-btn" onClick={handleSave}>
          {saved ? "✅ Sauvegardé" : "💾 Sauvegarder les paramètres"}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
