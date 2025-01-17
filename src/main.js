import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light, less intensity
scene.add(ambientLight);

// const hemisphereLight = new THREE.HemisphereLight(0xffb6c1, 0xe0ffff, 1); // Sky color, ground color, intensity
// scene.add(hemisphereLight);

// const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Color, intensity, distance
// pointLight.position.set(5, 5, 5); // Adjust position as needed
// scene.add(pointLight);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 10, 10).normalize();
scene.add(light);

scene.background = new THREE.Color(0xeeeeee);
camera.position.z = 7;

const loader = new GLTFLoader();
let load;
loader.load(
  "/monkey_unicorn.glb",
  (gltf) => {
    load = gltf.scene;

    const box = new THREE.Box3().setFromObject(load);
    const center = box.getCenter(new THREE.Vector3());

    // Set the model's position to center it
    load.position.set(-center.x, -center.y, -center.z);
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

// Touch events for mobile devices
window.addEventListener("touchstart", (e) => {
  isMouseDown = true;
  previousMousePos = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  };
});

window.addEventListener("touchend", () => {
  isMouseDown = false;
});

window.addEventListener("touchmove", (e) => {
  if (isMouseDown && load) {
    const deltaMove = {
      x: e.touches[0].clientX - previousMousePos.x,
      y: e.touches[0].clientY - previousMousePos.y,
    };
    load.rotation.y += deltaMove.x * 0.01;
    load.rotation.x += deltaMove.y * 0.01;
    previousMousePos = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }
});

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
