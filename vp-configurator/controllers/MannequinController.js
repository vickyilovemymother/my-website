export class MannequinController {
  constructor(sceneManager, modelLoader, stateManager) {
    this.sceneManager = sceneManager;
    this.modelLoader = modelLoader;
    this.stateManager = stateManager;
    this.current = null;
  }

  async load(gender) {
    const path =
      gender === "women"
        ? "/vp-configurator/assets/mannequin/Women_Mannequin.glb"
        : "/vp-configurator/assets/mannequin/Men_Mannequin.glb";

    if (this.current) {
      this.sceneManager.remove(this.current);
    }

    const mannequin = await this.modelLoader.load(path);
    mannequin.position.set(0, 0, 0);

    this.sceneManager.add(mannequin);
    this.sceneManager.fitToObject(mannequin);

    this.current = mannequin;
    this.stateManager.setGender(gender);
  }
}
