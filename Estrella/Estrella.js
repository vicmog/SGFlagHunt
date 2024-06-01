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
    constructor(){
        super();

        var material = new THREE.MeshStandardMaterial({
            color: 0xFFFFD700,
            roughness: 0.7,
            metalness: 0.1,
        });
        var estrella = this.createEstrella(material);
        
        //Nodo estrella
        this.estrella = new THREE.Object3D();
        this.estrella.add(estrella);

        this.add(this.estrella);
    }

    update(){
        this.estrella.rotation.y += 0.01;
    }



}
export { Estrella };