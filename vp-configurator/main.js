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
    console.log("Initializing engine...");

    await environmentManager.loadHDR(
      "/vp-configurator/assets/hdr/hc_vp.hdr"
    );

    await loadMannequin("men");

    sceneManager.start();

    setupFixedCamera();

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
   FIXED CAMERA SETUP
================================= */

function setupFixedCamera() {
  const camera = sceneManager.camera;

  camera.position.set(0, 1.6, 3.5);
  camera.lookAt(0, 1.2, 0);

  console.log("Fixed camera applied");
}

/* ===============================
   MANNEQUIN LOADER
================================= */

async function loadMannequin(gender) {
  try {
    const path =
      gender === "women"
        ? "/vp-configurator/assets/mannequin/women_mannequin.glb"
        : "/vp-configurator/assets/mannequin/men_mannequin.glb";

    if (currentMannequin) {
      sceneManager.scene.remove(currentMannequin);
    }

    const mannequin = await modelLoader.loadModel(path);

    mannequin.position.set(0, 0, 0);
    mannequin.rotation.set(0, 0, 0);
    mannequin.scale.set(1, 1, 1);

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

  if (!items || items.length === 0) {
    console.log(`No items found for ${category}`);
    return;
  }

  items.forEach((name) => {
    const card = document.createElement("div");
    card.className = "garment-card";

    const img = document.createElement("img");
    img.src = `/vp-configurator/assets/${gender}/${category}/${name}.png`;

    img.onerror = () =>
      console.error("Thumbnail missing:", img.src);

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
   GARMENT LOADER
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

    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    model.scale.set(1, 1, 1);

    garments[type] = model;

    sceneManager.add(model);

    console.log("Garment loaded:", type, fileName);
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

  await loadMannequin(normalized);

  // Remove existing garments
  Object.keys(garments).forEach((key) => {
    if (garments[key]) {
      sceneManager.scene.remove(garments[key]);
      garments[key] = null;
    }
  });

  populateSliders(normalized);

  console.log("Switched gender:", normalized);
}

/* ===============================
   GLOBAL EXPORT
================================= */

window.switchGender = switchGender;
window.setMode = setMode;
window.changeColor = changeColor;
