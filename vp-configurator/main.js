import * as THREE from "three";
import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";
import { StateManager } from "./core/StateManager.js";

const sceneManager = new SceneManager();
const environmentManager = new EnvironmentManager(sceneManager);
const modelLoader = new ModelLoader();
const stateManager = new StateManager();

let currentMannequin = null;
let garments = {};
let autoSpin = false;

/* ================= INIT ================= */

async function init() {
  await environmentManager.loadHDR("/vp-configurator/assets/hdr/hc_vp.hdr");

  createGroundShadow();
  await loadMannequin("men");

  sceneManager.start();
}

init();

/* ================= MANNEQUIN ================= */

async function loadMannequin(gender) {
  const path =
    gender === "women"
      ? "/vp-configurator/assets/mannequin/women_mannequin.glb"
      : "/vp-configurator/assets/mannequin/men_mannequin.glb";

  if (currentMannequin) sceneManager.scene.remove(currentMannequin);

  const mannequin = await modelLoader.loadModel(path);

  mannequin.position.set(0, 0, 0);
  sceneManager.add(mannequin);

  currentMannequin = mannequin;
  fitCamera(mannequin);

  stateManager.setGender(gender);
}

/* ================= CAMERA FIT ================= */

function fitCamera(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = sceneManager.camera.fov * (Math.PI / 180);
  let distance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  distance *= 1.6;

  smoothCameraMove(
    new THREE.Vector3(center.x, center.y, distance),
    center
  );
}

/* ================= SMOOTH CAMERA ================= */

function smoothCameraMove(position, target) {
  const startPos = sceneManager.camera.position.clone();
  const startTarget = sceneManager.controls.target.clone();

  let progress = 0;

  function animate() {
    progress += 0.05;

    sceneManager.camera.position.lerpVectors(startPos, position, progress);
    sceneManager.controls.target.lerpVectors(startTarget, target, progress);
    sceneManager.controls.update();

    if (progress < 1) requestAnimationFrame(animate);
  }

  animate();
}

/* ================= CAMERA SHORTCUTS ================= */

window.addEventListener("keydown", (e) => {
  const cam = sceneManager.camera;
  const target = sceneManager.controls.target.clone();
  const dist = cam.position.distanceTo(target);

  switch (e.key) {
    case "2":
      smoothCameraMove(new THREE.Vector3(0, 1.5, dist), target);
      break;
    case "8":
      smoothCameraMove(new THREE.Vector3(0, 1.5, -dist), target);
      break;
    case "4":
      smoothCameraMove(new THREE.Vector3(-dist, 1.5, 0), target);
      break;
    case "6":
      smoothCameraMove(new THREE.Vector3(dist, 1.5, 0), target);
      break;
    case "5":
      smoothCameraMove(new THREE.Vector3(0, dist, 0), target);
      break;
    case "0":
      smoothCameraMove(new THREE.Vector3(0, -dist, 0), target);
      break;
  }
});

/* ================= GARMENT LOAD + FADE ================= */

async function loadGarment(type, file) {
  const gender = stateManager.getState().gender;
  const path = `/vp-configurator/assets/${gender}/${type}/${file}`;

  if (garments[type]) sceneManager.scene.remove(garments[type]);

  const model = await modelLoader.loadModel(path);

  model.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  garments[type] = model;
  sceneManager.add(model);

  fadeIn(model);
}

function fadeIn(object) {
  let opacity = 0;

  function animate() {
    opacity += 0.05;

    object.traverse((child) => {
      if (child.isMesh) child.material.opacity = opacity;
    });

    if (opacity < 1) requestAnimationFrame(animate);
  }

  animate();
}

/* ================= COLOR ================= */

window.changeColor = function (type, value) {
  if (!garments[type]) return;

  garments[type].traverse((child) => {
    if (child.isMesh) child.material.color.set(value);
  });
};

/* ================= BACKGROUND ================= */

document.getElementById("bgColorPicker")?.addEventListener("input", (e) => {
  sceneManager.renderer.setClearColor(e.target.value);
});

/* ================= HDR INTENSITY (1–10) ================= */

document.getElementById("hdrIntensity")?.addEventListener("input", (e) => {
  const intensity = parseFloat(e.target.value);

  sceneManager.scene.traverse((child) => {
    if (child.isMesh && child.material.envMapIntensity !== undefined) {
      child.material.envMapIntensity = intensity;
    }
  });
});

/* ================= TRANSPARENT EXPORT ================= */

window.exportImage = function () {
  const custom = prompt("Enter resolution (e.g. 3000)", "2048");
  const size = parseInt(custom);

  if (!size) return;

  const renderer = sceneManager.renderer;
  const scene = sceneManager.scene;
  const camera = sceneManager.camera;

  const original = renderer.getSize(new THREE.Vector2());
  const originalAlpha = renderer.getClearAlpha();

  renderer.setClearAlpha(0);
  renderer.setSize(size, size);
  renderer.render(scene, camera);

  const data = renderer.domElement.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = data;
  link.download = "vp_render.png";
  link.click();

  renderer.setSize(original.x, original.y);
  renderer.setClearAlpha(originalAlpha);
};

/* ================= PROFESSIONAL GROUND SHADOW ================= */

function createGroundShadow() {
  const planeGeo = new THREE.PlaneGeometry(20, 20);
  const planeMat = new THREE.ShadowMaterial({ opacity: 0.25 });

  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;

  sceneManager.scene.add(plane);
}

/* ================= AUTO SPIN ================= */

function animateSpin() {
  if (!autoSpin) return;

  sceneManager.camera.position.applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    0.01
  );

  requestAnimationFrame(animateSpin);
}

window.toggleSpin = function () {
  autoSpin = !autoSpin;
  if (autoSpin) animateSpin();
};

/* ================= PRESET SAVE ================= */

window.savePreset = function () {
  const preset = {
    gender: stateManager.getState().gender,
    garments: Object.keys(garments),
  };

  const data = "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(preset));

  const link = document.createElement("a");
  link.href = data;
  link.download = "preset.json";
  link.click();
};

/* ================= PERFORMANCE MODE ================= */

window.togglePerformance = function () {
  sceneManager.renderer.setPixelRatio(1);
};
