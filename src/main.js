import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);
scene.background = new THREE.Color(0xeeeeee);
camera.position.z = 5;
const loader = new GLTFLoader();
let load;
loader.load(
  "/cars_f1.glb",
  (gltf) => {
    load = gltf.scene;
    scene.add(gltf.scene);
    if (load) {
      animate();
    }
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

let previousMousePos = { x: 0, y: 0 };
window.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  previousMousePos = { x: e.clientX, y: e.clientY };
});

window.addEventListener("mouseup", () => {
  isMouseDown = false;
});

window.addEventListener("mousemove", onmousemove);
function onmousemove(e) {
  if (isMouseDown && load) {
    const deltaMove = {
      x: e.clientX - previousMousePos.x,
      y: e.clientY - previousMousePos.y,
    };
    load.rotation.y += deltaMove.x * 0.01;
    load.rotation.x += deltaMove.y * 0.01;
    previousMousePos = { x: e.clientX, y: e.clientY };
  }
}
let isMouseDown = false;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (load) {
    const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 1000;
    load.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }
});
