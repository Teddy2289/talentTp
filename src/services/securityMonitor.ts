class SecurityMonitor {
  private textSelectionHandler: (() => void) | null = null;
  private isMonitoringEnabled = false;
  private styleElement: HTMLStyleElement | null = null;

  // Détection de la sélection de texte
  enableTextSelectionDetection(handler: () => void) {
    this.textSelectionHandler = handler;
    this.isMonitoringEnabled = true;

    this.setupTextSelectionDetection();
    this.disableContextMenu();
  }

  disableTextSelectionDetection() {
    this.isMonitoringEnabled = false;
    this.textSelectionHandler = null;

    document.removeEventListener("selectionchange", this.handleSelectionChange);
    document.removeEventListener("mousedown", this.preventTextSelection);
    document.removeEventListener("contextmenu", this.preventContextMenu);

    this.disableTextSelectionStyles();
    this.disableShortcutDetection();

    // Supprimer les styles CSS
    if (this.styleElement && document.head.contains(this.styleElement)) {
      document.head.removeChild(this.styleElement);
    }
  }

  private setupTextSelectionDetection() {
    // Événement pour détecter les changements de sélection
    document.addEventListener("selectionchange", this.handleSelectionChange);

    // Empêcher la sélection de texte
    document.addEventListener("mousedown", this.preventTextSelection);

    // Styles CSS pour empêcher la sélection
    this.disableTextSelectionStyles();
  }

  private disableTextSelectionStyles() {
    // Supprimer l'ancien style s'il existe
    if (this.styleElement && document.head.contains(this.styleElement)) {
      document.head.removeChild(this.styleElement);
    }

    this.styleElement = document.createElement("style");
    this.styleElement.textContent = `
      body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      /* Permettre la sélection sur les inputs et textareas */
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(this.styleElement);
  }

  private disableContextMenu() {
    document.addEventListener("contextmenu", this.preventContextMenu);
  }

  private preventContextMenu = (event: MouseEvent) => {
    if (!this.isMonitoringEnabled) return;
    event.preventDefault();
  };

  private handleSelectionChange = () => {
    if (!this.isMonitoringEnabled || !this.textSelectionHandler) return;

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      // Désélectionner le texte
      selection.removeAllRanges();
      this.textSelectionHandler();
    }
  };

  private preventTextSelection = (event: MouseEvent) => {
    if (!this.isMonitoringEnabled) return;

    // Ne pas empêcher la sélection sur les inputs et textareas
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      return;
    }

    // Empêcher la sélection de texte
    event.preventDefault();
  };

  // Ajoutez cette méthode pour bloquer les raccourcis
  enableShortcutDetection() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  disableShortcutDetection() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    // Bloquer F12
    if (event.key === "F12" || event.keyCode === 123) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Bloquer Ctrl+Shift+I (Chrome/Edge/Firefox)
    if (event.ctrlKey && event.shiftKey && event.key === "I") {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Bloquer Ctrl+Shift+J (Chrome/Edge)
    if (event.ctrlKey && event.shiftKey && event.key === "J") {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Bloquer Ctrl+Shift+C (Chrome/Edge/Firefox - Inspect Element)
    if (event.ctrlKey && event.shiftKey && event.key === "C") {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Bloquer Ctrl+U (View Source)
    if (event.ctrlKey && event.key === "u") {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    // Pour Mac: Cmd+Opt+I, Cmd+Opt+J, Cmd+Opt+C
    if (event.metaKey && event.altKey) {
      if (event.key === "I" || event.key === "J" || event.key === "C") {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }

    return true;
  };

  // Détection des outils de développement - Méthode plus fiable
  detectDevTools(): boolean {
    // Méthode 1: Vérification de la différence de taille fenêtre/écran
    const widthThreshold = 160;
    const heightThreshold = 100;

    if (
      window.outerWidth - window.innerWidth > widthThreshold ||
      window.outerHeight - window.innerHeight > heightThreshold
    ) {
      return true;
    }

    try {
      // Méthode 2: Vérification basée sur le temps de debugger
      // Cette méthode est plus fiable et moins susceptible de faux positifs
      const start = Date.now();
      // Créer un iframe pour un test isolé
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // iframe.contentWindow.eval("debugger");
      document.body.removeChild(iframe);

      return Date.now() - start > 100;
    } catch (e) {
      // Si eval est bloqué (CSP), utiliser une méthode alternative
      const start = Date.now();
      debugger;
      return Date.now() - start > 100;
    }
  }
}

export const securityMonitor = new SecurityMonitor();
