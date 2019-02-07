/**
 * @author jonesjonathan
 */

import THREE from '../three';

export class Room {
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;

        this.render = this.render.bind(this);

        this.scene = new THREE.Scene();
    };

    _animate(timestamp) {}

    render(timestamp) {
        this._animate(timestamp);

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
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