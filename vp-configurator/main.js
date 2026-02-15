import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";
import { StateManager } from "./core/StateManager.js";

const loadingScreen = document.getElementById("loading-screen");

const sceneManager = new SceneManager();
const environmentManager = new EnvironmentManager(sceneManager);
const modelLoader = new ModelLoader();
const stateManager = new StateManager();

let currentGarments = {
  top: null,
  bottom: null
};

async function init() {
  try {
    await environmentManager.loadHDR(
      "/vp-configurator/assets/hdr/hc_vp.hdr"
    );

    await loadMannequin("Men"); // start with Men

    sceneManager.start();
    loadingScreen.style.display = "none";

    populateGarments();

  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

/* ===========================
   MANNEQUIN LOADING
=========================== */

async function loadMannequin(gender) {
  try {
    const state = stateManager.getState();

    if (state.mannequin) {
      sceneManager.remove(state.mannequin);
    }

    // IMPORTANT — adjust this if your file names differ
    const path = `/vp-configurator/assets/mannequin/${gender}_Mannequin.glb`;

    const mannequin = await modelLoader.loadModel(path);

    sceneManager.add(mannequin);
    stateManager.setMannequin(mannequin);

    console.log("Loaded mannequin:", gender);

  } catch (err) {
    console.error("Mannequin load failed:", err);
  }
}

/* ===========================
   GARMENT BUTTONS
=========================== */

function populateGarments() {
  const topContainer = document.getElementById("top-container");
  const bottomContainer = document.getElementById("bottom-container");

  if (!topContainer || !bottomContainer) {
    console.warn("Containers missing.");
    return;
  }

  topContainer.innerHTML = "";
  bottomContainer.innerHTML = "";

  const tops = ["top01.glb", "top02.glb"];
  const bottoms = ["btm01.glb"];

  const gender = stateManager.getState().gender || "Men";
  const basePath = `/vp-configurator/assets/${gender.toLowerCase()}`;

  tops.forEach(file => {
    const btn = document.createElement("button");
    btn.innerText = file.replace(".glb", "");
    btn.onclick = () =>
      loadGarment("top", `${basePath}/top/${file}`);
    topContainer.appendChild(btn);
  });

  bottoms.forEach(file => {
    const btn = document.createElement("button");
    btn.innerText = file.replace(".glb", "");
    btn.onclick = () =>
      loadGarment("bottom", `${basePath}/bottom/${file}`);
    bottomContainer.appendChild(btn);
  });
}

/* ===========================
   GARMENT LOADER
=========================== */

async function loadGarment(type, path) {
  try {
    if (currentGarments[type]) {
      sceneManager.remove(currentGarments[type]);
    }

    const model = await modelLoader.loadModel(path);
    sceneManager.add(model);
    currentGarments[type] = model;

    console.log("Loaded:", path);

  } catch (err) {
    console.error("Garment failed:", path);
  }
}

/* ===========================
   UI GLOBAL FUNCTIONS
=========================== */

window.switchGender = async function (gender) {
  stateManager.setGender(gender);
  await loadMannequin(gender);
  populateGarments();
};

window.setMode = function (mode) {
  stateManager.setMode(mode);
  console.log("Mode:", mode);
};

window.changeColor = function (type, value) {
  if (!currentGarments[type]) return;

  currentGarments[type].traverse(child => {
    if (child.isMesh) {
      child.material.color.set(value);
    }
  });
};

init();
