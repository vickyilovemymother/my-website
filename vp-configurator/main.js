import * as THREE from "three";
import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";
import { StateManager } from "./core/StateManager.js";

const loadingScreen = document.getElementById("loading-screen");

const sceneManager = new SceneManager();
const environmentManager = new EnvironmentManager(sceneManager);
const modelLoader = new ModelLoader();
const stateManager = new StateManager();

let currentMannequin = null;

let garments = {
  top: null,
  bottom: null,
  jacket: null,
  dress: null
};

/* ================= INIT ================= */

async function init() {
  await environmentManager.loadHDR(
    "/vp-configurator/assets/hdr/hc_vp.hdr"
  );

  await loadMannequin("men");

  sceneManager.start();

  if (loadingScreen) loadingScreen.style.display = "none";
}

init();

/* ================= MANNEQUIN ================= */

async function loadMannequin(gender) {
  const path =
    gender === "women"
      ? "/vp-configurator/assets/mannequin/women_mannequin.glb"
      : "/vp-configurator/assets/mannequin/men_mannequin.glb";

  if (currentMannequin) {
    sceneManager.scene.remove(currentMannequin);
  }

  const mannequin = await modelLoader.loadModel(path);

  mannequin.position.set(0, 0, 0);

  sceneManager.add(mannequin);
  currentMannequin = mannequin;

  stateManager.setGender(gender);
}

/* ================= COLOR ================= */

function changeColor(type, value) {
  if (!garments[type]) return;

  garments[type].traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(value);
    }
  });
}

/* ================= HDR ================= */

document.getElementById("hdrIntensity")?.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);

  sceneManager.scene.traverse((child) => {
    if (child.isMesh && child.material.envMapIntensity !== undefined) {
      child.material.envMapIntensity = value;
    }
  });
});

/* ================= BACKGROUND ================= */

document.getElementById("bgColorPicker")?.addEventListener("input", (e) => {
  sceneManager.renderer.setClearColor(e.target.value);
});

/* ================= EXPORT ================= */

function exportImage() {
  const size = parseInt(document.getElementById("resolutionSelect").value);

  const renderer = sceneManager.renderer;
  const camera = sceneManager.camera;
  const scene = sceneManager.scene;

  const originalSize = renderer.getSize(new THREE.Vector2());

  renderer.setSize(size, size);
  renderer.render(scene, camera);

  const dataURL = renderer.domElement.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "vp_render.png";
  link.click();

  renderer.setSize(originalSize.x, originalSize.y);
}

/* ================= CAMERA SHORTCUTS ================= */

window.addEventListener("keydown", (e) => {
  const distance = 4;

  switch (e.key) {
    case "2": sceneManager.camera.position.set(0, 1.5, distance); break;
    case "8": sceneManager.camera.position.set(0, 1.5, -distance); break;
    case "4": sceneManager.camera.position.set(-distance, 1.5, 0); break;
    case "6": sceneManager.camera.position.set(distance, 1.5, 0); break;
  }

  sceneManager.camera.lookAt(0, 1.2, 0);
});

/* ================= GLOBAL EXPORT ================= */

window.switchGender = loadMannequin;
window.changeColor = changeColor;
window.exportImage = exportImage;
