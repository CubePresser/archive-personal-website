/**
 * @author jonesjonathan
 */

import THREE from '../three';
import {Room} from './room';

import { Reactor } from "./reactor";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { ifError } from 'assert';
const rooms = [
    Reactor
];

const CAMERA_SETTINGS = {
    viewAngle   : 50,
    near        : 0.1,
    far         : 1000
};

const numPanels = rooms.length;

export class Home extends Room {
    /**
     * 
     * @param {THREE.WebGLRenderer} renderer 
     * @param {THREE.PerspectiveCamera} camera 
     */
    constructor(renderer) {
        super(renderer);

        /** @type {THREE.PerspectiveCamera} */
        this.camera;

        /** @type {THREE.OrbitControls} */
        this.controls;

        /** @type {THREE.Raycaster} */
        this.raycaster;
        /** @type {THREE.Object3D}*/
        this.intersection;

        this.mouse = new THREE.Vector2(-100, -100);
        this.mouseDown = false;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp   = this.onMouseUp.bind(this);
        this.onDblClick  = this.onDblClick.bind(this);

        /** @type {THREE.Group} */
        this._roomPanels;

        this._initCamera();
        this._createControls();
        this._initRaycaster();

        this._initGeometry();

        this._initEventListeners();
    }

    _initCamera() {
        const gl = this.renderer.context;
        this.camera = new THREE.PerspectiveCamera(
            CAMERA_SETTINGS.viewAngle, 
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            CAMERA_SETTINGS.near,
            CAMERA_SETTINGS.far
        );
        this.camera.position.set(0, 0, (numPanels * 2) + 10);
        this.camera.updateProjectionMatrix();

        this.scene.add(this.camera);
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

        this.controls = controls;
    }

    _initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 20;
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

            //Make name of this panel equal to the name of the constructor for that room
            clone.name = rooms[i].name;

            //Add room constructor to this panel
            clone.construct = rooms[i];

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

    _initEventListeners() {
        this._addEventListener(window, 'mousemove', this.onMouseMove);
        this._addEventListener(window, 'mousedown', this.onMouseDown);
        this._addEventListener(window, 'mouseup', this.onMouseUp);
        this._addEventListener(window, 'dblclick', this.onDblClick);
    }
    
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseDown(event) {
        if(event.which == 1 && this.intersection) { 
            this.mouseDown = true; 
        }
    }

    onMouseUp(event) {
        if(event.which == 1 && this.mouseDown && this.intersection) {
            this.intersection.material.color.set(0x00ff00);
        }
    }

    onDblClick() {
        if(this.intersection) {
            this.changeRoom(this.intersection.construct);
        }
    }

    _rayEvaluate() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this._roomPanels.children);

        if(intersects.length) {
            this.intersection = intersects[0].object;
        } else {
            if(this.intersection) { this.intersection.material.color.setRGB(0.5, 0.5, 0.5); }
            this.intersection = null;
        }
    }

    //Called externally, updates scene every frame
    _animate(timestamp) {
        const delta = this.clock.getDelta();
        this._rayEvaluate();
        this.controls.update();
    }
};