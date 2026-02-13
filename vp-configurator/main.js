import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";

const loadingScreen = document.getElementById("loading-screen");

const sceneManager = new SceneManager();
const environmentManager = new EnvironmentManager(sceneManager);
const modelLoader = new ModelLoader();

async function init() {
  await environmentManager.loadHDR(
    "./vp-configurator/assets/hdr/HC_VP.hdr"
  );

  const mannequin = await modelLoader.loadModel(
    "./vp-configurator/assets/mannequin/Men_Mannequin.glb"
  );

  sceneManager.add(mannequin);

  sceneManager.start();

  loadingScreen.style.display = "none";
}

init();
