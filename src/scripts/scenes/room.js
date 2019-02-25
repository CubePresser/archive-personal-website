/**
 * @author jonesjonathan
 */

import THREE from '../three';

export class Room {

    constructor(renderer) {
        /** @type {THREE.WebGLRenderer} */
        this.renderer = renderer;
        this.render = this.render.bind(this);

        /** @type {THREE.Scene} */
        this.scene = new THREE.Scene();
        this.isActive = true;

        /** @type {THREE.Clock} */
        this.clock = new THREE.Clock(true);

        //Holds all event listeners associated with the current room
        this.eventListeners = [];
    };

    /** 
     * Create and initialize values for scene camera
    */
    _initCamera() {}

    /**
     * Initializes all event listeners associated with this room
     */
    _initEventListeners() {}

    /**
     * Called in render, defined in child, updates scene objects every frame
     * @param {Number} timestamp 
     */
    _animate(timestamp) {}

    /**
     * 
     * @param {HTMLElement} target 
     * @param {String} type 
     * @param {Function} listener 
     */
    _addEventListener(target, type, listener) {
        target.addEventListener(type, listener);
        this.eventListeners.push({
            target : target,
            type : type,
            listener : listener
        });
    }

    /**
     * Removes all event listeners associated with this room
     */
    removeEventListeners() {
        for(let i = 0; i < this.eventListeners.length; i++) {
            const eventListener = this.eventListeners[i];
            eventListener.target.removeEventListener(
                eventListener.type,
                eventListener.listener
            );
        }
    }

    updateCameraAspect(aspect) {
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }

    changeRoom(construct, name) {
        //Remove all associated event listeners when moving to the next room so they don't carry over
        const event = new CustomEvent('changeRoom', {detail : construct});

        const newPath = "/#" + name;
        window.history.pushState({}, newPath, window.location.origin + newPath);

        window.dispatchEvent(event);
    }

    render(timestamp) {
        if(this.isActive) {
            this._animate(timestamp);
            this.renderer.render(this.scene, this.camera);
            return requestAnimationFrame(this.render);
        }
        return null;
    }

    /**
     * 
     * @param {THREE.Object3D[]} objects 
     */
    _addObjectsToScene(objects) {
        objects.forEach((mesh) => {
            this.scene.add(mesh);
        });
    }

    /**
     * Creates a wireframe mesh of the given mesh
     * @param   {THREE.Mesh} mesh
     * @param   {THREE.Color} color
     * @param   {bool} interior - True : Interior - False : Exterior
     * @returns {THREE.LineSegments} THREE.LineSegments
     */
    _createWireframe(mesh, color, interior) {
        let geo = new THREE.WireframeGeometry(mesh.geometry);

        let mat = new THREE.LineBasicMaterial({color : color});

        let wireframe = new THREE.LineSegments(geo, mat);

        wireframe.scale.copy(mesh.scale);

        if(interior)
            wireframe.scale.multiplyScalar(0.999);
        else
            wireframe.scale.multiplyScalar(1.001);

        wireframe.rotation.copy(mesh.rotation);
        wireframe.position.copy(mesh.position);
        return wireframe;
    }

    /**
     * Creates an outline of the edges on a given mesh
     * @param   {THREE.Mesh} mesh 
     * @param   {THREE.Color} color 
     * @returns {THREE.LineSegments} THREE.LineSegments
     */
    _createEdgeframe(mesh, color)
    {
        let geo = new THREE.EdgesGeometry(mesh.geometry);

        let mat = new THREE.LineBasicMaterial({color : color});
        
        let edges = new THREE.LineSegments(geo, mat);

        edges.scale.copy(mesh.scale);
        edges.rotation.copy(mesh.rotation);
        edges.position.copy(mesh.position);
        return edges;
    }
};