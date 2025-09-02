class DevToolsDetector {
  private isOpen = false;
  private callbacks: Array<(isOpen: boolean) => void> = [];

  constructor() {
    this.initDetection();
  }

  private initDetection() {
    // Méthode 1: Différence de taille fenêtre/navigateur
    const checkWindowSize = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        this.setDevToolsStatus(true);
      }
    };

    // Méthode 2: Détection basée sur le débogage
    const checkDebugger = () => {
      const start = Date.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = Date.now();

      if (end - start > 100) {
        this.setDevToolsStatus(true);
      }
    };

    // Vérifications périodiques
    setInterval(checkWindowSize, 1000);
    setInterval(checkDebugger, 5000);

    // Détection de l'ouverture par raccourci clavier
    window.addEventListener("keydown", (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        this.setDevToolsStatus(true);
        return false;
      }
    });
  }

  private setDevToolsStatus(status: boolean) {
    if (this.isOpen !== status) {
      this.isOpen = status;
      this.callbacks.forEach((callback) => callback(status));
    }
  }

  public onStatusChange(callback: (isOpen: boolean) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  public getStatus() {
    return this.isOpen;
  }
}

export const devToolsDetector = new DevToolsDetector();
