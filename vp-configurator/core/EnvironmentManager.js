import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { RGBELoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/RGBELoader.js";

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
