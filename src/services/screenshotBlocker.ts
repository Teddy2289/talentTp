// services/screenshotBlocker.ts
class ScreenshotBlocker {
  private detectionHandler: (() => void) | null = null;
  private isProtectionEnabled = false;
  private lastKeyPressTime = 0;

  enableProtection(handler: () => void) {
    this.detectionHandler = handler;
    this.isProtectionEnabled = true;

    this.setupKeyboardDetection();
    this.setupContextMenuDetection();
    this.setupBlurDetection();
    this.setupPrintDetection();
  }

  disableProtection() {
    this.isProtectionEnabled = false;
    this.detectionHandler = null;

    window.removeEventListener("keydown", this.handleKeyPress);
    document.removeEventListener("contextmenu", this.handleContextMenu);
    window.removeEventListener("blur", this.handleBlur);
    window.removeEventListener("beforeprint", this.handleBeforePrint);
  }

  private setupKeyboardDetection() {
    window.addEventListener("keydown", this.handleKeyPress);
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (!this.isProtectionEnabled) return;

    // Détection des raccourcis de capture - version améliorée
    const key = event.key.toLowerCase();
    const now = Date.now();

    // Détection Windows + Shift + S (plus fiable)
    if (
      event.shiftKey &&
      event.key === "S" &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
      this.triggerDetection();
      return;
    }

    // Détection Print Screen
    if (key === "printscreen" || event.keyCode === 44) {
      event.preventDefault();
      this.triggerDetection();
      return;
    }

    // Détection macOS: Cmd+Shift+3/4/5
    if (
      event.metaKey &&
      event.shiftKey &&
      (key === "3" || key === "4" || key === "5")
    ) {
      event.preventDefault();
      this.triggerDetection();
      return;
    }

    // Détection combinaisons rapides (pour certains outils)
    if (now - this.lastKeyPressTime < 200) {
      // 200ms entre deux touches
      if ((event.ctrlKey || event.metaKey) && key === "c") {
        this.triggerDetection();
      }
    }

    this.lastKeyPressTime = now;
  };

  private setupPrintDetection() {
    window.addEventListener("beforeprint", this.handleBeforePrint);
  }

  private handleBeforePrint = (event: Event) => {
    if (!this.isProtectionEnabled) return;
    event.preventDefault();
    this.triggerDetection();
  };

  private setupContextMenuDetection() {
    document.addEventListener("contextmenu", this.handleContextMenu);
  }

  private handleContextMenu = (event: MouseEvent) => {
    if (!this.isProtectionEnabled) return;

    event.preventDefault();
    this.triggerDetection();
  };

  private setupBlurDetection() {
    window.addEventListener("blur", this.handleBlur);
  }

  private handleBlur = () => {
    if (!this.isProtectionEnabled) return;

    // Détection quand la fenêtre perd le focus
    setTimeout(() => {
      this.triggerDetection();
    }, 100);
  };

  private triggerDetection() {
    if (this.detectionHandler) {
      this.detectionHandler();
    }
  }
}

export const screenshotBlocker = new ScreenshotBlocker();
