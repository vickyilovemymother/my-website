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

async function init() {

  await environmentManager.loadHDR(
    "/vp-configurator/assets/hdr/hc_vp.hdr"
  );

  await loadMannequin("men");

  sceneManager.start();

  populateSliders("men");
  setMode("mix");

  document.getElementById("loading-screen").style.display = "none";
}

init();

async function loadMannequin(gender) {

  const path =
    gender === "women"
      ? "/vp-configurator/assets/mannequin/women_mannequin.glb"
      : "/vp-configurator/assets/mannequin/men_mannequin.glb";

  if (currentMannequin) {
    sceneManager.remove(currentMannequin);
  }

  const mannequin = await modelLoader.loadModel(path);

  mannequin.position.set(0, 0, 0);

  sceneManager.add(mannequin);
  currentMannequin = mannequin;

  stateManager.setGender(gender);

  sceneManager.fitCameraToObject(mannequin);
}

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

  items.forEach(name => {

    const card = document.createElement("div");
    card.className = "garment-card";

    const img = document.createElement("img");
    img.src = `/vp-configurator/assets/${gender}/${category}/${name}.png`;

    card.appendChild(img);

    card.onclick = async () => {

      document
        .querySelectorAll(`#${category}-slider .garment-card`)
        .forEach(c => c.classList.remove("active"));

      card.classList.add("active");

      await loadGarment(category, name + ".glb");
    };

    slider.appendChild(card);
  });
}

async function loadGarment(type, fileName) {

  const gender = stateManager.getState().gender;
  const path = `/vp-configurator/assets/${gender}/${type}/${fileName}`;

  const model = await modelLoader.loadModel(path);

  if (garments[type]) {
    sceneManager.remove(garments[type]);
  }

  model.traverse(child => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0;
    }
  });

  garments[type] = model;
  sceneManager.add(model);

  fadeIn(model);
}

function fadeIn(object) {

  let opacity = 0;

  function animate() {
    opacity += 0.05;

    object.traverse(child => {
      if (child.isMesh) {
        child.material.opacity = opacity;
      }
    });

    if (opacity < 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

function changeColor(type, value) {

  if (!garments[type]) return;

  garments[type].traverse(child => {
    if (child.isMesh) {
      child.material.color.set(value);
    }
  });
}

function setMode(mode) {

  const mix = document.getElementById("mix-section");
  const dress = document.getElementById("dress-section");

  if (mode === "mix") {
    mix.style.display = "block";
    dress.style.display = "none";
  } else {
    mix.style.display = "none";
    dress.style.display = "block";
  }
}

async function switchGender(gender) {

  await loadMannequin(gender);

  Object.keys(garments).forEach(key => {
    if (garments[key]) {
      sceneManager.remove(garments[key]);
      garments[key] = null;
    }
  });

  populateSliders(gender);
}

window.addEventListener("keydown", (e) => {

  const distance = 4;

  switch (e.key) {
    case "2": moveCamera(0, 1.2, distance); break;
    case "8": moveCamera(0, 1.2, -distance); break;
    case "4": moveCamera(-distance, 1.2, 0); break;
    case "6": moveCamera(distance, 1.2, 0); break;
  }
});

function moveCamera(x, y, z) {
  sceneManager.camera.position.set(x, y, z);
  sceneManager.camera.lookAt(0, 1.2, 0);
}

document.getElementById("bgColorPicker")?.addEventListener("input", (e) => {
  sceneManager.renderer.setClearColor(e.target.value);
});

document.getElementById("hdrIntensity")?.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);

  sceneManager.scene.traverse(child => {
    if (child.isMesh && child.material.envMapIntensity !== undefined) {
      child.material.envMapIntensity = value;
    }
  });
});

window.exportImage = function () {

  const size = parseInt(document.getElementById("resolutionSelect").value);

  const renderer = sceneManager.renderer;
  const camera = sceneManager.camera;
  const scene = sceneManager.scene;

  const originalSize = renderer.getSize(new THREE.Vector2());

  renderer.setSize(size, size);
  renderer.render(scene, camera);

  const dataURL = renderer.domElement.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "vp_render.png";
  link.click();

  renderer.setSize(originalSize.x, originalSize.y);
};

window.switchGender = switchGender;
window.setMode = setMode;
window.changeColor = changeColor;
