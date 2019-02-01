/**
 * @author jonesjonathan
 */

const CAMERA_SETTINGS = {
    viewAngle   : 100,
    near        : 0.1,
    far         : 1000
};

//Utility globals
let
    scene,
    camera,
    renderer,
    container,

    height,
    width,
    aspect
;

//Object globals
let
    centerBox
;

function init() {
    getContainer();

    createCamera();
    createRenderer();

    createScene();

    initEventListeners();

    requestAnimationFrame(animate);
}

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
}

function initGeometry() {
    let objects = [];

    let geometry;
    let material;
    let mesh;

    geometry = new THREE.BoxGeometry(1, 1);
    material = new THREE.MeshBasicMaterial({wireframe : true, color : 0xffffff});

    mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, 0);
    objects.push(mesh);

    //Room
    geometry = new THREE.BoxGeometry(10, 4, 10);
    material = new THREE.MeshLambertMaterial({color : 0x4286f4, side : THREE.BackSide});
    mesh = new THREE.Mesh(geometry, material);

    mesh.receiveShadow = true;

    objects.push(mesh);

    //TODO: PLACE THIS SOMEWHERE ELSE
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    objects.push(ambientLight);

    let pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 3.8, 0);
    objects.push(pointLight);

    addToScene(objects);
}

/**
 * 
 * @param {THREE.Mesh[]} objects 
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

init();