import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const gui = new GUI();

// THREE.ColorManagement.enabled = false;

/* Canvas */
const canvas = document.querySelector('canvas.webgl');

/* Textures */
// console.log(__directory)
const textureLoader = new THREE.TextureLoader();

const doorBase = textureLoader.load("door/door.jpg");
const doorAlpa = textureLoader.load("door/door-alpha.jpeg");
const doorHeight = textureLoader.load("door/door-height.png");
const doorOclusion = textureLoader.load("door/door-oclussion.jpeg");
const doorMetalness = textureLoader.load("door/door-metalness.jpeg");
const doorRoughness = textureLoader.load("door/door-roughness.jpeg");
const doorNormal = textureLoader.load("door/door-normal.jpeg");

const concreteBase = textureLoader.load("concrete/base.jpg");
const concreteNormal = textureLoader.load("concrete/normal.jpg");
const concreteHeight = textureLoader.load("concrete/height.png");
const concreteRoughness = textureLoader.load("concrete/roughness.jpg");
const concreteOclusion = textureLoader.load("concrete/oclusion.jpg");

const verticalWoodBase = textureLoader.load("vertical-wood/base.jpg");
const verticalWoodHeight = textureLoader.load("vertical-wood/height.png");
const verticalWoodNormal = textureLoader.load("vertical-wood/normal.jpg");
const verticalWoodOclusion = textureLoader.load("vertical-wood/oclusion.jpg");

const roofBase = textureLoader.load("roof/base.jpg");
const roofNormal = textureLoader.load("roof/normal.jpg");
const roofHeight = textureLoader.load("roof/height.png");
const roofRoughness = textureLoader.load("roof/roughness.jpg");
const roofOclusion = textureLoader.load("roof/oclusion.jpg");
roofBase.repeat.set(3,3);
roofBase.rotation = Math.PI * 1.96 ;
roofBase.wrapS = THREE.RepeatWrapping;
roofBase.wrapT = THREE.RepeatWrapping;
roofNormal.repeat.set(3,3);
roofNormal.rotation = Math.PI * 1.96 ;
roofNormal.wrapS = THREE.RepeatWrapping;
roofNormal.wrapT = THREE.RepeatWrapping;
roofHeight.repeat.set(3,3);
roofHeight.rotation = Math.PI * 1.96 ;
roofHeight.wrapS = THREE.RepeatWrapping;
roofHeight.wrapT = THREE.RepeatWrapping;
roofRoughness.repeat.set(3,3);
roofRoughness.rotation = Math.PI * 1.96 ;
roofRoughness.wrapS = THREE.RepeatWrapping;
roofRoughness.wrapT = THREE.RepeatWrapping;
roofOclusion.repeat.set(3,3);
roofOclusion.rotation = Math.PI * 1.96 ;
roofOclusion.wrapS = THREE.RepeatWrapping;
roofOclusion.wrapT = THREE.RepeatWrapping;

const grassBase = textureLoader.load("grass/base.jpg");
grassBase.repeat.set(8,8);
grassBase.wrapS = THREE.RepeatWrapping;
grassBase.wrapT = THREE.RepeatWrapping;
const grassNormal= textureLoader.load("grass/base.jpg");
grassNormal.repeat.set(8,8);
grassNormal.wrapS = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
const grassRoughness = textureLoader.load("grass/roughness.jpg");
grassRoughness.repeat.set(8,8);
grassRoughness.wrapS = THREE.RepeatWrapping;
grassRoughness.wrapT = THREE.RepeatWrapping;
const grassOclussion = textureLoader.load("grass/oclussion.jpg");
grassOclussion.repeat.set(8,8);
grassOclussion.wrapS = THREE.RepeatWrapping;
grassOclussion.wrapT = THREE.RepeatWrapping;

/* Variables */
const colors = {
  ambientLight: "#b9d5ff",
  moonLight: "#b9d5ff",
  floorColor: '#a9c388',
  house: {
    walls: '#ac8e82',
    roof: '#b35f45',
    door: '#aa7b7b',
    bushes: '#89c854',
    doorLight: '#ff7d46',
  },
  scene: {
    graves: '#b2b6b1',
    fog: '#262837'
  }
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


/* Scene */
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

/* Lights */
const ambientLight = new THREE.AmbientLight(colors.ambientLight, 0.03);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(colors.moonLight, 0.05);
moonLight.position.set(4, 5, -2);
moonLight.castShadow = true;
scene.add(moonLight);

/* Camera and Controls */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;




/* floor */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassBase,
    normalMap: grassNormal,
    aoMap: grassOclussion,
    roughnessMap: grassRoughness,
  })
);
floor.rotation.x = - Math.PI * 0.5;
floor.position.y = 0;
// floor.castShadow = true;
floor.receiveShadow = true;
scene.add(floor);


