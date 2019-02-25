/**
 * @author jonesjonathan
 */

import THREE from '../three';
import {Room} from './room';

const CAMERA_SETTINGS = {
    viewAngle   : 50,
    near        : 0.1,
    far         : 1000
};

const SETTINGS = {

};

export class Template extends Room {
    constructor(renderer) {
        super(renderer);

        /** @type {THREE.PerspectiveCamera} */
        this.camera;
    }

    /** 
     * Create an initialize values for scene camera
    */
    _initCamera() {
        const gl = this.renderer.context;
        this.camera = new THREE.PerspectiveCamera(
            CAMERA_SETTINGS.viewAngle, 
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            CAMERA_SETTINGS.near,
            CAMERA_SETTINGS.far
        );
        
        this.scene.add(this.camera);
    }

    /**
     * Initializes all event listeners associated with this room
     */
    _initEventListeners() {
        // TODO: Add event listeners using _addEventListener
        // this._addEventListener({target}, {'event_name'}, {callback});
    }

    /**
     * Called externally, updates scene every frame
     * @param {Number} timestamp 
     */
    _animate(timestamp) {
        // TODO: Update scene objects here
    }
};