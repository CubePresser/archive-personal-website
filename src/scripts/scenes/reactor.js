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
    lights : {
        enabled     : true,
        ambient     : true,
        point       : true
    }
};

export class Reactor extends Room {
    constructor(renderer) {
        super(renderer);

        this._initCamera();

        /** @type {THREE.OrbitControls} */
        this.controls = this._createControls();

        /** @type {THREE.PointLight} */
        this.pointLight;

        /** @type {THREE.Group} */
        this.cubes;

        this._createControls();
        this._initGeometry();

        this._initLighting();
        this._initEventListeners();
    }

    /** 
     * Create and initialize values for scene camera
    */
    _initCamera() {
        const gl = this.renderer.context;
        this.camera = new THREE.PerspectiveCamera(
            CAMERA_SETTINGS.viewAngle, 
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            CAMERA_SETTINGS.near,
            CAMERA_SETTINGS.far
        );
        this.camera.position.set(0, 0, 5);
        this.camera.updateProjectionMatrix();
    }

    /**
     * Initialize orbit controls
     */
    _createControls() {
        const controls = new THREE.OrbitControls( this.camera );  
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.maxPolarAngle = 1.39626;
        controls.minPolarAngle = 1.39626;
        controls.dampingFactor = 0.1;
        controls.rotateSpeed = 0.022;

        return controls;
    }

    /**
     * Generates all meshes for the scene
     * Adds all meshes to the scene
     */
    _initGeometry() {
        this._initRoom();
        this._initCubes();
    }

    /**
     * Generates room mesh
     */
    _initRoom() {
        let geometry;
        let material;
        let mesh;
    
        let room = new THREE.Group();
    
        //Room objects
        geometry = new THREE.BoxGeometry(10, 4, 10, 15, 15, 15);
        material = new THREE.MeshLambertMaterial({color : 0x4286f4, side : THREE.BackSide});
        mesh = new THREE.Mesh(geometry, material);
        mesh.name = "Room";
    
        room.add(mesh);
    
        // TODO: Write a shader so that the interior wireframe fades into being visible as it gets farther away
        room.add(this._createWireframe(mesh, 0x4286f4, false));
    
        geometry = new THREE.CylinderGeometry(0.25, 1.5, 10, 12, 10);
        material = new THREE.MeshLambertMaterial({color : 0x4286f4});
        mesh = new THREE.Mesh(geometry, material);

        //Pillars
        for(let i = -1; i < 2; i += 2) {
            for(let k = -1; k < 2; k += 2) {
                mesh = mesh.clone();
                mesh.position.set(5*i, 0, 5*k);
    
                room.add(mesh);
                room.add(this._createEdgeframe(mesh, 0x4286f4));
            }
        }
    
        material = new THREE.MeshLambertMaterial({color : 0x4286f4, emissive : 0x4286f4, emissiveIntensity : 0.2});
    
        //Top cylinder
        geometry = new THREE.CylinderGeometry(2, 0.25, 2, 12, 10);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 2, 0);
    
        room.add(mesh);
        room.add(this._createEdgeframe(mesh, 0x4286f4));
        
        //Bottom cylinder
        geometry = new THREE.CylinderGeometry(0.25, 2, 2, 12, 10);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, -2, 0);
    
        room.add(mesh);
        room.add(this._createEdgeframe(mesh, 0x4286f4));
    
        this.scene.add(room);
    }

    /**
     * Create cube mesh
     * Global cube vals
     */
    _initCubes() {
        this.cubes = new THREE.Group();
    
        let geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5, 10, 10, 10);
        let material = new THREE.MeshStandardMaterial({color : 0xf4b042});
    
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, -0.2, -2);
    
        this.cubes.add(mesh);
        this.cubes.add(this._createEdgeframe(mesh, 0xffffff))
    
        mesh = mesh.clone(false);
        mesh.rotateY(3.14159);
        mesh.position.set(0, -0.2, 2);
    
        this.cubes.add(mesh);
        this.cubes.add(this._createEdgeframe(mesh, 0xffffff))
        
        this.scene.add(this.cubes);
    }

    /**
     * Initalizes lighting objects for the scene.
     * Adds lights to scene
     */
    _initLighting() {
        let lights = [];
    
        if(SETTINGS.lights.ambient) {
            let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            lights.push(ambientLight);
        }
    
        if(SETTINGS.lights.point) {
            this.pointLight = new THREE.PointLight(0xffffff, 0.8, 7.5, 1);
            this.pointLight.position.set(0, 0, 0);
            lights.push(this.pointLight);
        }
    
        this._addObjectsToScene(lights);
    }

    /**
     * Called externally, updates scene every frame
     * @param {Number} timestamp 
     */
    _animate(timestamp) {
        let delta = this.clock.getDelta();
        //Pulsing point light
        this.pointLight.intensity = 0.3 * Math.abs(Math.sin(timestamp * 0.001)) + 0.5;

        //Rotate link cubes
        this.cubes.children.forEach(function(cube) {
            cube.rotateX(delta);
        });
    
        this.controls.update();
    }
};