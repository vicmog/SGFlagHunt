import * as THREE from 'three';

class Bandera extends THREE.Object3D{
    createBandera(material){
        var shape = new THREE.Shape();
        // shape.moveTo(0,0);
        // shape.quadraticCurveTo(0.5,0.5,1,0);
        // shape.quadraticCurveTo(1.5,-0.5,2,0);
        // shape.quadraticCurveTo(2.5,0.5,3,0);
        // shape.lineTo(3,2);
        // shape.quadraticCurveTo(2.5,2.5,2,2);
        // shape.quadraticCurveTo(1.5,1.5,1,2);
        // shape.quadraticCurveTo(0.5,2.5,0,2);
        // shape.lineTo(0,0);

        // INTENTO 1
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(0.5, -0.2, 1, 0); // Primer tramo
        shape.quadraticCurveTo(1.5, 0.2, 2, 0); // Segundo tramo
        shape.quadraticCurveTo(2.5, -0.2, 3, 0); // Tercer tramo

        // Parte inferior de la bandera
        shape.lineTo(3, 2); // Línea hacia abajo
        shape.quadraticCurveTo(2.7, 2.2, 2, 2); // Primer curva hacia arriba
        shape.quadraticCurveTo(1.3, 1.8, 1, 2); // Segunda curva hacia arriba
        shape.quadraticCurveTo(0.7, 2.2, 0, 2); // Tercera curva hacia arriba

        shape.lineTo(0, 0); // Volver al punto inicial para cerrar la forma


        const extrudeSettings = {
            steps: 5,
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 30
        };

        var banderaGeometria = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        this.bandera = new THREE.Mesh(banderaGeometria, material);
        return this.bandera;
    }


    constructor(){
        super();
        var material = new THREE.MeshNormalMaterial();

        var cilindroGeometry = new THREE.CylinderGeometry(0.2,0.2,6,32);
        this.cilindro = new THREE.Mesh(cilindroGeometry, material);
        this.cilindro.position.set(0,3,0);
        this.add(this.cilindro);
        this.bandera = this.createBandera(material);
        this.bandera.position.set(0,4,-0.1);
        this.add(this.bandera);
        
    }
}

export { Bandera };