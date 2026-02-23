import { SceneManager } from './core/SceneManager.js';
import { ModelLoader } from './core/ModelLoader.js';
import { GarmentController } from './controllers/GarmentController.js';

const engine = new SceneManager('canvas-container');
const loader = new ModelLoader();
const garments = new GarmentController(engine.scene, loader);

let currentGender = 'Men';
let mannequinMesh = null;

// Initial Setup
async function init() {
    loadMannequin('Men');
    setupUI();
}

async function loadMannequin(gender) {
    if (mannequinMesh) engine.scene.remove(mannequinMesh);
    const gltf = await loader.load(`./assets/mannequin/${gender}_Mannequin.glb`);
    mannequinMesh = gltf.scene;
    engine.scene.add(mannequinMesh);
}

function setupUI() {
    // Mannequin Toggle
    document.getElementById('mannequin-toggle').onchange = (e) => {
        if(mannequinMesh) mannequinMesh.visible = e.target.checked;
    };

    // Gender Buttons
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.onclick = () => {
            currentGender = btn.dataset.gender;
            loadMannequin(currentGender);
            // Refresh thumbnails logic here
        };
    });
}

// Global exposure for UI buttons
window.selectGarment = (cat, file) => garments.equip(currentGender, cat, file);
window.changeColor = (cat, hex) => garments.updateColor(cat, hex);

init();
