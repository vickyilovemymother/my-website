import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";
import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/RGBELoader.js";

export class EnvironmentManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
  }

  async loadHDR(path) {
    const loader = new RGBELoader();
    const texture = await loader.loadAsync(path);

    texture.mapping = THREE.EquirectangularReflectionMapping;

    this.sceneManager.scene.environment = texture;
    this.sceneManager.scene.background = texture;
  }
}
