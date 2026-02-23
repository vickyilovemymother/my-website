export class EnvironmentManager {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
    }

    loadHDR(path) {
        const loader = new THREE.RGBELoader();
        loader.load(path, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = texture;
            // Optional: this.scene.background = texture; // If you want to see the HDR background
        });
    }
}
