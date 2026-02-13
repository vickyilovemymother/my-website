import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/DRACOLoader.js";

export class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/vp-configurator/assets/draco/");
    this.loader.setDRACOLoader(dracoLoader);
  }

  async loadModel(path) {
    const gltf = await this.loader.loadAsync(path);
    return gltf.scene;
  }
}
