/**
 * @author jonesjonathan
 */

import THREE from './three';
import {Room} from './scenes/room';
import {Home} from './scenes/home';

const CAMERA_SETTINGS = {
    viewAngle   : 70,
    near        : 0.1,
    far         : 1000
};

class Site {
    constructor() {
        /** @type {Room} */
        this.currentRoom;

        /** @type {THREE.WebGLRenderer} */
        this.renderer;

        /** @type {THREE.PerspectiveCamera} */
        this.camera;
        this.aspect;

        /** @type {HTMLElement} */
        this.container;
        this.width;
        this.height;

        this.getContainer();
        this.createRenderer();
        this.createCamera();

        this.initEventListeners();

        this.currentRoom = new Home(this.renderer, this.camera);
        this.currentRoom.render();
    }

    getContainer() {
        this.container = document.getElementById('container');
        this.getDimensions();
    }

    getDimensions() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.aspect = this.width / this.height;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.container.appendChild(this.renderer.domElement);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(CAMERA_SETTINGS.viewAngle, this.aspect, CAMERA_SETTINGS.near, CAMERA_SETTINGS.far);
    }

    initEventListeners() {
        this.onWindowResize = this.onWindowResize.bind(this);

        window.addEventListener('resize', this.onWindowResize, false);
    }

    onWindowResize(event) {
        this.getDimensions();
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize(this.width, this.height);
    }
}

new Site();