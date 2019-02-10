/**
 * @author jonesjonathan
 */

import THREE from './three';
import {Room} from './scenes/room';
import {rooms} from './scenes';

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

        this.currentRoom = new rooms[0](this.renderer, this.camera);
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
        this.camera = new THREE.PerspectiveCamera(50, this.aspect, 0.01, 1000);
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