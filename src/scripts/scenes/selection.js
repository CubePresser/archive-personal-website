/**
 * @author jonesjonathan
 */

import THREE from '../three';
import {Room} from './room';

const SETTINGS = {
    rooms : 3
};

export class Selection extends Room {
    constructor(renderer, camera) {
        super(renderer, camera);

        this.camera.position.set(0, 0, 20);

        //Room Panels
        this._roomPanels;
        this._initGeometry();
    }

    _initGeometry() {
        this._initLinks();
    }

    _initLinks() {
        this._roomPanels = new THREE.Group();

        const geometry = new THREE.BoxGeometry(10, 10, 1);

        for(let i = 0; i < SETTINGS.rooms; i++) {
            //TODO: Change this to a shader material and provide
            //With a camera render to texture
            const material = new THREE.MeshBasicMaterial({color : 0xf0f0f0});

            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = "Link-"+i;

            //Set position in the circle
            mesh.position.set(0, 0, 10);

            this._roomPanels.add(mesh);

            this.scene.add(this._roomPanels);
        }
    }

    //Called externally, updates scene every frame
    _animate(timestamp) {
        //Update objects here
        this.scene.rotation.y += 0.01;
    }
};