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
let garments = {};



/* ==============================
   INITIALIZE
============================== */

async function init() {
  try {

    await environmentManager.loadHDR(
      "/vp-configurator/assets/hdr/hc_vp.hdr"
    );

    await loadMannequin("men");

    sceneManager.start();

    setMode("mix");

    if (loadingScreen) loadingScreen.style.display = "none";

    console.log("VP Engine Ready");

  } catch (err) {
    console.error("Init error:", err);
  }
}

init();



/* ==============================
   CAMERA FIT (NO MANNEQUIN MOVE)
============================== */

function fitCameraToModel(model) {

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = sceneManager.camera.fov * (Math.PI / 180);

  let distance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  distance *= 1.8;

  sceneManager.camera.position.set(center.x, center.y, distance);
  sceneManager.camera.lookAt(center);

  if (sceneManager.controls) {
    sceneManager.controls.target.copy(center);
    sceneManager.controls.update();
  }

}



/* ==============================
   LOAD MANNEQUIN
============================== */

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

  fitCameraToModel(mannequin);
}



/* ==============================
   CAMERA SHORTCUT SYSTEM
============================== */

window.addEventListener("keydown", (e) => {

  if (!currentMannequin) return;

  const box = new THREE.Box3().setFromObject(currentMannequin);
  const center = box.getCenter(new THREE.Vector3());
  const radius = box.getSize(new THREE.Vector3()).length();

  const distance = radius * 1.5;

  switch (e.key) {

    case "2": // Front
      moveCamera(center.x, center.y, distance, center);
      break;

    case "8": // Back
      moveCamera(center.x, center.y, -distance, center);
      break;

    case "4": // Left
      moveCamera(-distance, center.y, center.z, center);
      break;

    case "6": // Right
      moveCamera(distance, center.y, center.z, center);
      break;

    case "5": // Top
      moveCamera(center.x, distance, center.z, center);
      break;

    case "0": // Bottom
      moveCamera(center.x, -distance, center.z, center);
      break;

  }

});

function moveCamera(x, y, z, target) {

  sceneManager.camera.position.set(x, y, z);
  sceneManager.camera.lookAt(target);

  if (sceneManager.controls) {
    sceneManager.controls.target.copy(target);
    sceneManager.controls.update();
  }

}



/* ==============================
   BACKGROUND CONTROL
============================== */

document.getElementById("bgColorPicker")?.addEventListener("input", (e) => {

  sceneManager.renderer.setClearColor(e.target.value);

});



/* ==============================
   HDR INTENSITY CONTROL
============================== */

document.getElementById("hdrIntensity")?.addEventListener("input", (e) => {

  const value = parseFloat(e.target.value);

  sceneManager.scene.traverse((child) => {
    if (child.isMesh && child.material.envMapIntensity !== undefined) {
      child.material.envMapIntensity = value;
    }
  });

});



/* ==============================
   ADVANCED EXPORT
============================== */

window.exportImage = function () {

  const size = parseInt(
    document.getElementById("resolutionSelect").value
  );

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

};



/* ==============================
   MODE
============================== */

function setMode(mode) {

  const mix = document.getElementById("mix-section");
  const dress = document.getElementById("dress-section");

  if (!mix || !dress) return;

  if (mode === "mix") {
    mix.style.display = "block";
    dress.style.display = "none";
  } else {
    mix.style.display = "none";
    dress.style.display = "block";
  }

}



/* ==============================
   GLOBAL
============================== */

window.switchGender = loadMannequin;
window.setMode = setMode;
