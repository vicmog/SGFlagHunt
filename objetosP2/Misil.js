import * as THREE from 'three';

class Misil extends THREE.Object3D{
    constructor() {
        super();
        var material = new THREE.MeshNormalMaterial();
        var perfil = [
            new THREE.Vector2(0.01, 4.15),
            new THREE.Vector2(0.1, 4.2),
            new THREE.Vector2(0.25, 4.8),
            new THREE.Vector2(0.45, 5.2),
            new THREE.Vector2(0.5, 5.5),
            new THREE.Vector2(0.65, 6.2),
            new THREE.Vector2(0.85, 7),
            new THREE.Vector2(0.9, 7.9),
            new THREE.Vector2(1, 8.5),
            new THREE.Vector2(1, 9),
            new THREE.Vector2(1.1, 10),
            new THREE.Vector2(1.1, 11),
            new THREE.Vector2(1.1, 11.75),
            new THREE.Vector2(1.1, 11.5),
            new THREE.Vector2(1, 13.1),
            new THREE.Vector2(0.5, 13),
            new THREE.Vector2(0.0001, 13)
            
            
        ];

        var shapeCohete = new THREE.Shape();
        shapeCohete.moveTo(0, 0);
        shapeCohete.quadraticCurveTo(1.8, 3.5, 0, 5);
        
        

        var cuerpoMisilGeometry = new THREE.LatheGeometry(shapeCohete.getPoints(), 20, 0, 2*Math.PI);
        cuerpoMisilGeometry.rotateZ(Math.PI);
        cuerpoMisilGeometry.scale(1.25,1.25,1.25);
        cuerpoMisilGeometry.translate(0, 7, 0);

        var shape = new THREE.Shape();
        shape.moveTo(0, 3);
        shape.lineTo(0, 6);
        shape.quadraticCurveTo(3, 6, 4, 0);
        shape.quadraticCurveTo(2.2, 2.8, 0, 3);

        const extrudeSettings = {
            steps: 10,
            depth: 1,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        };

        var cuerpoPataMisilGeometry = new THREE.ExtrudeGeometry(shape,extrudeSettings);
        cuerpoPataMisilGeometry.scale(0.5,0.5,0.5);
        cuerpoPataMisilGeometry.translate(0.7, 0, 0);

        this.cuerpoPataMisil = new THREE.Mesh(cuerpoPataMisilGeometry, material);
    
        
        this.cuerpoMisil = new THREE.Mesh(cuerpoMisilGeometry, material);
        this.pata2 = this.cuerpoPataMisil.clone();
        this.pata2.rotation.y = Math.PI/2;
        this.pata3 = this.cuerpoPataMisil.clone();
        this.pata3.rotation.y = Math.PI;

        this.pata4 = this.cuerpoPataMisil.clone();
        this.pata4.rotation.y = -Math.PI/2;
        
        this.add(this.cuerpoMisil);
        this.add(this.cuerpoPataMisil);
        this.add(this.pata2);
        this.add(this.pata3);
        this.add(this.pata4);
    }

    update(){

        this.rotation.y += 0.01;

    }
}

export { Misil };