import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export class EnvironmentManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.hdrTexture = null;
  }

  async loadHDR(path) {
    const loader = new RGBELoader();

    this.hdrTexture = await loader.loadAsync(path);
    this.hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

    this.sceneManager.scene.environment = this.hdrTexture;
  }

  setIntensity(value) {
    this.sceneManager.scene.traverse((child) => {
      if (child.isMesh && child.material.envMapIntensity !== undefined) {
        child.material.envMapIntensity = value;
      }
    });
  }
}
