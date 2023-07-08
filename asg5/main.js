import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  renderer.shadowMap.enabled = true;

  const view1Elem = document.querySelector('#view1');
  const view2Elem = document.querySelector('#view2');
  const view3Elem = document.querySelector('#view3');
  const view4Elem = document.querySelector('#view4');
  const view5Elem = document.querySelector('#view5');

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 450;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const camera3 = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const camera4 = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const camera5 = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);
  camera2.position.set(0, 10, 0);
  camera3.position.set(0, 10, 0);
  camera4.position.set(0, 10, 20);
  camera5.position.set(0, 10, -20);

  const controls = new OrbitControls(camera, view1Elem);
  controls.target.set(0, 5, 0);
  controls.update();

  const controls2 = new OrbitControls(camera2, view2Elem);
  controls2.target.set(50, 5, 0);
  controls2.update();

  const controls3 = new OrbitControls(camera3, view3Elem);
  controls3.target.set(-50, 5, 0);
  controls3.update();

  const controls4 = new OrbitControls(camera4, view4Elem);
  controls4.target.set(0, 5, 50);
  controls4.update();

  const controls5 = new OrbitControls(camera5, view5Elem);
  controls5.target.set(0, 5, -50);
  controls5.update();

  const scene = new THREE.Scene();
  {
    const color = 0xFFFFFF;  // white
    const near = 10;
    const far = 200;
    scene.fog = new THREE.Fog(color, near, far);
  }
  scene.background = new THREE.Color('black');

  {
    const planeSize = 150;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('images/dirt.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'images/posx.jpg',
      'images/negx.jpg',
      'images/posy.jpg',
      'images/negy.jpg',
      'images/posz.jpg',
      'images/negz.jpg',
    ]);
    scene.background = texture;
  }

  //directional/////////////////////////////////////////////////
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-5,2,42.2);
    light.target.position.set(-5,2,46);
    scene.add(light);
    scene.add(light.target);
  }

  { // Light Post by Zsky [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/lightpost/LightPole01.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/lightpost/LightPole01.obj', (root) => {
        root.scale.set(.1, .1, -.1)
        root.position.set(-5,2,42)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  
  { //hemisphere
    const skyColor = 0x00436a;
    const groundColor = 0x626262;
    const intensity = .7;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  
  //point/////////////////////////////////////////////////
  {
    const color = 0xFFFFFF;
    const intensity = .1; //0.1
    const light = new THREE.PointLight(color, intensity);
    light.position.set(57.5,3,-8)
    light.distance = 50;
    light.castShadow = true;
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = .1; //0.1
    const light = new THREE.PointLight(color, intensity);
    light.position.set(57.5,3,-14)
    light.distance = 50;
    light.castShadow = true;
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = .1; //0.1
    const light = new THREE.PointLight(color, intensity);
    light.position.set(3,3.5,-49)
    light.distance = 50;
    light.castShadow = true;
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = .1; //0.1
    const light = new THREE.PointLight(color, intensity);
    light.position.set(-10,3.5,-7.5)
    light.distance = 50;
    light.castShadow = true;
    scene.add(light);
  }
  //point/////////////////////////////////////////////////


  { //Lamp post by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/lamp/materials.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/lamp/model.obj', (root) => {
        root.scale.set(.2,.2,.2)
        root.position.set(-10,0.1,-7.5)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  //spotlight/////////////////////////////////////////////////
  {
    const color = 0x808080;
    const intensity = 1;
    const light = new THREE.SpotLight(color, intensity);
    light.angle = 45 * (Math.PI/180);
    light.position.set(30,3.2,2.5)
    light.target.position.set(30,-10,0)
    light.castShadow = true;
    scene.add(light);
    scene.add(light.target);
  }

  {
    const color = 0x808080;
    const intensity = 1;
    const light = new THREE.SpotLight(color, intensity);
    light.angle = 45 * (Math.PI/180);
    light.position.set(-30,3.2,-2.5)
    light.target.position.set(-30,-10,0)
    light.castShadow = true;
    scene.add(light);
    scene.add(light.target);
  }
  //spotlight/////////////////////////////////////////////////

  { //Road by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/road/materials.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/road/model.obj', (root) => {
        root.position.set(0,-0.21,0)
        root.scale.set(.5,.05,.05)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  { //Road by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/road/materials.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/road/model.obj', (root) => {
        root.position.set(0,-.211,12)
        root.rotation.y = 1.5708;
        root.scale.set(.62,.05,.05)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  { // Three way traffic light by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/traffic/StopLight_1370.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/traffic/StopLight_1370.obj', (root) => {
        root.position.set(3,0,3)
        root.scale.set(.04,.04,-.04)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  { // Three way traffic light by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/traffic/StopLight_1370.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/traffic/StopLight_1370.obj', (root) => {
        root.position.set(-3.5,0,-3)
        root.scale.set(.04,.04,.04)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }
  
  { // Three way traffic light by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/traffic/StopLight_1370.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/traffic/StopLight_1370.obj', (root) => {
        root.position.set(3,0,-3)
        root.rotation.y = 1.5708;
        root.scale.set(.04,.04,-.04)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  { // Three way traffic light by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/traffic/StopLight_1370.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/traffic/StopLight_1370.obj', (root) => {
        root.position.set(-3.5,0,3)
        root.rotation.y = 1.5708;
        root.scale.set(.04,.04,.04)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  { //Street Objects - Lamp Post by Ev Amitay [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/streetlight/materials.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/streetlight/model.obj', (root) => {
        root.position.set(30,2.5,3)
        root.scale.set(2,1,2)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  { //Street Objects - Lamp Post by Ev Amitay [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/streetlight/materials.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/streetlight/model.obj', (root) => {
        root.position.set(-30,2.5,-3)
        root.scale.set(2,1,-2)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  {
    const loader = new THREE.TextureLoader();
    const geometryCylinder = new THREE.CylinderGeometry( .5, .5, 1, 8 ); 
    let color = 0x5A5A5A
    const material = [
      new THREE.MeshPhongMaterial({map: loader.load('images/trash.jpg')}),
      new THREE.MeshPhongMaterial({color})
    ];
    const obj = new THREE.Mesh(geometryCylinder, material);
    obj.position.x = 29;
    obj.position.y = 0.5;
    obj.position.z = 3;
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj);
  }

  function makeTree(x, z) {
    const geometry = new THREE.ConeGeometry( 1, 3, 16);
    let color = 0x0D2908
    const material = new THREE.MeshPhongMaterial({color});
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(x,2,z)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)

    const geometryCube = new THREE.BoxGeometry( .5, 1, .5);
    color = 0x5C4033
    const materialCube = new THREE.MeshPhongMaterial({color});
    const obj2 = new THREE.Mesh(geometryCube, materialCube);
    obj2.position.set(x,0,z)
    obj2.castShadow = true;
    obj2.receiveShadow = true;
    scene.add(obj2)
  }

  for (let z = -5; z >= -15; z-=5) {
    for (let x = -5; x >= -15; x-=5) {
      makeTree(x, z)
    }
  }

  {
    const geometry = new THREE.BoxGeometry(15, .3, 50);
    let color = 0x000000
    const material = new THREE.MeshPhongMaterial({color});
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(57.5,0,0)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)
  }

  {
    const geometryCylinder = new THREE.CylinderGeometry( .3, .3, 8, 8 ); 
    let color = 0x5A5A5A
    const material = new THREE.MeshPhongMaterial({color});
    const obj = new THREE.Mesh(geometryCylinder, material);
    obj.position.x = 48.5;
    obj.position.y = 4;
    obj.position.z = 3;
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj);
  }

  function sign() {
    const loader = new THREE.TextureLoader();
    const width = 1;  // ui: width
    const height = 4;  // ui: height
    const depth = 10;  // ui: depth
    const geometry = new THREE.BoxGeometry( width, height, depth );
    let color = 0x5A5A5A
    const material = [
      new THREE.MeshPhongMaterial({map: loader.load('images/sign.jpg')}),
      new THREE.MeshPhongMaterial({map: loader.load('images/sign.jpg')}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
    ];
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(48.5,10,3)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)

    return obj;
  }

  {
    const geometry = new THREE.BoxGeometry(3, .3, 15);
    let color = 0x5A5A5A
    const material = new THREE.MeshPhongMaterial({color});
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(57.5,0.2,-11)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)
    
    color = 0x880808
    const material2 = new THREE.MeshPhongMaterial({color});
    const obj2 = new THREE.Mesh(geometry, material2);
    obj2.position.set(57.5,4.2,-11)
    obj2.castShadow = true;
    obj2.receiveShadow = true;
    scene.add(obj2)
  }

  {
    const geometryCylinder = new THREE.CylinderGeometry( .3, .3, 4, 8 ); 
    let color = 0x5A5A5A
    const material = new THREE.MeshPhongMaterial({color});
    const obj = new THREE.Mesh(geometryCylinder, material);
    obj.position.x = 57.5;
    obj.position.y = 2;
    obj.position.z = -5;
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj);

    const obj2 = new THREE.Mesh(geometryCylinder, material);
    obj2.position.x = 57.5;
    obj2.position.y = 2;
    obj2.position.z = -11;
    obj2.castShadow = true;
    obj2.receiveShadow = true;
    scene.add(obj2);

    const obj3 = new THREE.Mesh(geometryCylinder, material);
    obj3.position.x = 57.5;
    obj3.position.y = 2;
    obj3.position.z = -17;
    obj3.castShadow = true;
    obj3.receiveShadow = true;
    scene.add(obj3);
  }

  {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(.5, 2, 1.5);
    let color = 0xFFFFFF
    const material = [
      new THREE.MeshPhongMaterial({map: loader.load('images/fuel.jpg')}),
      new THREE.MeshPhongMaterial({map: loader.load('images/fuel.jpg')}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
    ];
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(57.5,1.25,-8)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)

    const obj2 = new THREE.Mesh(geometry, material);
    obj2.position.set(57.5,1.25,-14)
    obj2.castShadow = true;
    obj2.receiveShadow = true;
    scene.add(obj2)

    const geometry2 = new THREE.BoxGeometry(.5, .1, 1);
    color = 0xFFFFFF;
    const material2 = new THREE.MeshPhongMaterial({color});
    const obj3 = new THREE.Mesh(geometry2, material2);
    obj3.position.set(57.5,4.099,-8)
    scene.add(obj3)

    const obj4 = new THREE.Mesh(geometry2, material2);
    obj4.position.set(57.5,4.099,-14)
    scene.add(obj4)
  }

  {
    const geometry = new THREE.BoxGeometry(12, 4, 12);
    let color = 0xD3D3D3
    const material = new THREE.MeshPhongMaterial({color});
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(57.5,2,17)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)

    color = 0x5A5A5A
    const geometry2 = new THREE.BoxGeometry(1, 2, .1);
    const material2 = new THREE.MeshPhongMaterial({color});
    const obj2 = new THREE.Mesh(geometry2, material2);
    obj2.position.set(57.5,1,11)
    obj2.castShadow = true;
    obj2.receiveShadow = true;
    scene.add(obj2)

    color = 0x87CEEB
    const geometry3 = new THREE.BoxGeometry(5, 1.5, .1);
    const material3 = new THREE.MeshPhongMaterial({color});
    const obj3 = new THREE.Mesh(geometry3, material3);
    obj3.position.set(54.25,1.5,11)
    obj3.castShadow = true;
    obj3.receiveShadow = true;
    scene.add(obj3)

    const obj4 = new THREE.Mesh(geometry3, material3);
    obj4.position.set(60.75,1.5,11)
    obj4.castShadow = true;
    obj4.receiveShadow = true;
    scene.add(obj4)
  }

  
  { //Dumpster by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/dumpster/CHAHIN_DUMPSTER.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/dumpster/CHAHIN_DUMPSTER.obj', (root) => {
        root.scale.set(-.4,.4,.4)
        root.position.set(50.75,.75,12)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  { // Apartment building by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/apartment/Apartment.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/apartment/Apartment.obj', (root) => {
        root.scale.set(.5,.5,.5)
        root.position.set(0,0,-63.75)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
      objLoader.load('objects/apartment/Apartment.obj', (root) => {
        root.scale.set(.5,.5,.5)
        root.position.set(5,0,-63.75)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
      objLoader.load('objects/apartment/Apartment.obj', (root) => {
        root.scale.set(.5,.5,.5)
        root.position.set(-5,0,-63.75)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  { //Lamp post by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/lamp/materials.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/lamp/model.obj', (root) => {
        root.scale.set(.2,.2,.2)
        root.position.set(3,0.1,-49)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  {
    const geometry = new THREE.BoxGeometry(50, .3, 15);
    let color = 0x000000
    const material = new THREE.MeshPhongMaterial({color});
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(0,0,-57.5)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)
  }

  {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(4, 2, .3);
    let color = 0x01735C
    const material = [
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({color}),
      new THREE.MeshPhongMaterial({map: loader.load('images/sign2.jpg')}),
    ]
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(-5,2,46)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)
  }

  {
    const geometry = new THREE.BoxGeometry(.3, 2, .2);
    let color = 0x5A5A5A
    const material = new THREE.MeshPhongMaterial({color});
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(-4,1,46)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)

    const obj2 = new THREE.Mesh(geometry, material);
    obj2.position.set(-6,1,46)
    obj2.castShadow = true;
    obj2.receiveShadow = true;
    scene.add(obj2)
  }

  {
    const geometry = new THREE.BoxGeometry(15, .3, 50);
    let color = 0x000000
    const material = new THREE.MeshPhongMaterial({color});
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(-57.5,0,0)
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj)
  }

  { // Bank by Poly by Google [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/bank/Bank.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/bank/Bank.obj', (root) => {
        root.scale.set(0.0003, 0.0003, 0.0003)
        root.position.set(-44.5, 0, 8)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }

  { // Red Car by J-Toastie [CC-BY] via Poly Pizza
    const mtlLoader = new MTLLoader();
    mtlLoader.load('objects/RedCar/car.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('objects/RedCar/car.obj', (root) => {
        root.scale.set(2, 2, 2)
        root.position.set(54.5, 0.6, -8)
        root.castShadow = true;
        root.receiveShadow = true;
        scene.add(root);
      });
    });
  }
  
  const objs = [
    sign()
  ];


  function setScissorForElement(elem) { //code taken from three.js camera doc
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();
   
    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);
   
    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);
   
    // setup the scissor to only render to that part of the canvas
    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);
   
    // return the aspect
    return width / height;
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    resizeRendererToDisplaySize(renderer);

    // turn on the scissor
    renderer.setScissorTest(true);
 
    // render the original view
    {
      const aspect = setScissorForElement(view1Elem);
 
      // adjust the camera for this aspect
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
 
      // don't draw the camera helper in the original view
 
      // render
      renderer.render(scene, camera);
    }
 
    // render from the 2nd camera
    {
      const aspect = setScissorForElement(view2Elem);
 
      // adjust the camera for this aspect
      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();
 
      // draw the camera helper in the 2nd view
 
      renderer.render(scene, camera2);
    }

    // render from the 2nd camera
    {
      const aspect = setScissorForElement(view3Elem);
 
      // adjust the camera for this aspect
      camera3.aspect = aspect;
      camera3.updateProjectionMatrix();
 
      renderer.render(scene, camera3);
    }

    // render from the 2nd camera
    {
      const aspect = setScissorForElement(view4Elem);
 
      // adjust the camera for this aspect
      camera4.aspect = aspect;
      camera4.updateProjectionMatrix();
 
      renderer.render(scene, camera4);
    }

    // render from the 2nd camera
    {
      const aspect = setScissorForElement(view5Elem);
 
      // adjust the camera for this aspect
      camera5.aspect = aspect;
      camera5.updateProjectionMatrix();
 
      renderer.render(scene, camera5);
    }

    objs.forEach((obj, ndx) => {
      const speed = .6 + ndx * .1;
      const rot = time * speed;
      obj.rotation.y = rot;
    });

    //renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

main();
