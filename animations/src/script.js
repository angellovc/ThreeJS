import * as THREE from 'three';
import gsap from "gsap";


const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});

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
  witdh: 800,
  height: 600
};

const camera = new THREE.PerspectiveCamera(75, sizes.witdh / sizes.height);
camera.position.z = 3;
scene.add(camera);

console.log(mesh.position.distanceTo(camera.position));
mesh.position.normalize()

const canvas = document.querySelector("canvas.webgl");

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.witdh, sizes.height);

renderer.render(scene, camera);

// let time = Date.now();
const clock = new THREE.Clock();


gsap.to(mesh.position, { duration: 1, delay: 2, x: 2 });
const tick = () => {


  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;
  // mesh.rotation.y += 0.001 * deltaTime;

  // mesh.rotation.y = clock.getElapsedTime();

  // mesh.position.x = Math.cos(clock.getElapsedTime());
  // mesh.position.y = Math.sin(clock.getElapsedTime());
  // camera.lookAt(mesh.position)
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// setInterval(() => {
//   camera.lookAt(mesh.position);
//   // mesh.translateZ(0.2);
//   mesh.translateX(0.2);
//   mesh.rotation.y += 0.1;
//   renderer.render(scene, camera);
//   // console.log("hello")
// },1000 / 60);