/* House */
const house = new THREE.Group();

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4,2.5,4),
  new THREE.MeshStandardMaterial({
    map: verticalWoodBase,
    displacementMap: verticalWoodHeight,
    displacementScale: 0,
    normalMap: verticalWoodNormal,
    aoMap: verticalWoodOclusion,
  })
);
walls.castShadow = true;
walls.receiveShadow = true;

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3,1.7,4),
  new THREE.MeshStandardMaterial({
    map: roofBase,
    aoMap: roofOclusion,
    displacementMap: roofHeight,
    displacementScale: 0,
    roughness: roofRoughness,
    normalMap: roofNormal
  })
);
roof.position.y = 2;
roof.rotation.y =  Math.PI * 0.25;
roof.receiveShadow = true;

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2,2),
  new THREE.MeshStandardMaterial({
    map: doorBase,
    normalMap: doorNormal,
    transparent: true,
    alphaMap: doorAlpa,
    displacementMap: doorHeight,
    displacementScale: 0.2,
    metalnessMap: doorMetalness,
    roughnessMap: doorRoughness,
    aoMap: doorOclusion,
  })
);
door.castShadow = true;
door.receiveShadow = true;

// Door light
const doorLight = new THREE.PointLight(colors.house.doorLight, 1, 6)
doorLight.position.set(0, 0.8, 3);
doorLight.intensity = 0.6;
doorLight.castShadow = true;
house.add(doorLight)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({color: colors.house.bushes});

const bushes = [
  new THREE.Mesh( bushGeometry, bushMaterial ),
  new THREE.Mesh( bushGeometry, bushMaterial ),
  new THREE.Mesh( bushGeometry, bushMaterial ),
  new THREE.Mesh( bushGeometry, bushMaterial ),
]

bushes[0].position.set(0.9, -1.2, 2.2), bushes[0].scale.set(0.5, 0.5, 0.5);
bushes[0].castShadow = true;
bushes[0].receiveShadow = true;
bushes[1].position.set(1.45, -1.2, 2.2), bushes[1].scale.set(0.3, 0.3, 0.3);
bushes[1].castShadow= true;
bushes[1].receiveShadow = true;
bushes[2].position.set(-0.95, -1.2, 2.2), bushes[2].scale.set(0.5, 0.5, 0.5);
bushes[2].castShadow = true;
bushes[2].receiveShadow = true;
bushes[3].position.set(-1.35, -1.2, 2.2), bushes[3].scale.set(0.3, 0.3, 0.3);
bushes[3].castShadow = true;
bushes[3].receiveShadow = true;

door.position.y = -0.4
door.position.z = 2 + 0.01

house.add(walls, roof, door, ...bushes);
house.position.y = 1.25;

scene.add(house);

/* Scene */

// Graves
const graves = new THREE.Group();
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  //  color: colors.scene.graves
  map: concreteBase,
  roughnessMap: concreteRoughness,
  displacementMap: concreteHeight,
  normalMap: concreteNormal,
  aoMap: concreteOclusion,
  displacementScale: 0
});
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2; // Random angle
  const radius = 3 + Math.random() * 6      // Random radius
  const x = Math.cos(angle) * radius       // Get the x position using cosinus
  const z = Math.sin(angle) * radius      // Get the z position using sinus
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x,0.3, z);

  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  
  graves.add(grave);
}
scene.add(graves);

// Fog
const fog = new THREE.Fog(colors.scene.fog, 1, 8.5);
scene.fog = fog;

/* Ghosts */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
ghost1.castShadow = true;
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
ghost2.castShadow = true;
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
ghost3.castShadow = true;
scene.add(ghost3);


/* Renderer */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(colors.scene.fog);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


/* Events */
window.addEventListener('resize', () => {

  // Update canvas sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera sizes
  camera.aspect = sizes.width;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);

  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = - elapsedTime * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  const ghost3Angle = - elapsedTime * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

}

tick();


// GUI

const guiHouse = gui.addFolder('House');
guiHouse.addColor( colors.house, 'roof').onChange(() => roof.material.color.set(colors.house.roof));
guiHouse.addColor( colors.house, 'walls').onChange(() => walls.material.color.set(colors.house.walls));
guiHouse.addColor( colors.house, 'door').onChange(() => door.material.color.set(colors.house.door));
guiHouse.addColor( colors.house, 'bushes').onChange(() => bushMaterial.color.set(colors.house.bushes));
guiHouse.addColor( colors.scene, 'graves').onChange(() => graveMaterial.color.set(colors.scene.graves));

console.log(house)