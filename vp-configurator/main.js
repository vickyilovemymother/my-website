import * as THREE from "three";
import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";
import { StateManager } from "./core/StateManager.js";

/* =====================================================
   GLOBALS
===================================================== */

let sceneManager;
let environmentManager;
let modelLoader;
let stateManager;

let currentMannequin = null;

let garments = {
  top: null,
  bottom: null,
  jacket: null,
  dress: null
};

const garmentConfig = {
  men: {
    top: ["top01", "top02"],
    bottom: ["btm01"],
    jacket: [],
    dress: []
  },
  women: {
    top: ["top01"],
    bottom: ["btm01"],
    jacket: [],
    dress: []
  }
};

/* =====================================================
   SAFE DOM INIT
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

  sceneManager = new SceneManager();
  environmentManager = new EnvironmentManager(sceneManager);
  modelLoader = new ModelLoader();
  stateManager = new StateManager();

  await init();

});

/* =====================================================
   INIT ENGINE
===================================================== */

async function init() {
  try {

    await environmentManager.loadHDR(
      "/vp-configurator/assets/hdr/hc_vp.hdr"
    );

    await loadMannequin("men");

    sceneManager.start();

    populateSliders("men");
    setMode("mix");

    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) loadingScreen.style.display = "none";

    setupCameraShortcuts();

    console.log("Engine initialized successfully");

  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

/* =====================================================
   MANNEQUIN LOADER + AUTO CAMERA FIT
===================================================== */

async function loadMannequin(gender) {

  const path =
    gender === "women"
      ? "/vp-configurator/assets/mannequin/women_mannequin.glb"
      : "/vp-configurator/assets/mannequin/men_mannequin.glb";

  if (currentMannequin) {
    sceneManager.scene.remove(currentMannequin);
  }

  const mannequin = await modelLoader.loadModel(path);

  sceneManager.add(mannequin);
  currentMannequin = mannequin;

  stateManager.setGender(gender);

  fitCameraToObject(mannequin);

  console.log("Loaded mannequin:", gender);
}

/* =====================================================
   CAMERA AUTO FIT (PRO LEVEL)
===================================================== */

function fitCameraToObject(object) {

  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = sceneManager.camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  cameraZ *= 1.4;

  sceneManager.camera.position.set(center.x, center.y, cameraZ);
  sceneManager.camera.lookAt(center);

  sceneManager.controls.target.copy(center);
  sceneManager.controls.update();
}

/* =====================================================
   CAMERA SHORTCUTS
===================================================== */

function setupCameraShortcuts() {

  document.addEventListener("keydown", (e) => {

    if (!currentMannequin) return;

    const box = new THREE.Box3().setFromObject(currentMannequin);
    const center = box.getCenter(new THREE.Vector3());
    const distance = 4;

    switch (e.key) {
      case "2": // Front
        sceneManager.camera.position.set(center.x, center.y, distance);
        break;

      case "8": // Back
        sceneManager.camera.position.set(center.x, center.y, -distance);
        break;

      case "4": // Left
        sceneManager.camera.position.set(center.x - distance, center.y, 0);
        break;

      case "6": // Right
        sceneManager.camera.position.set(center.x + distance, center.y, 0);
        break;

      case "5": // Top
        sceneManager.camera.position.set(center.x, center.y + distance, 0);
        break;

      case "0": // Bottom
        sceneManager.camera.position.set(center.x, center.y - distance, 0);
        break;
    }

    sceneManager.camera.lookAt(center);
    sceneManager.controls.target.copy(center);
    sceneManager.controls.update();

  });
}

/* =====================================================
   POPULATE SLIDERS
===================================================== */

function populateSliders(gender) {

  const config = garmentConfig[gender];

  Object.keys(config).forEach(category => {
    populateCategory(category, config[category], gender);
  });

}

function populateCategory(category, items, gender) {

  const slider = document.getElementById(category + "-slider");
  if (!slider) return;

  slider.innerHTML = "";

  items.forEach(name => {

    const card = document.createElement("div");
    card.className = "garment-card";

    const img = document.createElement("img");
    img.src = `/vp-configurator/assets/${gender}/${category}/${name}.png`;

    card.appendChild(img);

    card.onclick = async () => {

      document
        .querySelectorAll(`#${category}-slider .garment-card`)
        .forEach(c => c.classList.remove("active"));

      card.classList.add("active");

      await loadGarment(category, name + ".glb");
    };

    slider.appendChild(card);

  });
}

/* =====================================================
   GARMENT LOADER + FADE ANIMATION
===================================================== */

async function loadGarment(type, fileName) {

  const gender = stateManager.getState().gender;
  const path = `/vp-configurator/assets/${gender}/${type}/${fileName}`;

  const model = await modelLoader.loadModel(path);

  model.traverse(child => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0;
    }
  });

  if (garments[type]) {
    sceneManager.scene.remove(garments[type]);
  }

  garments[type] = model;
  sceneManager.add(model);

  fadeIn(model);

  console.log("Loaded garment:", type, fileName);
}

function fadeIn(object) {

  let opacity = 0;

  const interval = setInterval(() => {

    opacity += 0.05;

    object.traverse(child => {
      if (child.isMesh) {
        child.material.opacity = opacity;
      }
    });

    if (opacity >= 1) clearInterval(interval);

  }, 20);
}

/* =====================================================
   MODE CONTROL
===================================================== */

function setMode(mode) {

  const mix = document.getElementById("mix-section");
  const dress = document.getElementById("dress-section");

  if (mode === "mix") {
    mix.style.display = "block";
    dress.style.display = "none";
  } else {
    mix.style.display = "none";
    dress.style.display = "block";
  }

  stateManager.setMode(mode);
}

/* =====================================================
   GENDER SWITCH
===================================================== */

async function switchGender(gender) {

  await loadMannequin(gender);

  Object.keys(garments).forEach(key => {
    if (garments[key]) {
      sceneManager.scene.remove(garments[key]);
      garments[key] = null;
    }
  });

  populateSliders(gender);
}

/* =====================================================
   BACKGROUND CONTROL (READY)
===================================================== */

window.setBackgroundColor = (color) => {
  sceneManager.renderer.setClearColor(color);
};

/* =====================================================
   HDR INTENSITY CONTROL (READY)
===================================================== */

window.setHDRIntensity = (value) => {
  sceneManager.scene.environmentIntensity = value;
};

/* =====================================================
   GLOBAL EXPORT
===================================================== */

window.switchGender = switchGender;
window.setMode = setMode;
window.changeColor = (type, value) => {
  if (!garments[type]) return;

  garments[type].traverse(child => {
    if (child.isMesh) {
      child.material.color.set(value);
    }
  });
};
