/**
 * @author jonesjonathan
 */

import THREE from '../three';
import {Room} from './room';

const SETTINGS = {

};

export class Template extends Room {
    constructor(renderer, camera) {
        super(renderer, camera);
    }

    //Called externally, updates scene every frame
    _animate(timestamp) {
        //Update objects here
    }
};