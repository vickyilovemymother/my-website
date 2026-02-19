import * as THREE from "three";

export class CameraManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.camera = sceneManager.camera;
    this.controls = sceneManager.controls;

    this.target = new THREE.Vector3(0, 1.2, 0);
    this.isSpinning = false;
    this.spinSpeed = 0.01;

    this.initShortcuts();
  }

  fitToObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);

    let distance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    distance *= 1.6;

    this.smoothMove(center.x, center.y, distance);
  }

  smoothMove(x, y, z) {
    const start = this.camera.position.clone();
    const end = new THREE.Vector3(x, y, z);
    let progress = 0;

    const animate = () => {
      progress += 0.05;
      this.camera.position.lerpVectors(start, end, progress);
      this.camera.lookAt(this.target);

      if (progress < 1) requestAnimationFrame(animate);
    };

    animate();
  }

  moveView(key) {
    const dist = this.camera.position.length();

    switch (key) {
      case "2": this.smoothMove(0, 1.2, dist); break;
      case "8": this.smoothMove(0, 1.2, -dist); break;
      case "4": this.smoothMove(-dist, 1.2, 0); break;
      case "6": this.smoothMove(dist, 1.2, 0); break;
      case "5": this.smoothMove(0, dist, 0); break;
      case "0": this.smoothMove(0, -dist, 0); break;
    }
  }

  toggleSpin() {
    this.isSpinning = !this.isSpinning;
  }

  update() {
    if (this.isSpinning) {
      this.sceneManager.scene.rotation.y += this.spinSpeed;
    }
  }

  initShortcuts() {
    window.addEventListener("keydown", (e) => {
      this.moveView(e.key);
    });
  }
}
