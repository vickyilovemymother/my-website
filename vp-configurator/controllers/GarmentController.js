export class GarmentController {
    constructor(scene, loader) {
        this.scene = scene;
        this.loader = loader;
        this.activeGarments = { top: null, bottom: null, jacket: null, comboset: null };
    }

    async equip(gender, category, fileName) {
        const path = `./assets/${gender}/${category}/${fileName}`;
        const catKey = category.toLowerCase();

        // Rules: If loading ComboSet, clear all individual parts
        if (catKey === 'comboset') {
            this.remove('top'); this.remove('bottom'); this.remove('jacket');
        } else {
            this.remove('comboset');
        }

        this.remove(catKey);

        try {
            const gltf = await this.loader.load(path);
            const model = gltf.scene;
            this.scene.add(model);
            this.activeGarments[catKey] = model;
        } catch (e) { console.error("Failed to load garment:", path, e); }
    }

    remove(cat) {
        if (this.activeGarments[cat]) {
            this.scene.remove(this.activeGarments[cat]);
            this.activeGarments[cat] = null;
        }
    }

    updateColor(cat, hex) {
        const model = this.activeGarments[cat.toLowerCase()];
        if (model) {
            model.traverse(node => {
                if (node.isMesh) {
                    node.material = node.material.clone();
                    node.material.color.set(hex);
                }
            });
        }
    }
}
