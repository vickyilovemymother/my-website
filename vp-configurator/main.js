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

/* =====================================================
   GARMENT CONFIG (LOWERCASE ONLY)
===================================================== */

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
   INIT
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

    if (loadingScreen) loadingScreen.style.display = "none";

    console.log("Engine initialized successfully");
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

init();

/* =====================================================
   MANNEQUIN LOADER
   (Camera framed, mannequin untouched)
===================================================== */

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

    stateManager.setGender(gender);

    autoFrameModel(mannequin);

    console.log("Loaded mannequin:", gender);
  } catch (error) {
    console.error("Mannequin load failed:", error);
  }
}

/* =====================================================
   AUTO CAMERA FRAME (DO NOT MOVE MANNEQUIN)
===================================================== */

function autoFrameModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());

  const camera = sceneManager.camera;

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);

  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  cameraZ *= 1.6;

  camera.position.set(0, size.y * 0.5, cameraZ);
  camera.lookAt(0, size.y * 0.5, 0);

  console.log("Camera framed only (mannequin untouched)");
}

/* =====================================================
   SLIDER POPULATION
===================================================== */

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

  console.log("Populating", category, items);

  if (!items || items.length === 0) {
    slider.innerHTML =
      '<div style="font-size:11px;color:#666;">No items</div>';
    return;
  }

  items.forEach((name) => {
    const card = document.createElement("div");
    card.className = "garment-card";

    const img = document.createElement("img");
    img.src = `/vp-configurator/assets/${gender}/${category}/${name}.png`;

    img.onerror = () => {
      console.warn("Missing thumbnail:", img.src);
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

/* =====================================================
   GARMENT LOADER
===================================================== */

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

/* =====================================================
   COLOR HANDLER
===================================================== */

function changeColor(type, value) {
  if (!garments[type]) return;

  garments[type].traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.color.set(value);
    }
  });

  console.log("Color changed:", type, value);
}

/* =====================================================
   MODE CONTROL
===================================================== */

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

/* =====================================================
   GENDER SWITCH
===================================================== */

async function switchGender(gender) {
  const normalized = gender.toLowerCase();

  await loadMannequin(normalized);

  // Clear garments
  Object.keys(garments).forEach((key) => {
    if (garments[key]) {
      sceneManager.scene.remove(garments[key]);
      garments[key] = null;
    }
  });

  populateSliders(normalized);

  console.log("Gender switched:", normalized);
}

/* =====================================================
   GLOBAL EXPORT
===================================================== */

window.switchGender = switchGender;
window.setMode = setMode;
window.changeColor = changeColor;
