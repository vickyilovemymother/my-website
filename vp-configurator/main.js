import * as THREE from "three";
import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";
import { StateManager } from "./core/StateManager.js";

/* ================= SETUP ================= */

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

/* ================= INIT ================= */

async function init() {
  await environmentManager.loadHDR(
    "/vp-configurator/assets/hdr/hc_vp.hdr"
  );

  await loadMannequin("men");

  sceneManager.start();

  if (loadingScreen) loadingScreen.style.display = "none";
}

init();

/* ================= MANNEQUIN ================= */

async function loadMannequin(gender) {
  const path =
    gender === "women"
      ? "/vp-configurator/assets/mannequin/women_mannequin.glb"
      : "/vp-configurator/assets/mannequin/men_mannequin.glb";

  if (currentMannequin) {
    sceneManager.scene.remove(currentMannequin);
  }

  const mannequin = await modelLoader.loadModel(path);
  mannequin.position.set(0, 0, 0);

  sceneManager.add(mannequin);
  currentMannequin = mannequin;

  sceneManager.fitCameraToObject(mannequin);

  stateManager.setGender(gender);
}

/* ================= GARMENT LOAD ================= */

async function loadGarment(type, fileName) {
  const gender = stateManager.getState().gender;
  const path = `/vp-configurator/assets/${gender}/${type}/${fileName}`;

  const model = await modelLoader.loadModel(path);

  if (garments[type]) {
    sceneManager.scene.remove(garments[type]);
  }

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

/* ================= FADE IN ================= */

function fadeIn(object) {
  let opacity = 0;

  function animate() {
    opacity += 0.05;

    object.traverse((child) => {
      if (child.isMesh) {
        child.material.opacity = opacity;
      }
    });

    if (opacity < 1) requestAnimationFrame(animate);
  }

  animate();
}

/* ================= COLOR ================= */

function changeColor(type, value) {
  if (!garments[type]) return;

  garments[type].traverse((child) => {
    if (child.isMesh && child.material.color) {
      child.material.color.set(value);
    }
  });
}

window.changeColor = changeColor;

/* ================= BACKGROUND ================= */

document.getElementById("bgColorPicker")?.addEventListener("input", (e) => {
  sceneManager.renderer.setClearColor(e.target.value);
});

/* ================= HDR INTENSITY ================= */

document.getElementById("hdrIntensity")?.addEventListener("input", (e) => {
  const intensity = parseFloat(e.target.value);

  sceneManager.scene.traverse((child) => {
    if (child.isMesh && child.material.envMapIntensity !== undefined) {
      child.material.envMapIntensity = intensity;
    }
  });
});

/* ================= CAMERA SHORTCUTS ================= */

window.addEventListener("keydown", (e) => {
  const dist = sceneManager.camera.position.length();

  switch (e.key) {
    case "2": sceneManager.smoothMove(0, 1.2, dist); break;
    case "8": sceneManager.smoothMove(0, 1.2, -dist); break;
    case "4": sceneManager.smoothMove(-dist, 1.2, 0); break;
    case "6": sceneManager.smoothMove(dist, 1.2, 0); break;
    case "5": sceneManager.smoothMove(0, dist, 0); break;
    case "0": sceneManager.smoothMove(0, -dist, 0); break;
  }
});

/* ================= EXPORT ================= */

window.exportImage = function () {
  const width = parseInt(prompt("Width?", "2048"));
  const height = parseInt(prompt("Height?", "2048"));
  const transparent = confirm("Transparent PNG?");

  const renderer = sceneManager.renderer;
  const camera = sceneManager.camera;
  const scene = sceneManager.scene;

  const originalSize = renderer.getSize(new THREE.Vector2());
  const originalBg = renderer.getClearColor().clone();

  if (transparent) {
    renderer.setClearColor(0x000000, 0);
  }

  renderer.setSize(width, height);
  renderer.render(scene, camera);

  const dataURL = renderer.domElement.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "vp_render.png";
  link.click();

  renderer.setSize(originalSize.x, originalSize.y);
  renderer.setClearColor(originalBg);
};

/* ================= AUTO SPIN ================= */

window.toggleSpin = function () {
  sceneManager.toggleSpin();
};
