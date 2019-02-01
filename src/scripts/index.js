/**
 * @author jonesjonathan
 */

const SETTINGS = {
    lights : {
        enabled     : true,
        ambient     : true,
        point       : true
    }
};

const CAMERA_SETTINGS = {
    viewAngle   : 70,
    near        : 0.1,
    far         : 1000
};

//Utility globals

/** @type {THREE.Scene} */
    let scene;

/** @type {THREE.PerspectiveCamera}*/
    let camera;

/** @type {THREE.WebGLRenderer} */
    let renderer;

/** @type {HTMLElement} */
    let container;

/** @type {THREE.OrbitControls} */
    let controls;

let height;
let width;
let aspect;

/**
 * Initialize website graphics
 */
function init() {
    getContainer();

    createCamera();
    createRenderer();

    createControls();

    createScene();

    initEventListeners();

    requestAnimationFrame(animate);
}

/**
 * 
 */
function getContainer() {
    container = document.getElementById("container");
    getDimensions();
}

function getDimensions() {
    width = container.clientWidth;
    height = container.clientHeight;
    aspect = width / height;
}

function createCamera() {
    camera = new THREE.PerspectiveCamera(CAMERA_SETTINGS.viewAngle, aspect, CAMERA_SETTINGS.near, CAMERA_SETTINGS.far);
    camera.position.set(0, 0, 5);
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);
}

function createControls() {
    controls = new THREE.OrbitControls( camera );  
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.maxPolarAngle = 1.39626;
    controls.minPolarAngle = 1.39626;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.05;
}

function createScene() {
    scene = new THREE.Scene();

    initGeometry();

    if(SETTINGS.lights.enabled)
        initLighting();
}

function initGeometry() {
    
    /** @type {THREE.Object3D[]} */
    let objects = [];

    let geometry;
    let material;
    let mesh;

    let room = new THREE.Group();

    //Room
    geometry = new THREE.BoxGeometry(10, 4, 10, 25, 25, 25);
    material = new THREE.MeshLambertMaterial({color : 0x4286f4, side : THREE.BackSide});
    mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Room";

    room.add(mesh);

    geometry = new THREE.CylinderGeometry(0.25, 1.5, 10, 12, 10);
    material = new THREE.MeshLambertMaterial({color : 0x4286f4});
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(-5, 0, -5);

    room.add(mesh);

    mesh = mesh.clone();
    mesh.position.set(5, 0, -5);

    room.add(mesh);

    mesh = mesh.clone();
    mesh.position.set(5, 0, 5);

    room.add(mesh);

    mesh = mesh.clone();
    mesh.position.set(-5, 0, 5);

    room.add(mesh);

    objects.push(room);

    addObjectsToScene(objects);
}

function initLighting() {
    let lights = [];

    if(SETTINGS.lights.ambient) {
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        lights.push(ambientLight);
    }

    if(SETTINGS.lights.point) {
        let pointLight = new THREE.PointLight(0xffffff, 0.8, 7.5, 1);
        pointLight.position.set(0, 0, 0);
        lights.push(pointLight);
    }

    addObjectsToScene(lights);
}

/**
 * 
 * @param {THREE.Object3D[]} objects 
 */
function addObjectsToScene(objects) {
    objects.forEach(function(mesh) {
        scene.add(mesh);
    });
}

function initEventListeners() {
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize(event) {
    getDimensions();
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function animate() {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(animate);
}

window.onload = init;