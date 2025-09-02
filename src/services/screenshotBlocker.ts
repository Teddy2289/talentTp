class ScreenshotBlocker {
  private isBlocking = false;

  public enableProtection() {
    if (this.isBlocking) return;

    this.blockPrintScreen();
    this.blockContextMenu();
    this.blockKeyboardShortcuts();
    this.disableTextSelection();

    this.isBlocking = true;
  }

  public disableProtection() {
    this.isBlocking = false;
  }

  private blockPrintScreen() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Bloquer Impr Écran, F12, et autres raccourcis
    if (
      e.key === "PrintScreen" ||
      e.keyCode === 44 || // PrintScreen
      e.keyCode === 91 || // Cmd (Mac)
      e.keyCode === 92 || // Cmd (Mac)
      (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
      (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
      (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
      (e.ctrlKey && e.keyCode === 83) || // Ctrl+S
      (e.ctrlKey && e.keyCode === 80) // Ctrl+P
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  private blockContextMenu() {
    document.addEventListener("contextmenu", this.handleContextMenu);
  }

  private handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    return false;
  };

  private blockKeyboardShortcuts() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  private disableTextSelection() {
    document.addEventListener("selectstart", this.handleSelectStart);
  }

  private handleSelectStart = (e: Event) => {
    e.preventDefault();
    return false;
  };
}

export const screenshotBlocker = new ScreenshotBlocker();
