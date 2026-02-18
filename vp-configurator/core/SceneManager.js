import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class SceneManager {
  constructor() {
    this.container = document.getElementById("vp-canvas");

    if (!this.container) {
      throw new Error("vp-canvas container not found.");
    }

    /* ================= SCENE ================= */
    this.scene = new THREE.Scene();

    /* ================= CAMERA ================= */
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 1.5, 4);

    /* ================= RENDERER ================= */
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true // required for export
    });

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);

    /* ================= CONTROLS ================= */
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;

    /* ================= LIGHT ================= */

    this.keyLight = new THREE.DirectionalLight(0xffffff, 2);
    this.keyLight.position.set(3, 6, 3);
    this.keyLight.castShadow = true;

    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 50;

    this.scene.add(this.keyLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);

    /* ================= GROUND SHADOW ================= */
    this.createGround();

    /* ================= RESIZE ================= */
    window.addEventListener("resize", () => this.onResize());

    /* ================= SPIN SYSTEM ================= */
    this.autoSpin = false;
    this.spinTarget = null;
  }

  /* ================= GROUND ================= */
  createGround() {
    const geo = new THREE.PlaneGeometry(20, 20);
    const mat = new THREE.ShadowMaterial({
      opacity: 0.25
    });

    this.ground = new THREE.Mesh(geo, mat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = 0;
    this.ground.receiveShadow = true;

    this.scene.add(this.ground);
  }

  toggleGround() {
    if (this.ground) {
      this.ground.visible = !this.ground.visible;
    }
  }

  /* ================= ADD OBJECT ================= */
  add(object) {
    object.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.scene.add(object);
  }

  remove(object) {
    this.scene.remove(object);
  }

  /* ================= CAMERA FIT ================= */
  fitCameraToObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);

    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5;

    this.camera.position.set(center.x, center.y * 1.1, cameraZ);
    this.camera.lookAt(center);

    this.controls.target.copy(center);
    this.controls.update();
  }

  /* ================= SMOOTH CAMERA MOVE ================= */
  moveCameraSmooth(x, y, z, lookAt = new THREE.Vector3(0, 1, 0)) {
    const start = this.camera.position.clone();
    const end = new THREE.Vector3(x, y, z);

    let progress = 0;

    const animate = () => {
      progress += 0.05;

      this.camera.position.lerpVectors(start, end, progress);
      this.camera.lookAt(lookAt);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  /* ================= AUTO SPIN ================= */
  enableSpin(target) {
    this.autoSpin = true;
    this.spinTarget = target;
  }

  disableSpin() {
    this.autoSpin = false;
  }

  /* ================= RENDER LOOP ================= */
  start() {
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.autoSpin && this.spinTarget) {
        this.spinTarget.rotation.y += 0.01;
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  /* ================= RESIZE ================= */
  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /* ================= PERFORMANCE MODE ================= */
  setPerformanceMode(enabled) {
    if (enabled) {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
    } else {
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
    }
  }

  /* ================= EXPORT HELPER ================= */
  exportImage(width, height, transparent = false) {
    const originalSize = this.renderer.getSize(new THREE.Vector2());
    const originalClear = this.renderer.getClearColor(new THREE.Color());
    const originalAlpha = this.renderer.getClearAlpha();

    if (transparent) {
      this.renderer.setClearColor(0x000000, 0);
    }

    this.renderer.setSize(width, height);
    this.renderer.render(this.scene, this.camera);

    const dataURL = this.renderer.domElement.toDataURL("image/png");

    this.renderer.setSize(originalSize.x, originalSize.y);
    this.renderer.setClearColor(originalClear, originalAlpha);

    return dataURL;
  }
}
