
import * as THREE from 'three';
import { MTLLoader } from '../libs/MTLLoader.js';
import { OBJLoader } from '../libs/OBJLoader.js';

class MuroCargado extends THREE.Object3D{
    constructor() {
        super();
        let  materialLoader = new MTLLoader();
        let objectLoader = new OBJLoader();
        
        materialLoader.load ('../models/wall.mtl',
        (materials) => {
            objectLoader.setMaterials(materials);
            objectLoader.load('../models/wall.obj',
            (object) => {
                this.add(object);
                console.log(object);
            },null,null) ;
        } ); 

        
    }

    update(){

    }
}

export { MuroCargado };