// services/fingerprintService.ts
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export interface BrowserDetails {
  fingerprint: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  plugins: string;
}

class FingerprintService {
  private fpPromise: Promise<any>;

  constructor() {
    this.fpPromise = FingerprintJS.load();
  }

  async getFingerprint(): Promise<BrowserDetails> {
    try {
      const fp = await this.fpPromise;
      const result = await fp.get();

      return {
        fingerprint: result.visitorId,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        plugins: this.getPluginsString(),
      };
    } catch (error) {
      console.error("Error getting fingerprint:", error);
      throw error;
    }
  }

  private getPluginsString(): string {
    return Array.from(navigator.plugins)
      .map((plugin) => plugin.name)
      .join(", ");
  }

  // Détection basique des outils de développement
  detectDevTools(): boolean {
    // Méthode 1: Différence de taille fenêtre interne/externe
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    // Méthode 2: Détection par le temps d'exécution de code debuggé
    let isDevToolsOpen = false;
    const start = performance.now();
    debugger;
    const end = performance.now();

    if (end - start > 100) {
      isDevToolsOpen = true;
    }

    return widthThreshold || heightThreshold || isDevToolsOpen;
  }
}

export const fingerprintService = new FingerprintService();
