import { SceneManager } from './core/SceneManager.js';
import { StateManager } from './core/StateManager.js';
import { GarmentController } from './controllers/GarmentController.js';
import { UIController } from './controllers/UIController.js';

const state = new StateManager();
const engine = new SceneManager();
const garments = new GarmentController(engine.scene, state);

// Initialize UI
const ui = new UIController(state, (cat, file) => {
    garments.loadGarment(cat, file);
    engine.focusCamera(cat.toLowerCase()); // Auto-zoom innovation
});

// Expose a global toggle for the Mannequin ON/OFF
window.toggleMannequin = (isVisible) => {
    engine.mannequin.visible = isVisible;
};
