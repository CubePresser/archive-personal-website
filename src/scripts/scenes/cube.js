/**
 * @author jonesjonathan
 */

import THREE from '../three';
import {Room} from './room';

const SETTINGS = {
    
};

export class Cube extends Room{
    constructor(renderer, camera) {
        super(renderer, camera);

        this.camera.position.set(0, 0, 5);
        /** @type {THREE.Mesh} */
        this.cube;

        this._initGeometry();
    }

    _initGeometry() {
        let geometry = new THREE.BoxGeometry(1, 1, 0.1);
        let material = new THREE.MeshStandardMaterial({color : 0xaf0249});

        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.scene.add(this._createEdgeframe(this.cube, 0xff0000));

        let hemLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 1 );
        hemLight.position.set(0, 3, 3);
        this.scene.add(hemLight);
    }

    //Called externally, updates scene every frame
    _animate(timestamp) {
        let time = timestamp / 1000;
		
        let value = Math.sin( time * 0.567) +
        Math.sin( time * 2.345) +
        Math.sin( time * 1.456);
        
        value *= Math.sin( time * 0.123 );

        let object = this.cube;
        object.scale.x = object.scale.y = value * 0.25 + 0.7;
        object.rotation.z = value;
        object.material.emissive.r = Math.pow( value, 6.0 ) / 50.0;
        object.material.emissive.b = Math.pow( value, 2.0 ) / 10.0;
	
	    this.scene.rotation.x = time / 9.0;
	    this.scene.rotation.y = time / 8.0;
    }
};