import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as lil from "lil-gui";
import gsap from "gsap";

const parameter = {
  color: 0xff0000,
  spin: () =>
  {
      gsap.to(parameter.mesh.rotation, { duration: 1, y: parameter.mesh.rotation.y + Math.PI * 2 })
  },
  widthSegment: 32,
  heightSegment: 32,
  geometry: null,
  mesh: null
};

const gui = new lil.GUI();
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

// const geometry = new THREE.BufferGeometry();
// const positionsArray = new Float32Array([
//   0, 0, 0, // First vertex
//   0, 1, 0, // Second vertex
//   1, 0, 0,  // Third vertex
// ]);
// const positionAttribute = new THREE.BufferAttribute(positionsArray, 3);
// geometry.setAttribute("position", positionAttribute)
// parameter.geometry = new THREE.BoxGeometry(1,1,1,2,2,2);
parameter.geometry = new THREE.SphereGeometry(1,parameter.widthSegment, parameter.heightSegment);

// const image = new Image();
// const texture = new THREE.Texture(image);
// image.addEventListener("load", () => {
//   texture.needsUpdate = true;
// });
// image.src = "./door.jpg";

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./textures/checkerboard-8x8.png");
// texture.repeat.x = 2;
// texture.wrapS = THREE.MirroredRepeatWrapping; 
// texture.repeat.y = 2;
// texture.wrapT = THREE.RepeatWrapping; 
// texture.offset.x = 0.5;
// texture.offset.y = 0.5;
// texture.center.x = 0.5
// texture.center.y = 0.5
// texture.rotation = Math.PI * 0.25
texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshBasicMaterial({map: texture});

// Creating the box: It combines gometry figure and its materials
parameter.mesh = new THREE.Mesh(parameter.geometry, material);

scene.add(parameter.mesh);

// Setting camera up
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

parameter.mesh.position.normalize()

const canvas = document.querySelector("canvas.webgl");

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

renderer.render(scene, camera);


const tick = () => {
  // camera.lookAt(mesh.position)

  control.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);

}

tick();

gui.add(parameter.mesh.position, 'y').min(-3).max(3).step(0.001).name("elevation");
gui.add(parameter.mesh, "visible");
gui.add(material, "wireframe");
gui.addColor(parameter, "color").onChange(() => {
  material.color.set(parameter.color);
});
gui.add(parameter, "spin");
gui.add(parameter, "widthSegment").max(64).min(0).step(0.1).onChange(() => {
  scene.remove(parameter.mesh);
  parameter.geometry = new THREE.SphereGeometry(1, parameter.widthSegment, parameter.heightSegment);
  parameter.mesh = new THREE.Mesh(parameter.geometry, material);
  scene.add(parameter.mesh);
});
gui.add(parameter, "heightSegment").max(64).min(0).step(0.1).onChange(() => {
  scene.remove(parameter.mesh);
  parameter.geometry = new THREE.SphereGeometry(1, parameter.widthSegment, parameter.heightSegment);
  parameter.mesh = new THREE.Mesh(parameter.geometry, material);
  scene.add(parameter.mesh);
});

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);

 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) canvas.requestFullscreen();
  else document.exitFullscreen();
});