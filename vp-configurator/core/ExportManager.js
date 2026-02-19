import * as THREE from "three";

export class ExportManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
  }

  exportPNG(width, height, transparent = false) {
    const renderer = this.sceneManager.renderer;
    const camera = this.sceneManager.camera;
    const scene = this.sceneManager.scene;

    const originalSize = renderer.getSize(new THREE.Vector2());
    const originalBg = renderer.getClearColor().clone();

    if (transparent) {
      renderer.setClearColor(0x000000, 0);
    }

    renderer.setSize(width, height);
    renderer.render(scene, camera);

    const dataURL = renderer.domElement.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "vp_render.png";
    link.click();

    renderer.setSize(originalSize.x, originalSize.y);
    renderer.setClearColor(originalBg);
  }
}
