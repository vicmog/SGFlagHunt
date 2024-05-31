import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';

class Botiquin extends THREE.Object3D{

    createCuerpo(material){
        var shape = new THREE.Shape();
        shape.moveTo(0.5,0);
        shape.lineTo(3.5,0);
        shape.quadraticCurveTo(4,0,4,0.5);
        shape.lineTo(4,2.5);
        shape.quadraticCurveTo(4,3,3.5,3);
        shape.lineTo(0.5,3);
        shape.quadraticCurveTo(0,3,0,2.5);
        shape.lineTo(0,0.5);
        shape.quadraticCurveTo(0,0,0.5,0);

        const extrudeSettings = {
            steps: 5,
            depth: 1,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.3,
            bevelOffset: 0,
            bevelSegments: 30
        };
        var cuerpoBotiquinGeometria = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        this.cuerpoBotiquin = new THREE.Mesh(cuerpoBotiquinGeometria, material);
        return this.cuerpoBotiquin;
    }
    createAsa(material){
        var asaGeometria = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
        //Trasladar la geometria
        asaGeometria.scale(1.1, 1, 1.0);
        asaGeometria.translate(2, 3.3, 0.5);
        
        this.asa = new THREE.Mesh(asaGeometria, material);
        return this.asa;
    }
    createCruz(material){
        var cuboGeometry1 = new THREE.BoxGeometry(1, 2, 0.5);
        this.cruz1 = new THREE.Mesh(cuboGeometry1, material);
        var cuboGeometry2 = new THREE.BoxGeometry(2, 1, 0.5);
        this.cruz2 = new THREE.Mesh(cuboGeometry2, material);
        var csg = new CSG();
        csg.union([this.cruz1, this.cruz2]);
        var cruz = csg.toMesh(material);
        return cruz;
    }
    constructor(){
        super();
        //MATERIAL BASADO EN COLOR
        var material = new THREE.MeshNormalMaterial();
        var colorBlanco = new THREE.Color(1,1,1);
        var colorRojo = new THREE.Color(1,0,0);
        var colorNegro = new THREE.Color(0,0,0);
        var materialCruz = new THREE.MeshStandardMaterial({color: colorBlanco});
        var materialBotiquin = new THREE.MeshStandardMaterial({color: colorRojo});
        var materialAsa = new THREE.MeshStandardMaterial({color: colorNegro});


        this.cuerpoBotiquin = this.createCuerpo(materialBotiquin);
        this.asa = this.createAsa(materialAsa);
        this.cruz = this.createCruz(materialCruz);
        this.cruz.position.set(2, 1.5, 1.2);
        this.cruztrasera = this.createCruz(materialCruz);
        this.cruztrasera.position.set(2, 1.5, -0.2);

        // NODO BOTIQUIN
        this.botiquin = new THREE.Object3D();
        this.botiquin.add(this.cuerpoBotiquin);
        this.botiquin.add(this.asa);
        this.botiquin.add(this.cruz);
        this.botiquin.add(this.cruztrasera);
        this.botiquin.scale.set(0.5, 0.5, 0.5);
        this.botiquin.userData = "botiquin";

        this.botiquin.position.x -=1;
        this.botiquin.position.z -= 0.2;

   
        this.add(this.botiquin);   

    }

    upadate(){

    }
}

export { Botiquin };