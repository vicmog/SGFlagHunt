import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';

class Taza extends THREE.Object3D{

    constructor(){
        super();
        var material = new THREE.MeshNormalMaterial();

        var cilindroGeometry = new THREE.CylinderGeometry(2, 2, 5, 32);
        var cilindroHuecoGeometry = new THREE.CylinderGeometry(1.75, 1.75, 6.74, 32);
        var torusGeometry = new THREE.TorusGeometry(1.75, 0.35, 16, 100);

        this.cilindro = new THREE.Mesh(cilindroGeometry, material);
        this.torus = new THREE.Mesh(torusGeometry, material);
        this.torus.position.x -= 1.75;
        this.cilindroHueco = new THREE.Mesh(cilindroHuecoGeometry, material);
        this.cilindroHueco.position.y += 1.75;

        var csg = new CSG();
        csg.union([this.cilindro, this.torus]);
        csg.subtract([this.cilindroHueco]);

        this.taza = csg.toMesh();

        this.add(this.taza);

    }

    update(){

    }

}

export {Taza};