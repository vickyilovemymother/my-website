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

    this.camera.position.set(0, 1.4, 4);

    /* ================= RENDERER ================= */
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer.shadowMap.enabled = true;

    this.container.appendChild(this.renderer.domElement);

    /* ================= CONTROLS ================= */
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.controls.enableDamping = true;
    this.controls.target.set(0, 1.2, 0);

    /* ================= LIGHT ================= */
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(5, 10, 5);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    /* ================= GROUND SHADOW ================= */
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    this.ground = new THREE.Mesh(planeGeo, planeMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = 0;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    /* ================= AUTO SPIN ================= */
    this.autoSpin = false;

    window.addEventListener("resize", () => this.onResize());
  }

  add(object) {
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.scene.add(object);
  }

  fitCameraToObject(object) {
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
      this.camera.lookAt(0, 1.2, 0);

      if (progress < 1) requestAnimationFrame(animate);
    };

    animate();
  }

  toggleSpin() {
    this.autoSpin = !this.autoSpin;
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.autoSpin) {
        this.scene.rotation.y += 0.005;
      }

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
