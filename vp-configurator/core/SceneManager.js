import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/controls/OrbitControls.js";

export class SceneManager {
  constructor() {
    this.container = document.getElementById("vp-canvas");

    this.scene = new three.Scene();

    this.camera = new three.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.5, 4);

    this.renderer = new three.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputColorSpace = three.SRGBColorSpace;
    this.renderer.toneMapping = three.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    window.addEventListener("resize", () => this.onResize());
  }

  add(object) {
    this.scene.add(object);
  }

  remove(object) {
    this.scene.remove(object);
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
