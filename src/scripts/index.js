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

    /**
     * Get DOM container that will hold the site renderer
     */
    getContainer() {
        this.container = document.getElementById('container');
        this.getDimensions();
    }

    /**
     * Gets the dimensions of the container that holds the site renderer
     */
    getDimensions() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
    }

    /**
     * Creates a WebGLRenderer for use across all rooms on the site
     * Sets renderer pixel ratio based on connected device
     */
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.container.appendChild(this.renderer.domElement);
    }

    /**
     * Initializes global event listeners for site
     */
    initEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        window.addEventListener('changeRoom', this.onChangeRoom.bind(this), true);
        window.onpopstate = this.onPopState.bind(this);
    }

    /**
     * Updates camera aspect ratio and resizes rendering framebuffer on window resize
     * @param {Event} event 
     */
    onWindowResize(event) {
        this.getDimensions();
        this.currentRoom.updateCameraAspect(this.width / this.height);
        this.renderer.setSize(this.width, this.height);
    }

    /**
     * Changes the room back to the home page whenever the back button is pressed in the browser
     */
    onPopState() {
        this.onChangeRoom({detail : Home});
    }

    /**
     * Removes all event listeners associated with current room
     * Stops the current room's rendering loop
     * Creates a new current room from the constructor passed in the event detail
     * Begins render loop for new room.
     * @param {CustomEvent} event 
     */
    onChangeRoom(event) {
        this.currentRoom.removeEventListeners();
        this.currentRoom.isActive = false;
        this.currentRoom = new event.detail(this.renderer, this.camera);
        this.currentRoom.render();
    }
}
  
new Site();