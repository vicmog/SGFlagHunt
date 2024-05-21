import * as THREE from 'three';

class Estrella extends THREE.Object3D{
    createEstrella(material){
        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0.38, 1.18);
        shape.lineTo(-0.62, 1.9);
        shape.lineTo(0.62, 1.9);
        shape.lineTo(1, 3.08);
        shape.lineTo(1.38, 1.9);
        shape.lineTo(2.62, 1.9);
        shape.lineTo(1.62, 1.18);
        shape.lineTo(2, 0);
        shape.lineTo(1, 0.73);
        shape.lineTo(0, 0);
        const extrudeSettings = {
            steps: 5,
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 30
        };
        var estrellaGeometria = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        estrellaGeometria.translate(-1, 0, 0);
        this.estrella = new THREE.Mesh(estrellaGeometria, material);
        return this.estrella;
    }
    
    constructor(geometriaTubo,t){
        super();

        this.tubo = geometriaTubo;
        this.path = geometriaTubo.parameters.path;
        this.radio = geometriaTubo.parameters.radius;
        this.segmentos = geometriaTubo.parameters.tubularSegments;
        this.t = 0;
        this.alfa = 0;


        var material = new THREE.MeshStandardMaterial({
            color: 0xFFFFD700,
            roughness: 0.7,
            metalness: 0.1,
        });
        var estrella = this.createEstrella(material);
        
        //Nodo estrella
        this.estrella = new THREE.Object3D();
        this.estrella.add(estrella);

        // NODO TRASLACION Y
        var nodoTraslacionY = new THREE.Object3D();
        nodoTraslacionY.position.y = 0;
        nodoTraslacionY.add(this.estrella);
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

        var luz = new THREE.PointLight(0xFFFF00, 1, 100);
        luz.power = 1000;
        luz.position.set(0, 1, 0);

        nodoTraslacionY.add(luz);
        this.estrella.userData = "estrella";

        this.add(nodoPosOrientTubo);
    }

    update(){
        this.estrella.rotation.y += 0.01;
    }



}
export { Estrella };