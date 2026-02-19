export class ColorController {
  constructor(garmentController) {
    this.garmentController = garmentController;
  }

  change(type, color) {
    const item = this.garmentController.items[type];
    if (!item) return;

    item.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(color);
      }
    });
  }
}
