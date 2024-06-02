import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0xEEEEEE});

// Creating the box: It combines gometry figure and its materials
const mesh = new THREE.Mesh(geometry, material);
// mesh.position.z = 1
// mesh.position.x = 1
// mesh.position.y = 1

// mesh.scale.x = 2
// mesh.scale.y = 0.25
// mesh.scale.z = 1

scene.add(mesh);

// Setting camera up
const sizes = {
  width: 800,
  height: 600
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);
// const aspectRatio = sizes.width / sizes.height
// console.log(aspectRatio);
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio,1 * aspectRatio,1,-1,1, 100);
camera.position.z = 3;

camera.position.z = 3;
scene.add(camera);

// console.log(mesh.position.distanceTo(camera.position));
mesh.position.normalize()

const canvas = document.querySelector("canvas.webgl");

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);

const clock = new THREE.Clock();

const cursorCoordinates = {
  x: 0,
  y: 0
};

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
// controls.update();

const tick = () => {

  mesh.rotation.x = cursorCoordinates.x;
  mesh.rotation.y = cursorCoordinates.y;
  mesh.position.y = cursorCoordinates.x * -1;
  mesh.position.x = cursorCoordinates.y;
  // camera.position.x = Math.sin(cursorCoordinates.x * Math.PI * 2) * 2; 
  // camera.position.z = Math.cos(cursorCoordinates.x * Math.PI * 2) * 2; 
  // camera.position.y = cursorCoordinates.y * 3
  // camera.lookAt(mesh.position)

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();

window.addEventListener("mousemove", (event) => {
  cursorCoordinates.y = event.clientX / sizes.width - 0.5;
  cursorCoordinates.x = event.clientY / sizes.height - 0.5;
});

window.addEventListener("mouseup", (event) => {
  mesh.material.color.set(0xEEEEEE);
  console.log("click")
});

window.addEventListener("mousedown", () => {
  mesh.material.color.set(0xff0000);
  console.log("stop click")
})