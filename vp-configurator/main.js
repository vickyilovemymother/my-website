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
  bottom: null,
  jacket: null,
  dress: null
};

async function init() {
  await environmentManager.loadHDR(
    "/vp-configurator/assets/hdr/hc_vp.hdr"
  );

  await loadMannequin("men");

  sceneManager.start();
  loadingScreen.style.display = "none";

  populateGarments();
}

async function loadMannequin(gender) {
  if (stateManager.getState().mannequin) {
    sceneManager.remove(stateManager.getState().mannequin);
  }

  const mannequin = await modelLoader.loadModel(
    `/vp-configurator/assets/mannequin/${gender}_mannequin.glb`
  );

  sceneManager.add(mannequin);
  stateManager.setMannequin(mannequin);
}

function populateGarments() {
  const topContainer = document.getElementById("top-container");
  const bottomContainer = document.getElementById("bottom-container");

  if (!topContainer || !bottomContainer) {
    console.warn("Garment containers missing.");
    return;
  }

  topContainer.innerHTML = "";
  bottomContainer.innerHTML = "";

  const tops = ["top01.glb", "top02.glb"];
  const bottoms = ["btm01.glb"];

  const gender = stateManager.getState().gender.toLowerCase();
  const basePath = `/vp-configurator/assets/${gender}`;

  tops.forEach(file => {
    const btn = document.createElement("button");
    btn.innerText = file.replace(".glb", "");
    btn.onclick = () => loadGarment("top", `${basePath}/top/${file}`);
    topContainer.appendChild(btn);
  });

  bottoms.forEach(file => {
    const btn = document.createElement("button");
    btn.innerText = file.replace(".glb", "");
    btn.onclick = () => loadGarment("bottom", `${basePath}/bottom/${file}`);
    bottomContainer.appendChild(btn);
  });
}

async function loadGarment(type, path) {
  if (currentGarments[type]) {
    sceneManager.remove(currentGarments[type]);
  }

  try {
    const model = await modelLoader.loadModel(path);
    sceneManager.add(model);
    currentGarments[type] = model;
  } catch (error) {
    console.error("Failed loading:", path);
  }
}

/* =======================
   GLOBAL UI FUNCTIONS
======================= */

window.switchGender = async function (gender) {
  stateManager.setGender(gender);
  await loadMannequin(gender.toLowerCase());
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
