import * as THREE from 'three';
import { MTLLoader } from '../libs/MTLLoader.js';
import { OBJLoader } from '../libs/OBJLoader.js';

class ModeloCargado extends THREE.Object3D{

    constructor(pathMaterial, pathObject) {
        super();
        let  materialLoader = new MTLLoader();
        let objectLoader = new OBJLoader();
        
        materialLoader.load ('../models/porsche911/911.mtl',
        (materials) => {
            objectLoader.setMaterials(materials);
            objectLoader.load('../models/porsche911/Porsche_911_GT2.obj',
            (object) => {
                this.add(object);
                console.log(object);
            },null,null) ;
        } ); 
        
        
    }

    update(){

    }
}

export { ModeloCargado };