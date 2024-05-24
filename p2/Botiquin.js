import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';

class Botiquin extends THREE.Object3D{
    asignarPos(geometriaTubo, t){
        this.tubo = geometriaTubo;
        this.path = geometriaTubo.parameters.path;
        this.radio = geometriaTubo.parameters.radius;
        this.segmentos = geometriaTubo.parameters.tubularSegments;
        this.alfa = 0;

        // NODO TRASLACION Y
        var nodoTraslacionY = new THREE.Object3D();
        nodoTraslacionY.position.y = 0;
        nodoTraslacionY.add(this.botiquin);
        nodoTraslacionY.position.y += this.radio + 0.05;

        // NODO ROTACION Z
        var nodoRotacionZ = new THREE.Object3D();
        nodoRotacionZ.add(nodoTraslacionY);
        nodoRotacionZ.rotateZ(this.alfa);

        // NODO POSICION Y ORIENTACION TUBO
        var nodoPosOrientTubo = new THREE.Object3D();
        nodoPosOrientTubo.add(nodoRotacionZ);
        var posTmp = this.path.getPointAt(t);
        nodoPosOrientTubo.position.copy(posTmp);

        var tangente = this.path.getTangentAt(t);
        posTmp.add(tangente);
        var segmentoActual = Math.floor(t * this.segmentos);
        nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
        nodoPosOrientTubo.lookAt(posTmp);

        return nodoPosOrientTubo;
    }
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
    constructor(geometriaTubo, t){
        super();
        var material = new THREE.MeshNormalMaterial();
        var colorBlanco = new THREE.Color(1,1,1);
        var colorRojo = new THREE.Color(1,0,0);
        var colorNegro = new THREE.Color(0,0,0);
        var materialCruz = new THREE.MeshBasicMaterial({color: colorBlanco});
        var materialBotiquin = new THREE.MeshBasicMaterial({color: colorRojo});
        var materialAsa = new THREE.MeshBasicMaterial({color: colorNegro});

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

        this.nodoPos = this.asignarPos(geometriaTubo, t);
        this.add(this.nodoPos);

        this.castShadow = true;
        this.receiveShadow = true;

        /*this.traverseVisible((unNodo) => {
            unNodo.castShadow = true;
            unNodo.receiveShadow = true;
        });*/
        

    }
    upadate(){
    }
}

export { Botiquin };