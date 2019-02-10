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

const numPanels = 10;

export class Selection extends Room {
    /**
     * 
     * @param {THREE.WebGLRenderer} renderer 
     * @param {THREE.PerspectiveCamera} camera 
     */
    constructor(renderer, camera) {
        super(renderer, camera);

        this._initCamera();

        //Room Panels
        this._roomPanels;
        this._initGeometry();

        this._controls = this._createControls();
    }

    _initCamera() {
        this.camera.fov = CAMERA_SETTINGS.viewAngle;
        this.camera.near = CAMERA_SETTINGS.near;
        this.camera.far = CAMERA_SETTINGS.far;
        this.camera.position.set(0, 0, (numPanels * 2) + 10);
        this.camera.updateProjectionMatrix();

        this.scene.add(this.camera);
    }

    _initGeometry() {
        const groundGeo = new THREE.PlaneBufferGeometry(1000, 1000);
        const groundMat = new THREE.MeshPhongMaterial();
        groundMat.color.setRGB(1, 1, 1);

        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -10;
        ground.rotation.x = -(Math.PI / 2);
        this.scene.add(ground);

        this._initLinks();
        this._initLights();
    }

    _initLinks() {
        this._roomPanels = new THREE.Group();

        const panelGeo = new THREE.BoxBufferGeometry(6, 5, 0.25, 10, 10, 5);
        const panelMat = new THREE.MeshPhongMaterial();
        panelMat.color.setRGB(0.5, 0.5, 0.5);

        const panel = new THREE.Mesh(panelGeo, panelMat);

        for(let i = 0; i < numPanels; i++) {
            const rotOffset = ( (2 * Math.PI) / (numPanels) ) * i;
            const clone = panel.clone();
            clone.rotateY(rotOffset);
            clone.translateZ(numPanels * 2);
            clone.name = "panel-" + i;
            this._roomPanels.add(clone);
        }

        this.scene.add(this._roomPanels);
    }

    _initLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        ambient.color.setRGB(0.5, 0.5, 0.5);
        this.scene.add(ambient);

        const centerPointLight = new THREE.PointLight(0xffffff, 1, numPanels * 5);
        centerPointLight.position.set(0, numPanels, 0);
        this.scene.add(centerPointLight);

        const cameraPointLight = new THREE.PointLight(0xffffff, 1.5, 50);
        this.camera.add(cameraPointLight);
    }

    _createControls() {
        const controls = new THREE.OrbitControls( this.camera );  
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = Math.PI / 2;
        controls.dampingFactor = 0.1;
        controls.rotateSpeed = 0.1 / numPanels;

        return controls;
    }

    //Called externally, updates scene every frame
    _animate(timestamp) {
        const delta = this.clock.getDelta();
        //this._roomPanels.rotation.y += Math.PI / numPanels * delta;
        this._controls.update();
    }
};