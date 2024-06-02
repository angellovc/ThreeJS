console.log(THREE);


const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});

// Creating the box: It combines gometry figure and its materials
const mesh = new THREE.Mesh(geometry, material);


scene.add(mesh);

// Setting camera up
const sizes = {
  witdh: 800,
  height: 600
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