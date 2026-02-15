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
let currentTop = null;
let currentBottom = null;

/* ===============================
   INITIALIZE ENGINE
================================= */
async function init() {
  try {
    // Load HDR
    await environmentManager.loadHDR(
      "/vp-configurator/assets/hdr/hc_vp.hdr"
    );

    // Load default mannequin
    await loadMannequin("men");

    sceneManager.start();

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
   MANNEQUIN LOADER
================================= */
async function loadMannequin(gender) {
  try {
    const path =
      gender === "women"
        ? "/vp-configurator/assets/mannequin/women_mannequin.glb"
        : "/vp-configurator/assets/mannequin/men_mannequin.glb";

    // Remove old mannequin safely
    if (currentMannequin) {
      sceneManager.scene.remove(currentMannequin);
      currentMannequin = null;
    }

    const mannequin = await modelLoader.loadModel(path);

    sceneManager.add(mannequin);
    currentMannequin = mannequin;

    stateManager.setGender(gender);

    console.log("Loaded mannequin:", gender);
  } catch (error) {
    console.error("Mannequin load failed:", error);
  }
}

/* ===============================
   GARMENT LOADER
================================= */
async function loadGarment(type, fileName) {
  try {
    const gender = stateManager.getState().gender;

    const path = `/vp-configurator/assets/${gender}/${type}/${fileName}`;

    const model = await modelLoader.loadModel(path);

    if (type === "top") {
      if (currentTop) sceneManager.scene.remove(currentTop);
      currentTop = model;
    }

    if (type === "bottom") {
      if (currentBottom) sceneManager.scene.remove(currentBottom);
      currentBottom = model;
    }

    sceneManager.add(model);

    console.log("Loaded garment:", fileName);
  } catch (error) {
    console.error("Garment load failed:", error);
  }
}

/* ===============================
   COLOR HANDLER
================================= */
function changeColor(type, value) {
  let target = null;

  if (type === "top") target = currentTop;
  if (type === "bottom") target = currentBottom;

  if (!target) return;

  target.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(value);
    }
  });

  console.log("Changed color:", type, value);
}

/* ===============================
   MODE
================================= */
function setMode(mode) {
  stateManager.setMode(mode);
  console.log("Mode:", mode);
}

/* ===============================
   GENDER SWITCH
================================= */
function switchGender(gender) {
  const normalized = gender.toLowerCase();
  loadMannequin(normalized);
}

/* ===============================
   GLOBAL UI EXPORT
================================= */
window.switchGender = switchGender;
window.setMode = setMode;
window.changeColor = changeColor;

/* ===============================
   GARMENT BUTTONS (OPTIONAL)
================================= */
window.loadTop01 = () => loadGarment("top", "top01.glb");
window.loadTop02 = () => loadGarment("top", "top02.glb");
window.loadBottom01 = () => loadGarment("bottom", "btm01.glb");
