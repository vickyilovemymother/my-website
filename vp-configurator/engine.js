const loadingScreen = document.getElementById("loading-screen");

const container = document.getElementById("vp-canvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// HDR
new THREE.RGBELoader()
  .load("/vp-configurator/assets/hdr/HC_VP.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  });

// Draco Loader
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath("/vp-configurator/assets/draco/");

const loader = new THREE.GLTFLoader();
loader.setDRACOLoader(dracoLoader);

// Load mannequin
loader.load(
  "/vp-configurator/assets/mannequin/Men_Mannequin.glb",
  function (gltf) {
    scene.add(gltf.scene);
    loadingScreen.style.display = "none";
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
