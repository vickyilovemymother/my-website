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

// ================= INIT =================

async function init() {
  await environmentManager.loadHDR(
    "/vp-configurator/assets/hdr/HC_VP.hdr"
  );

  const mannequin = await modelLoader.loadModel(
    "/vp-configurator/assets/mannequin/Men_Mannequin.glb"
  );

  currentMannequin = mannequin;

  sceneManager.add(mannequin);
  stateManager.setMannequin(mannequin);

  sceneManager.start();

  loadingScreen.style.display = "none";
}

init();

// ================= UI FUNCTIONS =================

// Switch Gender
async function switchGender(gender) {
  console.log("Switching to:", gender);

  if (currentMannequin) {
    sceneManager.scene.remove(currentMannequin);
  }

  const path =
    gender === "Women"
      ? "/vp-configurator/assets/mannequin/Women_Mannequin.glb"
      : "/vp-configurator/assets/mannequin/Men_Mannequin.glb";

  const newMannequin = await modelLoader.loadModel(path);

  currentMannequin = newMannequin;

  sceneManager.add(newMannequin);
  stateManager.setMannequin(newMannequin);
  stateManager.setGender(gender);
}

// Set Mode
function setMode(mode) {
  console.log("Mode:", mode);
  stateManager.setMode(mode);
}

// Change Color
function changeColor(type, value) {
  console.log("Change color:", type, value);

  const target = stateManager.getState().mannequin;

  if (!target) return;

  target.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(value);
    }
  });

  stateManager.setColor(type, value);
}

// ================= EXPOSE TO HTML =================

window.switchGender = switchGender;
window.setMode = setMode;
window.changeColor = changeColor;
