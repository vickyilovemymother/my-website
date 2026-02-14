import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";
import { StateManager } from "./core/StateManager.js";

const sceneManager = new SceneManager();
const environmentManager = new EnvironmentManager(sceneManager);
const modelLoader = new ModelLoader();
const stateManager = new StateManager();

let currentMannequin = null;

let garments = {
  top: null,
  bottom: null
};

// ================= INIT =================

window.addEventListener("DOMContentLoaded", async () => {

  const loadingScreen = document.getElementById("loading-screen");

  await environmentManager.loadHDR(
    "/vp-configurator/assets/hdr/HC_VP.hdr"
  );

  await loadMannequin("Men");

  sceneManager.start();

  populateGarments();

  loadingScreen.style.display = "none";
});


// ================= MANNEQUIN =================

async function loadMannequin(gender) {

  if (currentMannequin) {
    sceneManager.scene.remove(currentMannequin);
  }

  const path =
    gender === "Women"
      ? "/vp-configurator/assets/mannequin/Women_Mannequin.glb"
      : "/vp-configurator/assets/mannequin/Men_Mannequin.glb";

  const mannequin = await modelLoader.loadModel(path);

  currentMannequin = mannequin;

  sceneManager.add(mannequin);

  stateManager.setMannequin(mannequin);
  stateManager.setGender(gender);
}


// ================= GARMENTS =================

async function loadGarment(type, fileName) {

  const gender = stateManager.getState().gender;

  const path = `/vp-configurator/assets/${gender}/${type}/${fileName}`;

  // remove existing garment of same type
  if (garments[type.toLowerCase()]) {
    sceneManager.scene.remove(garments[type.toLowerCase()]);
  }

  const garment = await modelLoader.loadModel(path);

  garments[type.toLowerCase()] = garment;

  sceneManager.add(garment);
}


function populateGarments() {

  const topFiles = ["top01.glb", "top02.glb"];
  const bottomFiles = ["btm01.glb"];

  const topContainer = document.getElementById("top-container");
  const bottomContainer = document.getElementById("bottom-container");

  if (!topContainer || !bottomContainer) {
    console.warn("Garment containers not found in HTML.");
    return;
  }

  topContainer.innerHTML = "";
  bottomContainer.innerHTML = "";

  topFiles.forEach((file) => {
    const btn = document.createElement("button");
    btn.innerText = file.replace(".glb", "");
    btn.onclick = () => loadGarment("Top", file);
    topContainer.appendChild(btn);
  });

  bottomFiles.forEach((file) => {
    const btn = document.createElement("button");
    btn.innerText = file.replace(".glb", "");
    btn.onclick = () => loadGarment("Bottom", file);
    bottomContainer.appendChild(btn);
  });
}


// ================= UI FUNCTIONS =================

async function switchGender(gender) {

  await loadMannequin(gender);

  // remove all garments when gender changes
  Object.keys(garments).forEach((key) => {
    if (garments[key]) {
      sceneManager.scene.remove(garments[key]);
      garments[key] = null;
    }
  });

  populateGarments();
}


function setMode(mode) {
  stateManager.setMode(mode);
  console.log("Mode:", mode);
}


function changeColor(type, value) {

  const target = garments[type];

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

