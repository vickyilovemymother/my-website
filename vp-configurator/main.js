import { SceneManager } from './core/SceneManager.js';
import { EnvironmentManager } from './core/EnvironmentManager.js';
import { GarmentController } from './controllers/GarmentController.js';

const engine = new SceneManager('canvas-container');
const env = new EnvironmentManager(engine.scene, engine.renderer);
const garments = new GarmentController(engine.scene);

// Load HDR Lighting
env.loadHDR('./assets/mannequin/HC_VP.hdr');

// Load Config and Build UI
fetch('./config/garmentConfig.json')
    .then(res => res.json())
    .then(config => {
        // Initialize UI Logic here to create thumbnails
        // and link them to: garments.addGarment(gender, category, file);
    });
