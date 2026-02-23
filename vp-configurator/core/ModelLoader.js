import * as THREE from 'https://cdn.skypack.dev/three@0.150.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.150.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.150.0/examples/jsm/loaders/DRACOLoader.js';

export class ModelLoader {
    constructor() {
        this.loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('./'); // Ensure draco_decoder.js is in root
        this.loader.setDRACOLoader(dracoLoader);
    }

    load(path) {
        return new Promise((resolve, reject) => {
            this.loader.load(path, (gltf) => resolve(gltf), undefined, (err) => reject(err));
        });
    }
}
