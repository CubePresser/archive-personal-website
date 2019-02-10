/**
 * @author jonesjonathan
 */

import THREE from './three';
import {Room} from './scenes/room';
import {Home} from './scenes/home';

class Site {
    constructor() {
        /** @type {Room} */
        this.currentRoom;

        /** @type {THREE.WebGLRenderer} */
        this.renderer;

        /** @type {HTMLElement} */
        this.container;
        this.width;
        this.height;

        this.getContainer();
        this.createRenderer();

        this.initEventListeners();

        this.currentRoom = new Home(this.renderer);
        this.currentRoom.render();
    }

    getContainer() {
        this.container = document.getElementById('container');
        this.getDimensions();
    }

    getDimensions() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.container.appendChild(this.renderer.domElement);
    }

    initEventListeners() {
        this.onWindowResize = this.onWindowResize.bind(this);

        window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('changeRoom', this.onChangeRoom.bind(this), true);
    }

    onWindowResize(event) {
        this.getDimensions();
        this.currentRoom.updateCameraAspect(this.width / this.height);
        this.renderer.setSize(this.width, this.height);
    }

    onChangeRoom(event) {
        this.currentRoom.isActive = false;
        this.currentRoom = new event.detail(this.renderer, this.camera);
        this.currentRoom.render();
    }
}
  
new Site();