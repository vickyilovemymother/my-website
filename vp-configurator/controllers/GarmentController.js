export class GarmentController {
  constructor(sceneManager, modelLoader, stateManager) {
    this.sceneManager = sceneManager;
    this.modelLoader = modelLoader;
    this.stateManager = stateManager;
    this.items = {};
  }

  async load(type, fileName) {
    const gender = this.stateManager.getGender();

    const path = `/vp-configurator/assets/${gender}/${type}/${fileName}`;

    const model = await this.modelLoader.load(path);

    if (this.items[type]) {
      this.sceneManager.remove(this.items[type]);
    }

    model.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 0;
      }
    });

    this.sceneManager.add(model);
    this.items[type] = model;

    this.fadeIn(model);
  }

  fadeIn(object) {
    let opacity = 0;

    const animate = () => {
      opacity += 0.05;

      object.traverse((child) => {
        if (child.isMesh) {
          child.material.opacity = opacity;
        }
      });

      if (opacity < 1) requestAnimationFrame(animate);
    };

    animate();
  }
}
