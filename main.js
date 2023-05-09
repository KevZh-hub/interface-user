import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let alpha, beta, gamma = 0;
let isObject1Visible = true;

document.getElementById('btn').addEventListener('click', requestMotionPermission);
async function requestMotionPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    const permission = await DeviceOrientationEvent.requestPermission()
    window.addEventListener('deviceorientation', (event) => {
      alpha = event.alpha;
      beta = event.beta;
      gamma = event.gamma;
    });
  } else {
    window.addEventListener('deviceorientation', (event) => {
      alpha = event.alpha;
      beta = event.beta;
      gamma = event.gamma;
    });
  }
}

requestMotionPermission();

// On prepare la scène
const degToRad = (deg) => deg * (Math.PI / 180);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

camera.position.z = 100;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const loader = new GLTFLoader();
let object1, object2;

loader.load('laby1.gltf', (gltf) => {
  object1 = gltf.scene.children[0];
  object1.material = new THREE.MeshStandardMaterial({ color: 0x3366cc });
  object1.scale.set(0.6, 0.6, 0.6); 
  object1.rotation.x = -0.99;
  object1.rotation.y = 0.5;
  scene.add(object1);
});

loader.load('laby2.gltf', (gltf) => {
  object2 = gltf.scene.children[0];
  object2.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  object2.scale.set(0.6, 0.6, 0.6); 
  object2.rotation.x = -0.99;
  object2.rotation.y = 0.5;
  scene.add(object2);
  object2.visible = false;
});

window.addEventListener('devicemotion', function (event) {
  const acceleration = event.accelerationIncludingGravity;
  if (acceleration.x > 15 || acceleration.y > 15 || acceleration.z > 15) {
    if (isObject1Visible) {
      object1.visible = false;
      object2.visible = true;
      object1.material.color.setRGB(Math.random(), Math.random(), Math.random());
    } else {
      object1.visible = true;
      object2.visible = false;
      object2.material.color.setRGB(Math.random(), Math.random(), Math.random());
    }
    isObject1Visible = !isObject1Visible;
  }
});

function animate() {
  scene.rotation.z = degToRad(alpha) / 2;
  scene.rotation.x = degToRad(beta);
  scene.rotation.y = degToRad(gamma);
  renderer.render(scene, camera);
}

animate();