import * as THREE from 'three';
import * as lil from 'lil-gui';
import gsap from 'gsap';

THREE.ColorManagement.enabled = false;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Variables
 */
const parameters = {
  materialColor: '#ffeded'
}

const particles = {
  amount: 300,
  positions: undefined,
  geometry: new THREE.BufferGeometry(),
  material: new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
  }),
  mesh: undefined
}

const mouse = {
  x: 0,
  y: 0
}

let scrollY = (window.scrollY) * -1;
let currentSection = 0

const canvasProperties = {
  witdh: window.innerWidth,
  height: window.innerHeight
}

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

/**
 * Camera
 */
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(35, canvasProperties.witdh/canvasProperties.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);
/**
 * Helpers
 */
// const axesHelper = new THREE.AxesHelper(4);
// scene.add(axesHelper);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1,1,0);
scene.add(directionalLight);

/**
 * Objects
 */

// Figures
const material = new THREE.MeshToonMaterial({ 
  color: parameters.materialColor,
  gradientMap: gradientTexture
});

const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
);
const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const objectDistance = 4;
mesh1.position.y = -objectDistance * 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

const meshes = [mesh1,mesh2,mesh3];
scene.add(mesh1, mesh2, mesh3);

// Particles 
particles.positions = new Float32Array(particles.amount * 3)
for (let i = 0; i < particles.amount; i++) {
  particles.positions[i * 3] = (Math.random() - 0.5) * 10;
  particles.positions[i * 3 + 1] =  objectDistance * 0.5 - Math.random() * objectDistance * 3;
  particles.positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
particles.geometry.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
particles.mesh = new THREE.Points(particles.geometry, particles.material);
scene.add(particles.mesh);




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
});
// A value between 0 and 1 to set the trasnparency of the renderer
renderer.setClearAlpha(0);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(canvasProperties.witdh, canvasProperties.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Runner
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  camera.position.y = scrollY;
  cameraGroup.position.x += ((mouse.x * 0.5) - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y += ((-mouse.y * 0.5) - cameraGroup.position.y) * 5 * deltaTime;

  for (const mesh of meshes) {
    console.log(deltaTime)
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick()


/**
 * Listeners
 */
window.addEventListener('resize', () => {
  canvasProperties.witdh = window.innerWidth;
  canvasProperties.height = window.innerHeight;

  camera.aspect = canvasProperties.witdh/canvasProperties.height;
  camera.updateProjectionMatrix();

  renderer.setSize(canvasProperties.witdh/canvasProperties.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('scroll', () => {
  scrollY = (window.scrollY/canvasProperties.height * objectDistance) * -1;
  const newSection = Math.round(window.scrollY/canvasProperties.height);
  if (newSection !== currentSection) {
    currentSection = newSection;
    gsap.to(
      meshes[currentSection].rotation,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=2',
        y: '+=1',
        z: '+=1'
    }
    )
  }
})

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX / canvasProperties.witdh - 0.5;
  mouse.y = event.clientY / canvasProperties.height - 0.5;
})

/**
 * GUI
 */

const gui = new lil.GUI();


gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor);
});