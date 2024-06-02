import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

// Spotlight Light
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.position.set(0,2,2);
scene.add(spotLight);
scene.add(spotLight.target);
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

scene.add(sphere, plane)

/**
 * Shadows
 */

directionalLight.castShadow = true;

sphere.castShadow = true;

plane.receiveShadow = true;

spotLight.castShadow = true;

// Shadow resolution
// Increasing shadow resolution
directionalLight.shadow.mapSize.width = 1024; // height and width should be equal
directionalLight.shadow.mapSize.height = 1024;
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

// Debugging shadow
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);

// // near and far props
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
console.log(directionalLight.shadow.camera);
// Amplitude
// The smaller the values the more accurate the shadow will be
// too small values may crop the shadow
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = - 2;
directionalLight.shadow.camera.left = - 2;

directionalLightCameraHelper.visible = false

// Shadow blur
directionalLight.shadow.radius = 10;


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()