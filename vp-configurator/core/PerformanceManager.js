export class PerformanceManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.lowMode = false;
  }

  toggle() {
    this.lowMode = !this.lowMode;

    if (this.lowMode) {
      this.sceneManager.renderer.setPixelRatio(1);
    } else {
      this.sceneManager.renderer.setPixelRatio(window.devicePixelRatio);
    }
  }
}
