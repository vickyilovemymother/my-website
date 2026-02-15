import * as THREE from "three";
import { OrbitControls } from "three/examples/controls/OrbitControls.js";

export class SceneManager {
  constructor() {
    this.container = document.getElementById("vp-canvas");

    if (!this.container) {
      throw new Error("vp-canvas container not found.");
    }

    /* =============================
       SCENE
    ============================== */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#000000");

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
      alpha: true,
      preserveDrawingBuffer: true // needed for export
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

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
    this.controls.target.set(0, 1, 0);

    /* =============================
       LIGHT (Basic Fallback Light)
    ============================== */
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    light.castShadow = true;
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambient);

    /* =============================
       RESIZE HANDLER
    ============================== */
    window.addEventListener("resize", () => this.onResize());
  }

  /* =============================
     ADD OBJECT
  ============================== */
  add(object) {
    this.scene.add(object);
  }

  remove(object) {
    this.scene.remove(object);
  }

  /* =============================
     BACKGROUND CONTROL
  ============================== */
  setBackground(color) {
    this.scene.background = new THREE.Color(color);
  }

  /* =============================
     HDR INTENSITY CONTROL
  ============================== */
  setExposure(value) {
    this.renderer.toneMappingExposure = value;
  }

  /* =============================
     AUTO FIT CAMERA TO OBJECT
     (Does NOT move object)
  ============================== */
  fitCameraToObject(object, offset = 1.3) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= offset;

    this.camera.position.set(center.x, center.y, cameraZ);
    this.controls.target.copy(center);
    this.controls.update();
  }

  /* =============================
     START RENDER LOOP
  ============================== */
  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  /* =============================
     RESIZE
  ============================== */
  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /* =============================
     EXPORT IMAGE
  ============================== */
  exportImage(width, height, transparent = false) {
    const originalSize = new THREE.Vector2();
    this.renderer.getSize(originalSize);

    const originalBackground = this.scene.background;

    if (transparent) {
      this.scene.background = null;
    }

    this.renderer.setSize(width, height);
    this.renderer.render(this.scene, this.camera);

    const dataURL = this.renderer.domElement.toDataURL("image/png");

    this.renderer.setSize(originalSize.x, originalSize.y);
    this.scene.background = originalBackground;

    return dataURL;
  }
}
