import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";
import { StateManager } from "./core/StateManager.js";

import { MannequinController } from "./controllers/MannequinController.js";
import { GarmentController } from "./controllers/GarmentController.js";
import { ColorController } from "./controllers/ColorController.js";

const sceneManager = new SceneManager();
const environmentManager = new EnvironmentManager(sceneManager);
const modelLoader = new ModelLoader();
const stateManager = new StateManager();

const mannequinController = new MannequinController(
  sceneManager,
  modelLoader,
  stateManager
);

const garmentController = new GarmentController(
  sceneManager,
  modelLoader,
  stateManager
);

const colorController = new ColorController(garmentController);

async function init() {
  await environmentManager.loadHDR(
    "/vp-configurator/assets/hdr/HC_VP.hdr"
  );

  await mannequinController.load("men");

  sceneManager.start();
}

init();

/* ==== UI API ==== */

window.switchGender = async (gender) => {
  await mannequinController.load(gender);
};

window.changeColor = (type, color) => {
  colorController.change(type, color);
};
