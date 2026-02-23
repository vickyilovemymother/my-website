export class GarmentController {
    constructor(scene) {
        this.scene = scene;
        this.activeGarments = { top: null, bottom: null, jacket: null, comboset: null };
    }

    async addGarment(gender, category, fileName) {
        const loader = new THREE.GLTFLoader();
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('./draco/'); // Path to your draco folder
        loader.setDRACOLoader(dracoLoader);

        const path = `./assets/${gender}/${category}/${fileName}`;

        // INNOVATION: Exclusive Mode Logic
        if (category === 'Comboset') {
            this.remove('top'); this.remove('bottom'); this.remove('jacket');
        } else {
            this.remove('comboset');
        }

        // Remove previous item in the SAME category
        this.remove(category.toLowerCase());

        loader.load(path, (gltf) => {
            const model = gltf.scene;
            this.scene.add(model);
            this.activeGarments[category.toLowerCase()] = model;
        });
    }

    remove(cat) {
        if (this.activeGarments[cat]) {
            this.scene.remove(this.activeGarments[cat]);
            this.activeGarments[cat] = null;
        }
    }
}
