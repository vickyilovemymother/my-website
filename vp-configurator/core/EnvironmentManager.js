import * as THREE from "three";
import { RGBELoader } from "three/examples/loaders/RGBELoader.js";

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
