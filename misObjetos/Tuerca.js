import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';


class Tuerca extends THREE.Object3D {
    constructor(){
        super();
        var material = new THREE.MeshNormalMaterial();
        material.flatShading = true;
        material.needsUpdate = true;

        var geomtriaTuerca = new THREE.CylinderGeometry(2, 2, 1.75, 6);

        var tuboHuecoGeometry = new THREE.CylinderGeometry(1.25, 1.25, 4, 64);

        var torus1Geometry = new THREE.TorusGeometry(1.2, 0.1, 16, 100);





        this.tuerca = new THREE.Mesh(geomtriaTuerca, material);

        this.tuboHueco = new THREE.Mesh(tuboHuecoGeometry, material);

        this.torus1 = new THREE.Mesh(torus1Geometry, material);
        this.torus1.rotation.x = Math.PI/2;

        this.torus2 = new THREE.Mesh(torus1Geometry, material);
        this.torus2.rotation.x = Math.PI/2;
        this.torus2.position.y += 0.33;

        this.torus3 = new THREE.Mesh(torus1Geometry, material);
        this.torus3.rotation.x = Math.PI/2;
        this.torus3.position.y += 0.66;

        this.torus4 = new THREE.Mesh(torus1Geometry, material);
        this.torus4.rotation.x = Math.PI/2;
        this.torus4.position.y += 1;

        this.torus5 = new THREE.Mesh(torus1Geometry, material);
        this.torus5.rotation.x = Math.PI/2;
        this.torus5.position.y -= 0.33;

        this.torus6 = new THREE.Mesh(torus1Geometry, material);
        this.torus6.rotation.x = Math.PI/2;
        this.torus6.position.y -= 0.66;


        var csg1 = new CSG();
        csg1.subtract([this.tuerca, this.tuboHueco]);
        csg1.subtract([this.torus1]);
        csg1.subtract([this.torus2]);
        csg1.subtract([this.torus3]);
        csg1.subtract([this.torus4]);
        csg1.subtract([this.torus5]);
        //csg1.subtract([this.torus6]);
        this.result = csg1.toMesh();

        this.add(this.result);


    }

    update(){

    }

}
export { Tuerca };