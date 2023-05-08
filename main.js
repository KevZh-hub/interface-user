import * as THREE from 'three';
import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

let alpha, beta, gamma = 0;

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

const degToRad = (deg) => deg * (Math.PI / 280);
// On prepare la scène
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
loader.load(
  'ballmazefirst.gltf',
  function (gltf) {

    const object = gltf.scene.children[0];
// On créer l'objet et on defini ses valeurs (taille, orientation et position)
    object.material = new THREE.MeshStandardMaterial({
      color: 0x3366cc
    });

    object.scale.set(0.6, 0.6, 0.6); 
    object.rotation.x = -0.99;
    object.rotation.y = 0.5;
    scene.add(object);

    window.addEventListener('devicemotion', function (event) {
      const acceleration = event.accelerationIncludingGravity;

      if (acceleration.x > 15 || acceleration.y > 15 || acceleration.z > 15) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        object.material.color.set('#' + randomColor);
      }
    });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% chargé');
  },
  function (error) {
    console.error('Erreur de chargement', error);
  }
);

function animate() {

  scene.rotation.z = degToRad(alpha) / 2;
  scene.rotation.x = degToRad(beta);
  scene.rotation.y = degToRad(gamma);

  renderer.render(scene, camera);
}

animate();