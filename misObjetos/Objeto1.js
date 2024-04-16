import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';



class Objeto1 extends THREE.Object3D{

    constructor(){
        super();
        var material = new THREE.MeshNormalMaterial();

        
        const shape = new THREE.Shape();

        shape.moveTo(0, 0);
        shape.lineTo(0, 5);
        shape.lineTo(3, 5);
        shape.quadraticCurveTo(5,4.5,5,3);
        shape.lineTo(5, 0);
        shape.lineTo(0,0);

        const extrudeSettings = {
            steps: 5,
            depth: 4,
            bevelEnabled: true,
            bevelThickness: 0.35,
            bevelSize: 0.35,
            bevelOffset: 0,
            bevelSegments: 5
        };


        var geometriaExtrusion = new THREE.ExtrudeGeometry(shape,extrudeSettings); 
        this.figuraExtrusion = new THREE.Mesh(geometriaExtrusion,material);

        var figuraCortarBaseGeometry = new THREE.BoxGeometry(11,1,11);
        figuraCortarBaseGeometry.translate(0,-0.5,0);
        this.figuraCortarBase = new THREE.Mesh(figuraCortarBaseGeometry,material);


        var csg = new CSG();

        csg.subtract([this.figuraExtrusion,this.figuraCortarBase]);

        this.figuraCortada = csg.toMesh();

        var shape2 = new THREE.Shape();
        shape2.moveTo(0, 0);
        shape2.lineTo(0, 2);
        shape2.lineTo(2, 2);
        shape2.lineTo(2, 0);
        shape2.lineTo(0, 0);

        const extrudeSettings2 = {
            steps: 5,
            depth: 4,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.15,
            bevelOffset: 0,
            bevelSegments: 8
        };



        var figuraCortarCuerpoGeometry = new THREE.ExtrudeGeometry(shape2,extrudeSettings2);

        figuraCortarCuerpoGeometry.scale(4,3,0.5);
        figuraCortarCuerpoGeometry.translate(0,0.75,1);

        this.figuraCortarCuerpo = new THREE.Mesh(figuraCortarCuerpoGeometry,material);

        var csg2 = new CSG();
        csg2.subtract([this.figuraCortada,this.figuraCortarCuerpo]);

        this.figuraCortada2 = csg2.toMesh();


        var cilindroVerticalCortarGeometry = new THREE.CylinderGeometry(0.5,0.5,10,32);
        cilindroVerticalCortarGeometry.rotateX(Math.PI/2);
        cilindroVerticalCortarGeometry.translate(1.6,2,0);
        cilindroVerticalCortarGeometry.scale(1,0.85,1);
        this.cilindroVerticalCortar = new THREE.Mesh(cilindroVerticalCortarGeometry,material);

        csg2 = new CSG();
        csg2.subtract([this.figuraCortada2,this.cilindroVerticalCortar]);

        this.figuraCortada3= csg2.toMesh();


        var cilindroCortarBaseGeometry = new THREE.CylinderGeometry(1.75,0.2,1,32);
       
        cilindroCortarBaseGeometry.scale(1,1,0.65);
        cilindroCortarBaseGeometry.translate(2.5,0.4,2);

        this.cilindroCortarBase = new THREE.Mesh(cilindroCortarBaseGeometry,material);

        csg2 = new CSG();
        csg2.subtract([this.figuraCortada3,this.cilindroCortarBase]);

        this.figuraCortadaFinal= csg2.toMesh();

        this.add(this.figuraCortadaFinal);
        

 
        




      
        
    }


    update(){

    }

}

export{Objeto1}