import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextureLoader } from "three";

const textureLoader = new TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/7.png");

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

const fontLoader = new FontLoader();

// Setting camera up
const sizes = {
  witdh: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.witdh / sizes.height);
camera.position.z = 3;
scene.add(camera);

const canvas = document.querySelector("canvas.webgl");

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.witdh, sizes.height);

renderer.render(scene, camera);

const clock = new THREE.Clock();

const control = new OrbitControls(camera, canvas);
control.dampingFactor = true;

const tick = () => {
  control.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello Three.js", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     - textGeometry.boundingBox.max.x * 0.5,
  //     - textGeometry.boundingBox.max.y * 0.5,
  //     - textGeometry.boundingBox.max.z * 0.5
  // )

  // textGeometry.translate(
  //   - (textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
  //   - (textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
  //   - (textGeometry.boundingBox.max.z - 0.03) * 0.5  // Subtract bevel thickness
  // )

  textGeometry.center();
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, material);

  scene.add(text);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    const scale = Math.random()
    donut.scale.set(scale, scale, scale)
    scene.add(donut);
  }
});

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
