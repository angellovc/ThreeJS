import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Models
 */
const gltfLoader = new GLTFLoader();
let duckModel = null;
gltfLoader.load('./models/Duck/glTF-Binary/Duck.glb',
(gltf) => {
    duckModel = gltf.scene;
    gltf.scene.position.y = -1.2;
    scene.add(gltf.scene);
});


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.9);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1);
directionalLight.position.set(1,2,3);
scene.add(directionalLight);

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-3,0,0);
// const rayDirection = new THREE.Vector3(10,0,0);
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);
// const intersecs = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersecs);
// const intersec = raycaster.intersectObject(object3);
// console.log(intersec);

const mouse = new THREE.Vector2(0,0);




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let currentIntersection = null;
let mousePressed = false;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    raycaster.setFromCamera(mouse, camera);

    const rubberDuck = duckModel && raycaster.intersectObject(duckModel);
    rubberDuck?.length > 0? duckModel?.scale?.set(1.2,1.2,1.2): duckModel?.scale.set(1,1,1);
    const intersectedObjects = raycaster.intersectObjects([object1, object2, object3]).map(({object}) => object);
    currentIntersection = intersectedObjects[0];
    [object1,object2,object3].forEach(object=>  {
        object.material.color.set(intersectedObjects.includes(object)? '#0000ff':'#ff0000')
    });
        // object.material.color.set(intersectedObjects.includes(object)? '#0000ff':'#ff0000'));
    
    mousePressed && currentIntersection?.material?.color?.set("#AADCEE");
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
    // console.log(mouse);

});

window.addEventListener('mousedown', () => {
    mousePressed = true
});

window.addEventListener('mouseup', () => {
    mousePressed = false
});


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
