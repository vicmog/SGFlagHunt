import * as THREE from 'three';

class Shape extends THREE.Object3D {
    
    constructor(shape){
        super();
        this.shape = shape;
        this.geometry = new THREE.ShapeGeometry(this.shape);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);
    }

    update(){
        
    }
}

export { Shape };