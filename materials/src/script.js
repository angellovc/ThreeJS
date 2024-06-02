import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from "lil-gui";

const gui = new dat.GUI();

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const matcapTexture1 = textureLoader.load('/textures/matcaps/2.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture3 = textureLoader.load('/textures/matcaps/4.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

// const material = new THREE.MeshBasicMaterial();
// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshMatcapMaterial();
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// const material = new THREE.MeshToonMaterial();
const material = new THREE.MeshStandardMaterial();
// const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  material
)

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

// material.map = doorAlphaTexture;
// material.color = new THREE.Color("#ff0000")
// material.transparent = true;
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture;
material.side = THREE.DoubleSide;
// material.flatShading = true;
// material.matcap = matcapTexture2;
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);
// material.gradientMap = gradientTexture;
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;

// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture
material.envMap = environmentMapTexture

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2;
pointLight.position.y = 0;
pointLight.position.z = 4;

// material.metalness = 0.45
// material.roughness = 0.65

scene.add(ambientLight, pointLight);

sphere.position.x = -1.5;
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

// Setting camera up
const sizes = {
  witdh: window.innerWidth,
  height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.witdh / sizes.height);
camera.position.z = 3;
scene.add(camera);

const canvas = document.querySelector("canvas.webgl");

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.witdh, sizes.height);

renderer.render(scene, camera);

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  control.update();

  // sphere.rotation.y = 0.5 * elapsedTime;  
  // plane.rotation.y = 0.5 * elapsedTime;  
  // torus.rotation.y = 0.5 * elapsedTime;

  // sphere.rotation.x = 0.5 * elapsedTime;  
  // plane.rotation.x = 0.5 * elapsedTime;  
  // torus.rotation.x = 0.5 * elapsedTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();
