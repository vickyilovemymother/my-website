import * as THREE from 'https://cdn.skypack.dev/three@0.150.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.150.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.150.0/examples/jsm/loaders/DRACOLoader.js';

export class ModelLoader {
    constructor() {
        this.loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        
        // FIX: Point this to your root directory where draco files are
        // GitHub Pages requires the absolute relative path
        dracoLoader.setDecoderPath('./'); 
        
        this.loader.setDRACOLoader(dracoLoader);
    }

    async load(path) {
        return new Promise((resolve, reject) => {
            this.loader.load(path, 
                (gltf) => resolve(gltf),
                (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
                (error) => reject(error)
            );
        });
    }
}
