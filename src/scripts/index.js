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
    viewAngle   : 100,
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
    camera.position.set(0, 0, 4);
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);
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

    geometry = new THREE.BoxGeometry(1, 1);
    material = new THREE.MeshBasicMaterial({wireframe : true, color : 0xffffff});

    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, 0);
    mesh.name = "default-box";

    objects.push(mesh);

    //Room
    geometry = new THREE.BoxGeometry(10, 4, 10, 25, 25, 25);
    material = new THREE.MeshLambertMaterial({color : 0x4286f4, side : THREE.BackSide});
    mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Room";

    mesh.receiveShadow = true;

    objects.push(mesh);

    addToScene(objects);
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

    addToScene(lights);
}

/**
 * 
 * @param {THREE.Object3D[]} objects 
 */
function addToScene(objects) {
    objects.forEach(function(mesh) {
        scene.add(mesh);
        console.log(mesh);
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
    requestAnimationFrame(animate);
}

window.onload = init;