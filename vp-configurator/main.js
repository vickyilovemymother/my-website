import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";
import { StateManager } from "./core/StateManager.js";
import * as THREE from "three";

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

/* ===============================
   GARMENT CONFIG
================================= */

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

/* ===============================
   INIT ENGINE
================================= */

async function init() {
  try {
    console.log("Engine Init Started");

    await environmentManager.loadHDR(
      "/vp-configurator/assets/hdr/hc_vp.hdr"
    );

    await loadMannequin("men");

    sceneManager.start();

    populateSliders("men");
    setMode("mix");

    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }

    console.log("Engine initialized successfully");
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

init();

/* ===============================
   AUTO CENTER MODEL
================================= */

function autoCenterModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  model.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const camera = sceneManager.camera;

  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  cameraZ *= 1.8;

  camera.position.set(0, size.y * 0.4, cameraZ);
  camera.lookAt(0, size.y * 0.4, 0);

  console.log("Model auto-centered");
}

/* ===============================
   LOAD MANNEQUIN
================================= */

async function loadMannequin(gender) {
  try {
    const path =
      gender === "women"
        ? "/vp-configurator/assets/mannequin/women_mannequin.glb"
        : "/vp-configurator/assets/mannequin/men_mannequin.glb";

    console.log("Loading mannequin:", path);

    if (currentMannequin) {
      sceneManager.scene.remove(currentMannequin);
    }

    const mannequin = await modelLoader.loadModel(path);

    autoCenterModel(mannequin);

    sceneManager.add(mannequin);
    currentMannequin = mannequin;

    stateManager.setGender(gender);

    console.log("Loaded mannequin:", gender);
  } catch (error) {
    console.error("Mannequin load failed:", error);
  }
}

/* ===============================
   POPULATE SLIDERS
================================= */

function populateSliders(gender) {
  console.log("Populate sliders for:", gender);

  const config = garmentConfig[gender];

  populateCategory("top", config.top, gender);
  populateCategory("bottom", config.bottom, gender);
  populateCategory("jacket", config.jacket, gender);
  populateCategory("dress", config.dress, gender);
}

function populateCategory(category, items, gender) {
  const slider = document.getElementById(category + "-slider");
  if (!slider) return;

  slider.innerHTML = "";

  if (!items.length) {
    console.log("No items for:", category);
    return;
  }

  items.forEach((name) => {
    const card = document.createElement("div");
    card.className = "garment-card";

    const img = document.createElement("img");
    img.src = `/vp-configurator/assets/${gender}/${category}/${name}.png`;

    console.log("Thumbnail path:", img.src);

    img.onerror = () => {
      console.error("Thumbnail failed:", img.src);
    };

    card.appendChild(img);

    card.onclick = async () => {
      document
        .querySelectorAll(`#${category}-slider .garment-card`)
        .forEach((c) => c.classList.remove("active"));

      card.classList.add("active");

      await loadGarment(category, name + ".glb");
    };

    slider.appendChild(card);
  });
}

/* ===============================
   LOAD GARMENT
================================= */

async function loadGarment(type, fileName) {
  try {
    const gender = stateManager.getState().gender;
    const path = `/vp-configurator/assets/${gender}/${type}/${fileName}`;

    console.log("Loading garment:", path);

    const model = await modelLoader.loadModel(path);

    if (garments[type]) {
      sceneManager.scene.remove(garments[type]);
    }

    garments[type] = model;
    sceneManager.add(model);

    console.log("Loaded garment:", type, fileName);
  } catch (error) {
    console.error("Garment load failed:", error);
  }
}

/* ===============================
   COLOR CHANGE
================================= */

function changeColor(type, value) {
  if (!garments[type]) return;

  garments[type].traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.color.set(value);
    }
  });

  console.log("Color changed:", type, value);
}

/* ===============================
   MODE CONTROL
================================= */

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

  stateManager.setMode(mode);

  console.log("Mode:", mode);
}

/* ===============================
   GENDER SWITCH
================================= */

async function switchGender(gender) {
  const normalized = gender.toLowerCase();

  console.log("Switch gender:", normalized);

  await loadMannequin(normalized);

  // Clear garments
  Object.keys(garments).forEach((key) => {
    if (garments[key]) {
      sceneManager.scene.remove(garments[key]);
      garments[key] = null;
    }
  });

  populateSliders(normalized);
}

/* ===============================
   GLOBAL EXPORT
================================= */

window.switchGender = switchGender;
window.setMode = setMode;
window.changeColor = changeColor;
