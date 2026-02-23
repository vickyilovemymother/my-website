export class GarmentController {
    constructor(scene, stateManager) {
        this.scene = scene;
        this.state = stateManager;
        this.loader = new ModelLoader(); 
    }

    async loadGarment(category, fileName) {
        const gender = this.state.state.gender;
        const path = `./assets/${gender}/${category}/${fileName}`;

        // 1. Clear logic: If loading a full dress, remove individual pieces
        if (category === 'Comboset') {
            this.removeGarment('top');
            this.removeGarment('bottom');
            this.removeGarment('jacket');
        } else {
            this.removeGarment('comboset');
        }

        // 2. Remove previous item in this category
        this.removeGarment(category.toLowerCase());

        // 3. Load New
        const gltf = await this.loader.load(path);
        const model = gltf.scene;
        
        // Innovation: Apply current state color immediately upon load
        this.applyColorToModel(model, this.state.state.colors[category.toLowerCase()]);

        this.scene.add(model);
        this.state.state.activeItems[category.toLowerCase()] = model;
    }

    removeGarment(cat) {
        const existing = this.state.state.activeItems[cat];
        if (existing) {
            this.scene.remove(existing);
            this.state.state.activeItems[cat] = null;
        }
    }

    applyColorToModel(model, hex) {
        if(!hex) return;
        model.traverse(node => {
            if (node.isMesh) node.material.color.set(hex);
        });
    }
}
