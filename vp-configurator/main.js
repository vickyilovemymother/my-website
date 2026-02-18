import * as THREE from "three";
import { SceneManager } from "./core/SceneManager.js";
import { EnvironmentManager } from "./core/EnvironmentManager.js";
import { ModelLoader } from "./core/ModelLoader.js";

const sceneManager = new SceneManager();
const environmentManager = new EnvironmentManager(sceneManager);
const modelLoader = new ModelLoader();

let mannequin;
let garments = {};
let spinEnabled = false;
let hdrVisible = true;
let shadowVisible = true;
let performanceMode = false;

/* ================= INIT ================= */

async function init() {
  await environmentManager.loadHDR("/vp-configurator/assets/hdr/hc_vp.hdr");
  await loadMannequin();
  addGroundShadow();
  sceneManager.start();
}
init();

/* ================= MANNEQUIN ================= */

async function loadMannequin() {
  mannequin = await modelLoader.loadModel("/vp-configurator/assets/mannequin/men_mannequin.glb");
  sceneManager.add(mannequin);
  fitCamera();
}

/* ================= CAMERA ================= */

function fitCamera() {
  const box = new THREE.Box3().setFromObject(mannequin);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  const fov = sceneManager.camera.fov * (Math.PI/180);
  let distance = Math.abs(maxDim / Math.sin(fov/2)) * 0.6;

  sceneManager.camera.position.set(0, size.y*0.6, distance);
  sceneManager.camera.lookAt(center);
}

window.addEventListener("keydown", (e)=>{
  const dist = sceneManager.camera.position.length();
  if(e.key==="2") moveCam(0,1.5,dist);
  if(e.key==="8") moveCam(0,1.5,-dist);
  if(e.key==="4") moveCam(-dist,1.5,0);
  if(e.key==="6") moveCam(dist,1.5,0);
});

function moveCam(x,y,z){
  gsap.to(sceneManager.camera.position,{
    duration:0.8,
    x,y,z,
    onUpdate:()=>sceneManager.camera.lookAt(0,1,0)
  });
}

/* ================= FADE ================= */

function fadeIn(obj){
  obj.traverse(c=>{
    if(c.isMesh){
      c.material.transparent=true;
      c.material.opacity=0;
    }
  });

  let opacity=0;
  function animate(){
    opacity+=0.05;
    obj.traverse(c=>{
      if(c.isMesh) c.material.opacity=opacity;
    });
    if(opacity<1) requestAnimationFrame(animate);
  }
  animate();
}

/* ================= HDR ================= */

document.getElementById("hdrIntensity").addEventListener("input",(e)=>{
  const val=parseFloat(e.target.value);
  sceneManager.scene.traverse(obj=>{
    if(obj.isMesh && obj.material.envMapIntensity!==undefined){
      obj.material.envMapIntensity=val;
    }
  });
});

window.toggleHDR=()=>{
  hdrVisible=!hdrVisible;
  sceneManager.scene.environment = hdrVisible ? environmentManager.hdrTexture : null;
};

/* ================= BACKGROUND ================= */

document.getElementById("bgColorPicker").addEventListener("input",(e)=>{
  sceneManager.renderer.setClearColor(e.target.value);
});

/* ================= SHADOW ================= */

function addGroundShadow(){
  const geo=new THREE.PlaneGeometry(10,10);
  const mat=new THREE.ShadowMaterial({opacity:0.3});
  const plane=new THREE.Mesh(geo,mat);
  plane.rotation.x=-Math.PI/2;
  plane.position.y=0;
  plane.receiveShadow=true;
  plane.name="groundShadow";
  sceneManager.scene.add(plane);
}

window.toggleShadow=()=>{
  shadowVisible=!shadowVisible;
  const shadow=sceneManager.scene.getObjectByName("groundShadow");
  if(shadow) shadow.visible=shadowVisible;
};

/* ================= SPIN ================= */

window.toggleSpin=()=>{
  spinEnabled=!spinEnabled;
};

function spinLoop(){
  if(spinEnabled){
    mannequin.rotation.y+=0.01;
  }
  requestAnimationFrame(spinLoop);
}
spinLoop();

/* ================= EXPORT ================= */

window.exportPNG=(transparent=false)=>{
  const w=parseInt(document.getElementById("exportWidth").value)||2048;
  const h=parseInt(document.getElementById("exportHeight").value)||2048;

  const oldSize=sceneManager.renderer.getSize(new THREE.Vector2());

  if(transparent) sceneManager.renderer.setClearColor(0x000000,0);

  sceneManager.renderer.setSize(w,h);
  sceneManager.renderer.render(sceneManager.scene,sceneManager.camera);

  const dataURL=sceneManager.renderer.domElement.toDataURL("image/png");

  const link=document.createElement("a");
  link.href=dataURL;
  link.download="vp_render.png";
  link.click();

  sceneManager.renderer.setSize(oldSize.x,oldSize.y);
};

window.exportGIF=()=>{
  alert("GIF export pipeline ready — connect GIF encoder like gif.js for production.");
};

/* ================= PRESET ================= */

window.savePreset=()=>{
  const preset={
    spin:spinEnabled
  };
  localStorage.setItem("vpPreset",JSON.stringify(preset));
};

window.loadPreset=()=>{
  const preset=JSON.parse(localStorage.getItem("vpPreset"));
  if(!preset) return;
  spinEnabled=preset.spin;
};

window.togglePerformance=()=>{
  performanceMode=!performanceMode;
  sceneManager.renderer.setPixelRatio(performanceMode?1:window.devicePixelRatio);
};
