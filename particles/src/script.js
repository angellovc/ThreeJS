import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector("canvas.webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const textureLoader = new THREE.TextureLoader();

const particleTexture = textureLoader.load("textures/particles/9.png");


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.z = 3;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;



window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// Sphere Particle
// const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
// const particleMaterial = new THREE.PointsMaterial({
//   size: 0.02, // particles size
//   sizeAttenuation: true // distant particles should be smaller than closer ones
// });
// const particles = new THREE.Points(particleGeometry, particleMaterial); // For particles we use points instead of mesh
// scene.add(particles)

// Custom particles
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
});
// particleMaterial.map = particleTexture;
particleMaterial.alphaMap = particleTexture;
particleMaterial.transparent = true;
// particleMaterial.alphaTest = 0.0001;
// particleMaterial.alphaTest = false;
// particleMaterial.depthTest = false;
particleMaterial.depthWrite = false;
// particleMaterial.color = new THREE.Color("#ff88cc");
particleMaterial.blending = THREE.AdditiveBlending; // Adds colors of overlapped dots to the dot in front
const particlesGeometry = new THREE.BufferGeometry();
const particlesNumber = 10000;

const particlesPositions = new Float32Array(particlesNumber * 3);
const particlesColors = new Float32Array(particlesNumber * 3);
for (let i = 0; i < particlesNumber*3; i++) {
  particlesPositions[i] = (Math.random() - 0.5) * 10 // Random value between -0.5 and 0.5
  particlesColors[i] = Math.random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particlesColors, 3));
particleMaterial.vertexColors = true;
const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2;
pointLight.position.y = 0;
pointLight.position.z = 4;
ambientLight.position.x = 2;
ambientLight.position.y = 0;
ambientLight.position.z = 4;

scene.add(ambientLight, pointLight);

// Cube
const cube = new THREE.Mesh(
  new THREE.SphereGeometry(1,32,32),
  new THREE.MeshPhysicalMaterial({
    color: "#FFFFFF",
    metalness: 0.6,
    roughness: 0.8,
    side: THREE.DoubleSide
  })
);

scene.add(cube);





const clock = new THREE.Clock();

const renderer = new THREE.WebGL1Renderer({
  canvas
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {

  const elapsedTime = clock.getElapsedTime();
  controls.update();

  // particles.rotation.y = elapsedTime * 0.02;

  for (let i = 0; i < particlesNumber * 3; i++) {
    const point = i * 3;

    const x = particlesGeometry.attributes.position.array[point];
    particlesGeometry.attributes.position.array[point + 1] = Math.sin(elapsedTime + x);
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);

}

tick();