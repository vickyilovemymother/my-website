import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class SceneManager {
  constructor() {

    this.container = document.getElementById("vp-canvas");

    if (!this.container) {
      throw new Error("❌ vp-canvas container not found in HTML.");
    }

    /* =============================
       SCENE
    ============================== */
    this.scene = new THREE.Scene();

    /* =============================
       CAMERA
    ============================== */
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 1.5, 4);

    /* =============================
       RENDERER
    ============================== */
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // required for transparent export
      preserveDrawingBuffer: true // required for image export
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);

    /* =============================
       CONTROLS
    ============================== */
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    /* =============================
       EVENTS
    ============================== */
    window.addEventListener("resize", () => this.onResize());
  }

  /* =============================
     PUBLIC METHODS
  ============================== */

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
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  /* =============================
     EXPORT SUPPORT
  ============================== */

  renderOnce() {
    this.renderer.render(this.scene, this.camera);
  }

  getCanvas() {
    return this.renderer.domElement;
  }

  setBackgroundColor(color) {
    this.scene.background = new THREE.Color(color);
  }

  setHDRIntensity(value) {
    this.renderer.toneMappingExposure = value;
  }
}
