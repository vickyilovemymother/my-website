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

let garments = {
  top: null,
  bottom: null,
  jacket: null,
  dress: null
};

/* ================= INIT ================= */

async function init() {
  await environmentManager.loadHDR(
    "/vp-configurator/assets/hdr/hc_vp.hdr"
  );

  await loadMannequin("men");

  populateSliders("men");
  setMode("mix");

  sceneManager.start();
}

init();

/* ================= MANNEQUIN ================= */

async function loadMannequin(gender) {
  const path =
    gender === "women"
      ? "/vp-configurator/assets/mannequin/women_mannequin.glb"
      : "/vp-configurator/assets/mannequin/men_mannequin.glb";

  if (currentMannequin) sceneManager.remove(currentMannequin);

  const mannequin = await modelLoader.loadModel(path);

  mannequin.position.set(0, 0, 0);

  sceneManager.add(mannequin);
  currentMannequin = mannequin;

  sceneManager.fitCameraToObject(mannequin);

  stateManager.setGender(gender);
}

/* ================= GARMENTS ================= */

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

function populateSliders(gender) {
  const config = garmentConfig[gender];

  Object.keys(config).forEach((category) => {
    const slider = document.getElementById(category + "-slider");
    if (!slider) return;

    slider.innerHTML = "";

    config[category].forEach((name) => {
      const card = document.createElement("div");
      card.className = "garment-card";

      const img = document.createElement("img");
      img.src = `/vp-configurator/assets/${gender}/${category}/${name}.png`;

      card.appendChild(img);

      card.onclick = async () => {
        await loadGarment(category, name + ".glb");
      };

      slider.appendChild(card);
    });
  });
}

async function loadGarment(type, fileName) {
  const gender = stateManager.getState().gender;
  const path = `/vp-configurator/assets/${gender}/${type}/${fileName}`;

  const model = await modelLoader.loadModel(path);

  if (garments[type]) sceneManager.remove(garments[type]);

  model.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0;
    }
  });

  garments[type] = model;
  sceneManager.add(model);

  fadeIn(model);
}

/* ================= FADE ================= */

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

function changeColor(type, value) {
  if (!garments[type]) return;

  garments[type].traverse((child) => {
    if (child.isMesh) child.material.color.set(value);
  });
}

window.changeColor = changeColor;

/* ================= MODE ================= */

function setMode(mode) {
  const mix = document.getElementById("mix-section");
  const dress = document.getElementById("dress-section");

  mix.style.display = mode === "mix" ? "block" : "none";
  dress.style.display = mode === "dress" ? "block" : "none";
}

window.setMode = setMode;

/* ================= GENDER ================= */

async function switchGender(gender) {
  await loadMannequin(gender);

  Object.keys(garments).forEach((key) => {
    if (garments[key]) {
      sceneManager.remove(garments[key]);
      garments[key] = null;
    }
  });

  populateSliders(gender);
}

window.switchGender = switchGender;

/* ================= CAMERA SHORTCUTS ================= */

window.addEventListener("keydown", (e) => {
  if (!currentMannequin) return;

  const dist = sceneManager.camera.position.length();

  switch (e.key) {
    case "2": sceneManager.smoothMoveCamera(0, 1.2, dist); break;
    case "8": sceneManager.smoothMoveCamera(0, 1.2, -dist); break;
    case "4": sceneManager.smoothMoveCamera(-dist, 1.2, 0); break;
    case "6": sceneManager.smoothMoveCamera(dist, 1.2, 0); break;
  }
});
