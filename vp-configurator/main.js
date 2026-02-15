import * as THREE from "three";
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
   INITIALIZE ENGINE
================================= */

async function init() {
  try {

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
   AUTO CENTER FUNCTION
================================= */

function centerModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  model.position.x -= center.x;
  model.position.y -= center.y;
  model.position.z -= center.z;

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = sceneManager.camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

  sceneManager.camera.position.set(0, 0, cameraZ * 1.2);
  sceneManager.camera.lookAt(0, 0, 0);

  sceneManager.controls.target.set(0, 0, 0);
  sceneManager.controls.update();
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

    sceneManager.add(mannequin);
    currentMannequin = mannequin;

    centerModel(mannequin);

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

  items.forEach((name) => {

    const card = document.createElement("div");
    card.className = "garment-card";

    const img = document.createElement("img");
    img.src = `/vp-configurator/assets/${gender}/${category}/${name}.png`;

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
   GARMENT LOADER (WITH FADE)
================================= */

async function loadGarment(type, fileName) {

  try {

    const gender = stateManager.getState().gender;
    const path = `/vp-configurator/assets/${gender}/${type}/${fileName}`;

    console.log("Loading garment:", path);

    const model = await modelLoader.loadModel(path);

    // Fade-in animation
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

    // Animate fade in
    fadeIn(model);

    console.log("Loaded garment:", type, fileName);

  } catch (error) {
    console.error("Garment load failed:", error);
  }
}

/* ===============================
   FADE ANIMATION
================================= */

function fadeIn(object) {

  let opacity = 0;

  const interval = setInterval(() => {

    opacity += 0.05;

    object.traverse(child => {
      if (child.isMesh) {
        child.material.opacity = opacity;
      }
    });

    if (opacity >= 1) {
      clearInterval(interval);
    }

  }, 30);
}

/* ===============================
   COLOR HANDLER
================================= */

function changeColor(type, value) {

  if (!garments[type]) return;

  garments[type].traverse(child => {
    if (child.isMesh) {
      child.material.color.set(value);
    }
  });
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
