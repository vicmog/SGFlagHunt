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
        this.estrella = new THREE.Mesh(estrellaGeometria, material);
        return this.estrella;
    }
    constructor(){
        super();
        var material = new THREE.MeshNormalMaterial();
        this.estrella = this.createEstrella(material);
        this.add(this.estrella);
    }



}
export { Estrella };