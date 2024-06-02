import * as THREE from 'three';

const main = () => {
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

  const fov = 75; // field of view 
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  const scene = new THREE.Scene();
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new THREE.MeshPhongMaterial({color: 0xfffff});
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  renderer.render(scene, camera)



  setInterval(() => {
        const time = 0.01;
        cube.rotation.x += time;
        cube.rotation.y += time;
        
        
      const pixelRatio = window.devicePixelRatio;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
  }, 1000 / 60);

}

main();


// window.onload = main;