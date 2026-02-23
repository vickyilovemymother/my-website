// 1. STATE MANAGEMENT
let config = {
    gender: 'Men',
    activeGarments: { top: null, bottom: null, jacket: null, set: null },
    mannequinVisible: true
};

// 2. THE 3D LOADER FUNCTION
function loadGarment(category, fileName) {
    const path = `assets/clothes/${config.gender}/${category}/${fileName}.glb`;
    
    loader.load(path, (gltf) => {
        // Remove existing item in that category
        if(config.activeGarments[category]) {
            scene.remove(config.activeGarments[category]);
        }
        
        // Add new item and save reference
        const model = gltf.scene;
        scene.add(model);
        config.activeGarments[category] = model;
    });
}

// 3. COLOR UPDATE FUNCTION
function changeColor(category, hex) {
    const model = config.activeGarments[category];
    if (model) {
        model.traverse((node) => {
            if (node.isMesh) node.material.color.set(hex);
        });
    }
}
