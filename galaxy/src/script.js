import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';

const canvas = document.querySelector("canvas.webgl");


const sizes = {
  height: window.innerHeight,
  width: window.innerWidth,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 1, 100);
camera.position.z = 3;
scene.add(camera);

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

const galaxyParameters = {
  amount: 100000,
  size: 0.01,
  points: null,
  geometry: null,
  material: null,
  radius: 5,
  branches: 3,
  spin: 10,
  randomness: 0.2,
  randomnessPower: 3,
  innerColor: '#7b219f',
  outsideColor: '#1b3984'
};

const generateGalaxy = () => {
  if (galaxyParameters.points !== null) {
    galaxyParameters.geometry.dispose();
    galaxyParameters.material.dispose();
    scene.remove(galaxyParameters.points);
  }
  galaxyParameters.geometry = new THREE.BufferGeometry();
  galaxyParameters.material = new THREE.PointsMaterial({
    size: galaxyParameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending
  });
  const positions = new Float32Array(galaxyParameters.amount * 3);
  const colors = new Float32Array(galaxyParameters.amount * 3);

  const innerColor = new THREE.Color(galaxyParameters.innerColor)
  const outsideColor = new THREE.Color(galaxyParameters.outsideColor)


  for (let i = 0; i < galaxyParameters.amount * 3; i++) {
    const x = i * 3;
    const y = (i * 3) + 1;
    const z = (i * 3) + 2;

    
    const radius = Math.random() * galaxyParameters.radius;
    const branchAngle = (i % galaxyParameters.branches) / galaxyParameters.branches * Math.PI * 2;
    const spinAngle = radius * galaxyParameters.spin;
    
    const randomX = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * galaxyParameters.randomness * radius;
    const randomY = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * galaxyParameters.randomness * radius;
    const randomZ = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * galaxyParameters.randomness * radius;

    positions[x] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[y] = randomY;
    positions[z] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Colors
    const mixedColor = innerColor.clone();
    mixedColor.lerp(outsideColor, radius / galaxyParameters.radius);

    colors[x] = mixedColor.r;
    colors[y] = mixedColor.g;
    colors[z] = mixedColor.b;
  }
  galaxyParameters.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  galaxyParameters.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  galaxyParameters.points = new THREE.Points(galaxyParameters.geometry, galaxyParameters.material);
  scene.add(galaxyParameters.points);
  
}
generateGalaxy();

const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
const tick = () => {

  const elapsedTime = clock.getElapsedTime();

  galaxyParameters.points.rotation.y = elapsedTime * 0.1;

  control.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
  
}

tick();

// Event listeners
window.addEventListener('resize', () => {
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  camera.aspect = sizes.width;
  camera.updateProjectionMatrix();

  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Debugger
const gui = new GUI();
gui.add(galaxyParameters, 'size').min(0).max(1).step(0.0001).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'amount').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(galaxyParameters, 'innerColor').onFinishChange(generateGalaxy);
gui.addColor(galaxyParameters, 'outsideColor').onFinishChange(generateGalaxy);